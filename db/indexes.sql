DROP INDEX IF EXISTS idx_orders_created_date;
DROP INDEX IF EXISTS idx_orders_customer_status;
DROP INDEX IF EXISTS idx_order_items_product;
DROP INDEX IF EXISTS idx_products_category_active;
DROP INDEX IF EXISTS idx_products_stock_risk;
DROP INDEX IF EXISTS idx_payments_method;

-- ============================================

CREATE INDEX idx_orders_created_date 
ON orders(created_at, status) 
WHERE status = 'completed';

-- ============================================

CREATE INDEX idx_orders_customer_status 
ON orders(customer_id, status, created_at);

-- ============================================

-- Mejora: Agregaciones por producto
CREATE INDEX idx_order_items_product 
ON order_items(product_id, qty, unit_price);

-- ============================================

CREATE INDEX idx_products_category_active 
ON products(category_id, active, stock) 
WHERE active = TRUE;

-- ============================================

CREATE INDEX idx_products_stock_risk 
ON products(stock, min_stock, active) 
WHERE stock < min_stock AND active = TRUE;

-- ============================================

CREATE INDEX idx_payments_method 
ON payments(method, paid_amount);