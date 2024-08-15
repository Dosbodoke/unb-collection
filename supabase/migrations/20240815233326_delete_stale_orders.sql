CREATE OR REPLACE FUNCTION delete_stale_orders () RETURNS void AS $$
DECLARE
    v_order_id bigint;
    v_product_id bigint;
    v_quantity bigint;
BEGIN
    FOR v_order_id, v_product_id, v_quantity IN
        SELECT od.id, oi.product_id, oi.quantity
        FROM order_details od
        JOIN order_items oi ON od.id = oi.order_id
        WHERE od.status = 'pending' AND od.created_at < now() - interval '1 day'
    LOOP
        DELETE FROM order_items WHERE order_id = v_order_id;
        UPDATE products_skus SET stock = stock + v_quantity WHERE id = v_product_id;
        DELETE FROM order_details WHERE id = v_order_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Install pg_cron extension if not already installed
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the function to execute every day at midnight
select cron.schedule('clean_orders', '0 0 * * *', 'SELECT delete_stale_orders()');
