drop function if exists "public"."create_order"(user_id uuid, items_list json);

alter table "public"."order_details" add column "notes" text;

alter table "public"."order_details" add column "payment_data" jsonb;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_order(user_id uuid, items_list json, notes text)
 RETURNS SETOF order_items
 LANGUAGE plpgsql
AS $function$
DECLARE
    order_id bigint;
    item json;
    unavailable_items text[];
    order_item_record public.order_items;
BEGIN
    -- Start a transaction
    BEGIN
        -- Create the order
        INSERT INTO public.order_details (created_at, status, user_id, notes)
        VALUES (CURRENT_TIMESTAMP, 'pending', user_id, notes)
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
$function$
;

create policy "Enable update"
on "public"."order_details"
as permissive
for insert
to authenticated, anon
with check (true);



