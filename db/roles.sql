DROP ROLE IF EXISTS app_user;

-- ============================================

CREATE ROLE app_user
WITH LOGIN
PASSWORD 'app_secure_pass_2024';

-- ============================================

GRANT CONNECT ON DATABASE "CafeCampus" TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- ============================================

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM app_user;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM app_user;

-- ============================================

ALTER DEFAULT PRIVILEGES IN SCHEMA public
REVOKE ALL ON TABLES FROM app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
REVOKE ALL ON SEQUENCES FROM app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
REVOKE ALL ON FUNCTIONS FROM app_user;

-- ============================================

GRANT SELECT ON vw_sales_daily TO app_user;
GRANT SELECT ON vw_top_products_ranked TO app_user;
GRANT SELECT ON vw_inventory_risk TO app_user;
GRANT SELECT ON vw_customer_value TO app_user;
GRANT SELECT ON vw_payment_mix TO app_user;
GRANT SELECT ON vw_categories TO app_user;
