DROP VIEW IF EXISTS vw_sales_daily CASCADE;
DROP VIEW IF EXISTS vw_top_products_ranked CASCADE;
DROP VIEW IF EXISTS vw_inventory_risk CASCADE;
DROP VIEW IF EXISTS vw_customer_value CASCADE;
DROP VIEW IF EXISTS vw_payment_mix CASCADE;

-- ============================================

CREATE VIEW vw_sales_daily AS
SELECT 
    DATE(o.created_at) as fecha,
    COUNT(DISTINCT o.order_id) as tickets,
    COALESCE(SUM(oi.qty * oi.unit_price), 0) as total_ventas,
    COALESCE(ROUND(SUM(oi.qty * oi.unit_price) / COUNT(DISTINCT o.order_id), 2), 0) as ticket_promedio,
    SUM(oi.qty) as productos_vendidos,
    CASE 
        WHEN COUNT(DISTINCT o.order_id) >= 5 THEN 'Alto'
        WHEN COUNT(DISTINCT o.order_id) >= 3 THEN 'Medio'
        ELSE 'Bajo'
    END as nivel_actividad
FROM orders o
INNER JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.status = 'completed'
GROUP BY DATE(o.created_at)
HAVING COUNT(DISTINCT o.order_id) > 0
ORDER BY fecha DESC;

-- ============================================

CREATE VIEW vw_top_products_ranked AS
WITH product_sales AS (
    SELECT 
        p.product_id,
        p.name as producto_nombre,
        c.name as categoria,
        COALESCE(SUM(oi.qty * oi.unit_price), 0) as revenue,
        COALESCE(SUM(oi.qty), 0) as unidades_vendidas,
        COUNT(DISTINCT oi.order_id) as num_ordenes
    FROM products p
    LEFT JOIN order_items oi ON p.product_id = oi.product_id
    LEFT JOIN categories c ON p.category_id = c.category_id
    WHERE p.active = TRUE
    GROUP BY p.product_id, p.name, c.name
    HAVING COALESCE(SUM(oi.qty), 0) > 0
)
SELECT 
    product_id,
    producto_nombre,
    categoria,
    revenue,
    unidades_vendidas,
    num_ordenes,
    ROUND(revenue / NULLIF(unidades_vendidas, 0), 2) as precio_promedio,
    RANK() OVER (ORDER BY revenue DESC) as ranking_revenue,
    RANK() OVER (ORDER BY unidades_vendidas DESC) as ranking_unidades,
    CASE 
        WHEN revenue >= 1000 THEN 'Estrella'
        WHEN revenue >= 500 THEN 'Popular'
        WHEN revenue >= 100 THEN 'Regular'
        ELSE 'Bajo desempeño'
    END as clasificacion
FROM product_sales
ORDER BY revenue DESC;

-- ============================================

CREATE VIEW vw_inventory_risk AS
SELECT 
    p.product_id,
    p.name as producto_nombre,
    c.name as categoria,
    c.category_id,
    p.stock as stock_actual,
    p.min_stock as stock_minimo,
    ROUND(((p.min_stock - p.stock)::DECIMAL / NULLIF(p.min_stock, 0)) * 100, 2) as porcentaje_riesgo,
    COALESCE(
        ROUND(p.stock::DECIMAL / NULLIF(
            (SELECT AVG(oi.qty) 
             FROM order_items oi 
             WHERE oi.product_id = p.product_id 
               AND oi.order_id IN (
                   SELECT order_id 
                   FROM orders 
                   WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
               )
            ), 0
        ), 1),
        999
    ) as dias_stock_estimado,
    CASE 
        WHEN p.stock = 0 THEN 'CRÍTICO - SIN STOCK'
        WHEN p.stock < p.min_stock * 0.3 THEN 'CRÍTICO'
        WHEN p.stock < p.min_stock * 0.5 THEN 'ALTO'
        WHEN p.stock < p.min_stock THEN 'MEDIO'
        ELSE 'NORMAL'
    END as nivel_alerta,
    s.name as proveedor
FROM products p
INNER JOIN categories c ON p.category_id = c.category_id
LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
WHERE p.active = TRUE 
  AND p.stock < p.min_stock
ORDER BY p.stock::DECIMAL / NULLIF(p.min_stock, 1) ASC;

-- ============================================

CREATE VIEW vw_customer_value AS
SELECT 
    c.customer_id,
    c.name as cliente_nombre,
    c.email,
    COUNT(DISTINCT o.order_id) as num_ordenes,
    COALESCE(SUM(oi.qty * oi.unit_price), 0) as total_gastado,
    ROUND(COALESCE(SUM(oi.qty * oi.unit_price), 0) / NULLIF(COUNT(DISTINCT o.order_id), 0), 2) as gasto_promedio,
    MAX(o.created_at) as ultima_compra,
    CASE 
        WHEN COALESCE(SUM(oi.qty * oi.unit_price), 0) >= 1000 THEN 'VIP'
        WHEN COALESCE(SUM(oi.qty * oi.unit_price), 0) >= 500 THEN 'Frecuente'
        WHEN COALESCE(SUM(oi.qty * oi.unit_price), 0) >= 100 THEN 'Regular'
        ELSE 'Nuevo'
    END as segmento
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status = 'completed'
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY c.customer_id, c.name, c.email
HAVING COUNT(DISTINCT o.order_id) > 0
ORDER BY total_gastado DESC;

-- ============================================

CREATE VIEW vw_payment_mix AS
SELECT 
    p.method as metodo_pago,
    COUNT(p.payment_id) as total_transacciones,
    SUM(p.paid_amount) as monto_total,
    ROUND(
        (SUM(p.paid_amount) / (SELECT SUM(paid_amount) FROM payments) * 100), 
        2
    ) as porcentaje,
    ROUND(AVG(p.paid_amount), 2) as ticket_promedio,
    CASE 
        WHEN p.method = 'efectivo' THEN 'Tradicional'
        WHEN p.method = 'tarjeta' THEN 'Digital'
        WHEN p.method = 'transferencia' THEN 'Digital'
        ELSE 'Otro'
    END as tipo_metodo
FROM payments p
GROUP BY p.method
HAVING COUNT(p.payment_id) > 0
ORDER BY monto_total DESC;