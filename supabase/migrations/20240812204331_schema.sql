
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."product_attribute_type" AS ENUM (
    'color',
    'size'
);

ALTER TYPE "public"."product_attribute_type" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "product_id" bigint NOT NULL,
    "quantity" bigint NOT NULL,
    "order_id" bigint NOT NULL
);

ALTER TABLE "public"."order_items" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_order"("user_id" "uuid", "items_list" "json") RETURNS SETOF "public"."order_items"
    LANGUAGE "plpgsql"
    AS $$ 
DECLARE 
    order_id bigint; 
    item json; 
    unavailable_items text[]; 
    order_item_record public.order_items; 
BEGIN 
    -- Start a transaction 
    BEGIN 
        -- Create the order 
        INSERT INTO public.order_details (created_at, status, user_id) 
        VALUES (CURRENT_TIMESTAMP, 'pending', user_id) 
        RETURNING id INTO order_id; 
        
        -- Loop through the items list 
        FOR item IN SELECT * FROM json_array_elements(items_list) 
        LOOP 
            -- Check if the item quantity is available 
            IF (SELECT stock FROM public.products_skus WHERE id = (item->>'id')::bigint) >= (item->>'quantity')::numeric THEN 
                -- Create the order item 
                INSERT INTO public.order_items (created_at, product_id, quantity, order_id) 
                VALUES (CURRENT_TIMESTAMP, (item->>'id')::bigint, (item->>'quantity')::bigint, order_id) 
                RETURNING * INTO order_item_record; 
                
                -- Subtract the quantity from the product stock 
                UPDATE public.products_skus 
                SET stock = stock - (item->>'quantity')::numeric 
                WHERE id = (item->>'id')::bigint; 
                
                -- Return the order item record 
                RETURN NEXT order_item_record; 
            ELSE 
                -- Add the item to the unavailable items list 
                unavailable_items := array_append(unavailable_items, item->>'id'); 
            END IF; 
        END LOOP; 
        
        -- Check if there are unavailable items 
        IF array_length(unavailable_items, 1) > 0 THEN 
            -- Rollback the transaction and return the list of unavailable items 
            RAISE EXCEPTION 'The following items are not available: %', array_to_string(unavailable_items, ', '); 
        ELSE 
            -- Commit the transaction and return all order_items records 
            RETURN; 
        END IF; 
    END; 
END; 
$$;

ALTER FUNCTION "public"."create_order"("user_id" "uuid", "items_list" "json") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_pending_orders"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    order_id bigint;
    product_id bigint;
    quantity bigint;
BEGIN
    FOR order_id, product_id, quantity IN 
        SELECT od.id, oi.product_id, oi.quantity
        FROM order_details od
        JOIN order_items oi ON od.id = oi.order_id
        WHERE od.status = 'pending' AND od.created_at < now() - interval '1 day'
    LOOP
        DELETE FROM order_items WHERE order_id = order_id;
        UPDATE products_skus SET stock = stock + quantity WHERE id = product_id;
        DELETE FROM order_details WHERE id = order_id;
    END LOOP;
END;
$$;

ALTER FUNCTION "public"."delete_pending_orders"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."category" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL
);

ALTER TABLE "public"."category" OWNER TO "postgres";

COMMENT ON TABLE "public"."category" IS 'Separate the products in categories';

ALTER TABLE "public"."category" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."category_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."highlights" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "product_id" bigint NOT NULL
);

ALTER TABLE "public"."highlights" OWNER TO "postgres";

COMMENT ON TABLE "public"."highlights" IS 'Highlited products';

ALTER TABLE "public"."highlights" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."highlights_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."newsletter_subscriptions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text"
);

ALTER TABLE "public"."newsletter_subscriptions" OWNER TO "postgres";

ALTER TABLE "public"."newsletter_subscriptions" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."newsletter_subscriptions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."order_details" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "text" NOT NULL
);

ALTER TABLE "public"."order_details" OWNER TO "postgres";

COMMENT ON TABLE "public"."order_details" IS 'An order instance';

ALTER TABLE "public"."order_details" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."order_details_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."order_items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."order_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."product" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "category_id" bigint NOT NULL,
    "slug" "text" NOT NULL,
    "cover" "text",
    "images" "text"[] DEFAULT '{}'::"text"[] NOT NULL
);

ALTER TABLE "public"."product" OWNER TO "postgres";

COMMENT ON COLUMN "public"."product"."cover" IS 'Path of the product cover image';

COMMENT ON COLUMN "public"."product"."images" IS 'The product images, they should be stored on the bucket `products`';

CREATE TABLE IF NOT EXISTS "public"."product_attributes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp without time zone,
    "value" "text" NOT NULL,
    "type" "public"."product_attribute_type"
);

ALTER TABLE "public"."product_attributes" OWNER TO "postgres";

COMMENT ON TABLE "public"."product_attributes" IS 'Attributes for a product';

ALTER TABLE "public"."product_attributes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."product_attributes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."product" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."product_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."products_skus" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "product_id" bigint NOT NULL,
    "size_attribute_id" bigint NOT NULL,
    "color_attribute_id" bigint NOT NULL,
    "price" numeric NOT NULL,
    "stock" numeric DEFAULT '0'::numeric NOT NULL,
    "deleted_at" timestamp without time zone
);

ALTER TABLE "public"."products_skus" OWNER TO "postgres";

COMMENT ON TABLE "public"."products_skus" IS 'Variations of a product';

ALTER TABLE "public"."products_skus" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."products_skus_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text"
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."shopping_cart" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."shopping_cart" OWNER TO "postgres";

COMMENT ON TABLE "public"."shopping_cart" IS 'Represent the cart of a User';

ALTER TABLE "public"."shopping_cart" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."shopping_cart_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."shopping_cart_item" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "cart_id" bigint NOT NULL,
    "product_item_id" bigint NOT NULL,
    "qty" bigint DEFAULT '1'::bigint NOT NULL
);

ALTER TABLE "public"."shopping_cart_item" OWNER TO "postgres";

COMMENT ON TABLE "public"."shopping_cart_item" IS 'Item added to an specific user cart';

ALTER TABLE "public"."shopping_cart_item" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."shopping_cart_item_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."category"
    ADD CONSTRAINT "category_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."category"
    ADD CONSTRAINT "category_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."category"
    ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."highlights"
    ADD CONSTRAINT "highlights_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."highlights"
    ADD CONSTRAINT "highlights_product_id_key" UNIQUE ("product_id");

ALTER TABLE ONLY "public"."newsletter_subscriptions"
    ADD CONSTRAINT "newsletter_subscriptions_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."newsletter_subscriptions"
    ADD CONSTRAINT "newsletter_subscriptions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."order_details"
    ADD CONSTRAINT "order_details_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."product_attributes"
    ADD CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."product"
    ADD CONSTRAINT "product_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."product"
    ADD CONSTRAINT "product_slug_key" UNIQUE ("slug");

ALTER TABLE ONLY "public"."products_skus"
    ADD CONSTRAINT "products_skus_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."shopping_cart_item"
    ADD CONSTRAINT "shopping_cart_item_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."shopping_cart"
    ADD CONSTRAINT "shopping_cart_pkey" PRIMARY KEY ("id");

CREATE INDEX "idx_order_details_user_id" ON "public"."order_details" USING "btree" ("user_id");

CREATE INDEX "idx_order_items_order_id" ON "public"."order_items" USING "btree" ("order_id");

CREATE INDEX "idx_order_items_order_id_fkey" ON "public"."order_items" USING "btree" ("order_id");

CREATE INDEX "idx_order_items_product_id" ON "public"."order_items" USING "btree" ("product_id");

CREATE INDEX "idx_product_category_id_fkey" ON "public"."product" USING "btree" ("category_id");

CREATE INDEX "idx_products_skus_color_attribute_id" ON "public"."products_skus" USING "btree" ("color_attribute_id");

CREATE INDEX "idx_products_skus_product_id" ON "public"."products_skus" USING "btree" ("product_id");

ALTER TABLE ONLY "public"."highlights"
    ADD CONSTRAINT "highlights_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."order_details"
    ADD CONSTRAINT "order_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."order_details"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products_skus"("id");

ALTER TABLE ONLY "public"."product"
    ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."product"
    ADD CONSTRAINT "product_category_id_fkey1" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."products_skus"
    ADD CONSTRAINT "products_skus_color_attribute_id_fkey" FOREIGN KEY ("color_attribute_id") REFERENCES "public"."product_attributes"("id");

ALTER TABLE ONLY "public"."products_skus"
    ADD CONSTRAINT "products_skus_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id");

ALTER TABLE ONLY "public"."products_skus"
    ADD CONSTRAINT "products_skus_size_attribute_id_fkey" FOREIGN KEY ("size_attribute_id") REFERENCES "public"."product_attributes"("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."shopping_cart_item"
    ADD CONSTRAINT "shopping_cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "public"."shopping_cart"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."shopping_cart_item"
    ADD CONSTRAINT "shopping_cart_item_product_item_id_fkey" FOREIGN KEY ("product_item_id") REFERENCES "public"."products_skus"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."shopping_cart"
    ADD CONSTRAINT "shopping_cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Enable insert for all users" ON "public"."newsletter_subscriptions" FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."order_details" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."order_items" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."category" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."highlights" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."newsletter_subscriptions" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."product" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."product_attributes" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."products_skus" FOR SELECT USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."order_items" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for users based on user_id" ON "public"."order_details" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable update for authenticated users only" ON "public"."products_skus" FOR UPDATE TO "authenticated" USING (true);

ALTER TABLE "public"."category" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."highlights" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."newsletter_subscriptions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."order_details" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."product" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."product_attributes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."products_skus" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."shopping_cart" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."shopping_cart_item" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";

GRANT ALL ON FUNCTION "public"."create_order"("user_id" "uuid", "items_list" "json") TO "anon";
GRANT ALL ON FUNCTION "public"."create_order"("user_id" "uuid", "items_list" "json") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_order"("user_id" "uuid", "items_list" "json") TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_pending_orders"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_pending_orders"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_pending_orders"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON TABLE "public"."category" TO "anon";
GRANT ALL ON TABLE "public"."category" TO "authenticated";
GRANT ALL ON TABLE "public"."category" TO "service_role";

GRANT ALL ON SEQUENCE "public"."category_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."category_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."category_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."highlights" TO "anon";
GRANT ALL ON TABLE "public"."highlights" TO "authenticated";
GRANT ALL ON TABLE "public"."highlights" TO "service_role";

GRANT ALL ON SEQUENCE "public"."highlights_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."highlights_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."highlights_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."newsletter_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."newsletter_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."newsletter_subscriptions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."newsletter_subscriptions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."newsletter_subscriptions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."newsletter_subscriptions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."order_details" TO "anon";
GRANT ALL ON TABLE "public"."order_details" TO "authenticated";
GRANT ALL ON TABLE "public"."order_details" TO "service_role";

GRANT ALL ON SEQUENCE "public"."order_details_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."order_details_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."order_details_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."order_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."order_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."order_items_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."product" TO "anon";
GRANT ALL ON TABLE "public"."product" TO "authenticated";
GRANT ALL ON TABLE "public"."product" TO "service_role";

GRANT ALL ON TABLE "public"."product_attributes" TO "anon";
GRANT ALL ON TABLE "public"."product_attributes" TO "authenticated";
GRANT ALL ON TABLE "public"."product_attributes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."product_attributes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."product_attributes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."product_attributes_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."product_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."product_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."product_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."products_skus" TO "anon";
GRANT ALL ON TABLE "public"."products_skus" TO "authenticated";
GRANT ALL ON TABLE "public"."products_skus" TO "service_role";

GRANT ALL ON SEQUENCE "public"."products_skus_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."products_skus_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."products_skus_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."shopping_cart" TO "anon";
GRANT ALL ON TABLE "public"."shopping_cart" TO "authenticated";
GRANT ALL ON TABLE "public"."shopping_cart" TO "service_role";

GRANT ALL ON SEQUENCE "public"."shopping_cart_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shopping_cart_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shopping_cart_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."shopping_cart_item" TO "anon";
GRANT ALL ON TABLE "public"."shopping_cart_item" TO "authenticated";
GRANT ALL ON TABLE "public"."shopping_cart_item" TO "service_role";

GRANT ALL ON SEQUENCE "public"."shopping_cart_item_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shopping_cart_item_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shopping_cart_item_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
