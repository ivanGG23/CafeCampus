DROP ROLE IF EXISTS app_user;

-- ============================================

CREATE ROLE app_user WITH LOGIN PASSWORD 'app_secure_pass_2024';

-- ============================================

GRANT CONNECT ON DATABASE "CafeCampus" TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- ============================================

GRANT SELECT ON vw_sales_daily TO app_user;
GRANT SELECT ON vw_top_products_ranked TO app_user;
GRANT SELECT ON vw_inventory_risk TO app_user;
GRANT SELECT ON vw_customer_value TO app_user;
GRANT SELECT ON vw_payment_mix TO app_user;

-- ============================================

REVOKE ALL ON TABLE categories FROM app_user;
REVOKE ALL ON TABLE suppliers FROM app_user;
REVOKE ALL ON TABLE products FROM app_user;
REVOKE ALL ON TABLE customers FROM app_user;
REVOKE ALL ON TABLE orders FROM app_user;
REVOKE ALL ON TABLE order_items FROM app_user;
REVOKE ALL ON TABLE payments FROM app_user;