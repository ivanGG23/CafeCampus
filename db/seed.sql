TRUNCATE TABLE payments,
order_items,
orders,
customers,
products,
suppliers,
categories
RESTART IDENTITY CASCADE;

INSERT INTO
    categories (name, description)
VALUES (
        'Bebidas Calientes',
        'Café, té, chocolate caliente'
    ),
    (
        'Bebidas Frías',
        'Refrescos, jugos, smoothies, frappés'
    ),
    (
        'Panadería',
        'Pan dulce, croissants, muffins, donas'
    ),
    (
        'Snacks',
        'Galletas, frituras, chocolates, barras'
    ),
    (
        'Alimentos',
        'Sandwiches, ensaladas, wraps, platillos'
    );

INSERT INTO
    suppliers (
        name,
        contact,
        email,
        phone,
        address
    )
VALUES (
        'Café del Valle SA',
        'Juan Pérez',
        'ventas@cafedelvalle.com',
        '961-123-4567',
        'Av. Central 123, Tuxtla Gutiérrez'
    ),
    (
        'Panadería La Esperanza',
        'María García',
        'pedidos@laesperanza.com',
        '961-765-4321',
        'Calle Comercio 456, San Cristóbal'
    ),
    (
        'Distribuidora RefrescoMax',
        'Carlos Ruiz',
        'info@refrescomax.com',
        '961-901-2345',
        'Zona Industrial #789, Chiapa de Corzo'
    );

INSERT INTO
    products (
        name,
        category_id,
        supplier_id,
        price,
        stock,
        min_stock,
        active
    )
VALUES (
        'Café Americano',
        1,
        1,
        25.00,
        150,
        30,
        TRUE
    ),
    (
        'Café Latte',
        1,
        1,
        35.00,
        120,
        25,
        TRUE
    ),
    (
        'Cappuccino',
        1,
        1,
        38.00,
        100,
        25,
        TRUE
    ),
    (
        'Té Verde',
        1,
        1,
        28.00,
        80,
        20,
        TRUE
    ),
    (
        'Chocolate Caliente',
        1,
        1,
        32.00,
        8,
        20,
        TRUE
    ),
    (
        'Jugo de Naranja',
        2,
        3,
        30.00,
        90,
        20,
        TRUE
    ),
    (
        'Smoothie Fresa',
        2,
        3,
        45.00,
        60,
        15,
        TRUE
    ),
    (
        'Agua Natural',
        2,
        3,
        15.00,
        200,
        50,
        TRUE
    ),
    (
        'Refresco Cola',
        2,
        3,
        20.00,
        180,
        40,
        TRUE
    ),
    (
        'Frappé Moka',
        2,
        1,
        50.00,
        5,
        15,
        TRUE
    ),
    (
        'Croissant',
        3,
        2,
        22.00,
        50,
        15,
        TRUE
    ),
    (
        'Muffin Chocolate',
        3,
        2,
        28.00,
        45,
        15,
        TRUE
    ),
    (
        'Pan Dulce',
        3,
        2,
        18.00,
        70,
        20,
        TRUE
    ),
    (
        'Donut Glaseada',
        3,
        2,
        20.00,
        7,
        20,
        TRUE
    ),
    (
        'Galletas Chispas',
        4,
        2,
        25.00,
        90,
        25,
        TRUE
    ),
    (
        'Papas Fritas',
        4,
        2,
        18.00,
        110,
        30,
        TRUE
    ),
    (
        'Barra Granola',
        4,
        2,
        22.00,
        95,
        25,
        TRUE
    ),
    (
        'Sandwich Jamón',
        5,
        2,
        45.00,
        35,
        15,
        TRUE
    ),
    (
        'Ensalada César',
        5,
        2,
        55.00,
        3,
        15,
        TRUE
    ),
    (
        'Wrap Pollo',
        5,
        2,
        50.00,
        6,
        15,
        TRUE
    );

INSERT INTO
    customers (name, email, phone)
VALUES (
        'Ana Martínez López',
        'ana.martinez@campus.edu',
        '961-111-1111'
    ),
    (
        'Roberto Sánchez',
        'roberto.sanchez@campus.edu',
        '961-222-2222'
    ),
    (
        'Laura Fernández',
        'laura.fdez@campus.edu',
        '961-333-3333'
    ),
    (
        'Miguel Ángel Torres',
        'ma.torres@campus.edu',
        '961-444-4444'
    ),
    (
        'Patricia Gómez',
        'pat.gomez@campus.edu',
        '961-555-5555'
    ),
    (
        'David Ramírez',
        'david.ram@campus.edu',
        '961-666-6666'
    ),
    (
        'Carmen Ortiz',
        'carmen.o@campus.edu',
        '961-777-7777'
    ),
    (
        'José Luis Morales',
        'jl.morales@campus.edu',
        '961-888-8888'
    ),
    (
        'Sofía Herrera',
        'sofia.herrera@campus.edu',
        '961-999-9999'
    ),
    (
        'Fernando Castro',
        'fer.castro@campus.edu',
        '961-000-0000'
    ),
    (
        'Gabriela Núñez',
        'gaby.nunez@campus.edu',
        '961-121-2121'
    ),
    (
        'Ricardo Mendoza',
        'ricardo.m@campus.edu',
        '961-343-4343'
    ),
    (
        'Valeria Rojas',
        'val.rojas@campus.edu',
        '961-565-6565'
    ),
    (
        'Alberto Díaz',
        'alberto.diaz@campus.edu',
        '961-787-8787'
    ),
    (
        'Daniela Cruz',
        'dani.cruz@campus.edu',
        '961-909-0909'
    );

INSERT INTO
    orders (
        customer_id,
        created_at,
        status,
        channel
    )
VALUES (
        1,
        '2026-01-17 08:30:00',
        'completed',
        'presencial'
    ),
    (
        2,
        '2026-01-17 09:20:00',
        'completed',
        'app'
    ),
    (
        3,
        '2026-01-17 10:45:00',
        'completed',
        'presencial'
    ),
    (
        4,
        '2026-01-18 08:15:00',
        'completed',
        'presencial'
    ),
    (
        5,
        '2026-01-18 09:30:00',
        'completed',
        'web'
    ),
    (
        6,
        '2026-01-18 11:40:00',
        'completed',
        'presencial'
    ),
    (
        7,
        '2026-01-19 08:00:00',
        'completed',
        'app'
    ),
    (
        8,
        '2026-01-19 10:30:00',
        'completed',
        'presencial'
    ),
    (
        9,
        '2026-01-20 09:00:00',
        'completed',
        'presencial'
    ),
    (
        10,
        '2026-01-20 10:20:00',
        'completed',
        'app'
    ),
    (
        11,
        '2026-01-20 12:15:00',
        'completed',
        'web'
    ),
    (
        1,
        '2026-01-20 14:00:00',
        'completed',
        'presencial'
    ),
    (
        12,
        '2026-01-21 08:30:00',
        'completed',
        'web'
    ),
    (
        13,
        '2026-01-21 09:45:00',
        'completed',
        'presencial'
    ),
    (
        14,
        '2026-01-21 11:30:00',
        'completed',
        'app'
    ),
    (
        15,
        '2026-01-22 08:20:00',
        'completed',
        'presencial'
    ),
    (
        2,
        '2026-01-22 09:40:00',
        'completed',
        'web'
    ),
    (
        3,
        '2026-01-22 11:50:00',
        'completed',
        'app'
    ),
    (
        4,
        '2026-01-22 13:10:00',
        'completed',
        'presencial'
    ),
    (
        5,
        '2026-01-23 08:00:00',
        'completed',
        'web'
    ),
    (
        6,
        '2026-01-23 10:25:00',
        'completed',
        'presencial'
    ),
    (
        7,
        '2026-01-23 12:40:00',
        'cancelled',
        'app'
    ),
    (
        8,
        '2026-01-24 08:45:00',
        'completed',
        'presencial'
    ),
    (
        9,
        '2026-01-24 10:15:00',
        'completed',
        'web'
    ),
    (
        10,
        '2026-01-24 12:30:00',
        'completed',
        'app'
    ),
    (
        11,
        '2026-01-25 08:30:00',
        'completed',
        'presencial'
    ),
    (
        12,
        '2026-01-25 09:45:00',
        'completed',
        'presencial'
    ),
    (
        13,
        '2026-01-25 11:20:00',
        'completed',
        'app'
    ),
    (
        14,
        '2026-01-25 12:50:00',
        'completed',
        'web'
    ),
    (
        15,
        '2026-01-25 14:10:00',
        'completed',
        'presencial'
    ),
    (
        1,
        '2026-01-26 09:30:00',
        'completed',
        'app'
    ),
    (
        2,
        '2026-01-26 11:45:00',
        'completed',
        'web'
    ),
    (
        3,
        '2026-01-27 08:15:00',
        'completed',
        'presencial'
    ),
    (
        4,
        '2026-01-27 10:30:00',
        'completed',
        'web'
    ),
    (
        5,
        '2026-01-27 12:20:00',
        'pending',
        'app'
    ),
    (
        6,
        '2026-01-28 08:40:00',
        'completed',
        'presencial'
    ),
    (
        7,
        '2026-01-28 09:55:00',
        'completed',
        'app'
    ),
    (
        8,
        '2026-01-28 11:10:00',
        'completed',
        'web'
    ),
    (
        9,
        '2026-01-28 13:25:00',
        'completed',
        'presencial'
    ),
    (
        10,
        '2026-01-29 08:00:00',
        'completed',
        'web'
    ),
    (
        11,
        '2026-01-29 10:30:00',
        'completed',
        'presencial'
    ),
    (
        12,
        '2026-01-29 12:45:00',
        'completed',
        'app'
    ),
    (
        13,
        '2026-01-30 08:20:00',
        'completed',
        'presencial'
    ),
    (
        14,
        '2026-01-30 10:40:00',
        'completed',
        'web'
    ),
    (
        15,
        '2026-01-30 12:55:00',
        'completed',
        'app'
    ),
    (
        1,
        '2026-01-30 14:30:00',
        'completed',
        'presencial'
    ),
    (
        2,
        '2026-01-31 08:50:00',
        'completed',
        'web'
    ),
    (
        3,
        '2026-01-31 10:15:00',
        'completed',
        'presencial'
    ),
    (
        4,
        '2026-01-31 12:40:00',
        'completed',
        'app'
    ),
    (
        5,
        '2026-02-01 08:00:00',
        'completed',
        'presencial'
    ),
    (
        6,
        '2026-02-01 09:30:00',
        'completed',
        'app'
    ),
    (
        7,
        '2026-02-01 11:00:00',
        'completed',
        'web'
    ),
    (
        8,
        '2026-02-01 12:45:00',
        'completed',
        'presencial'
    ),
    (
        9,
        '2026-02-01 14:20:00',
        'completed',
        'app'
    ),
    (
        10,
        '2026-02-02 09:15:00',
        'completed',
        'web'
    ),
    (
        11,
        '2026-02-02 13:00:00',
        'completed',
        'app'
    ),
    (
        12,
        '2026-02-03 08:30:00',
        'completed',
        'presencial'
    ),
    (
        13,
        '2026-02-03 10:50:00',
        'completed',
        'web'
    ),
    (
        14,
        '2026-02-03 12:20:00',
        'completed',
        'app'
    ),
    (
        15,
        '2026-02-03 14:45:00',
        'completed',
        'presencial'
    ),
    (
        1,
        '2026-02-04 08:10:00',
        'completed',
        'app'
    ),
    (
        2,
        '2026-02-04 10:35:00',
        'completed',
        'presencial'
    ),
    (
        3,
        '2026-02-04 13:00:00',
        'completed',
        'web'
    ),
    (
        4,
        '2026-02-05 08:45:00',
        'completed',
        'presencial'
    ),
    (
        5,
        '2026-02-05 10:20:00',
        'completed',
        'web'
    ),
    (
        6,
        '2026-02-05 12:50:00',
        'completed',
        'app'
    ),
    (
        7,
        '2026-02-05 14:15:00',
        'completed',
        'presencial'
    );

INSERT INTO
    order_items (
        order_id,
        product_id,
        qty,
        unit_price
    )
VALUES (1, 1, 2, 25.00),
    (1, 11, 1, 22.00),
    (2, 2, 1, 35.00),
    (2, 14, 1, 20.00),
    (3, 1, 3, 25.00),
    (4, 18, 1, 45.00),
    (4, 6, 1, 30.00),
    (5, 7, 1, 45.00),
    (6, 1, 2, 25.00),
    (6, 13, 1, 18.00),
    (7, 3, 1, 38.00),
    (8, 2, 2, 35.00),
    (9, 1, 1, 25.00),
    (9, 8, 2, 15.00),
    (10, 10, 1, 50.00),
    (10, 12, 1, 28.00),
    (11, 1, 3, 25.00),
    (11, 15, 2, 25.00),
    (12, 19, 1, 55.00),
    (12, 6, 1, 30.00),
    (13, 2, 1, 35.00),
    (14, 20, 2, 50.00),
    (15, 1, 2, 25.00),
    (15, 16, 3, 18.00),
    (16, 3, 1, 38.00),
    (17, 2, 2, 35.00),
    (18, 18, 1, 45.00),
    (19, 1, 3, 25.00),
    (20, 7, 1, 45.00),
    (22, 1, 2, 25.00),
    (23, 2, 1, 35.00),
    (24, 1, 4, 25.00),
    (25, 19, 1, 55.00),
    (26, 3, 1, 38.00),
    (26, 15, 2, 25.00),
    (27, 1, 2, 25.00),
    (28, 10, 1, 50.00),
    (29, 2, 2, 35.00),
    (30, 1, 3, 25.00),
    (31, 1, 5, 25.00),
    (31, 11, 2, 22.00),
    (32, 2, 2, 35.00),
    (33, 18, 2, 45.00),
    (34, 1, 3, 25.00),
    (35, 7, 1, 45.00),
    (36, 1, 4, 25.00),
    (37, 3, 1, 38.00),
    (38, 2, 2, 35.00),
    (39, 1, 2, 25.00),
    (40, 19, 1, 55.00),
    (41, 1, 6, 25.00),
    (41, 11, 2, 22.00),
    (42, 2, 3, 35.00),
    (43, 1, 4, 25.00),
    (44, 20, 2, 50.00),
    (45, 18, 1, 45.00),
    (46, 1, 5, 25.00),
    (47, 2, 2, 35.00),
    (48, 3, 1, 38.00),
    (49, 1, 5, 25.00),
    (50, 2, 1, 35.00),
    (51, 18, 1, 45.00),
    (52, 1, 3, 25.00),
    (53, 7, 2, 45.00),
    (54, 2, 1, 35.00),
    (54, 11, 1, 22.00),
    (55, 1, 4, 25.00),
    (56, 10, 1, 50.00),
    (57, 3, 2, 38.00),
    (58, 1, 2, 25.00),
    (59, 2, 1, 35.00),
    (60, 19, 1, 55.00),
    (61, 1, 3, 25.00),
    (62, 18, 1, 45.00),
    (62, 6, 1, 30.00),
    (63, 2, 2, 35.00),
    (64, 1, 5, 25.00),
    (64, 12, 2, 28.00),
    (65, 3, 1, 38.00),
    (66, 20, 1, 50.00),
    (66, 7, 1, 45.00),
    (67, 1, 4, 25.00),
    (67, 11, 3, 22.00);

INSERT INTO
    payments (
        order_id,
        method,
        paid_amount,
        created_at
    )
SELECT
    o.order_id,
    CASE
        WHEN o.order_id % 3 = 0 THEN 'efectivo'
        WHEN o.order_id % 3 = 1 THEN 'tarjeta'
        ELSE 'transferencia'
    END as method,
    COALESCE(
        (
            SELECT SUM(qty * unit_price)
            FROM order_items
            WHERE
                order_id = o.order_id
        ),
        0
    ) as paid_amount,
    o.created_at + INTERVAL '2 minutes'
FROM orders o
WHERE
    o.status = 'completed'
    AND EXISTS (
        SELECT 1
        FROM order_items
        WHERE
            order_id = o.order_id
    );

SELECT 'Categories' as tabla, COUNT(*) as registros
FROM categories
UNION ALL
SELECT 'Suppliers', COUNT(*)
FROM suppliers
UNION ALL
SELECT 'Products', COUNT(*)
FROM products
UNION ALL
SELECT 'Customers', COUNT(*)
FROM customers
UNION ALL
SELECT 'Orders', COUNT(*)
FROM orders
UNION ALL
SELECT 'Order Items', COUNT(*)
FROM order_items
UNION ALL
SELECT 'Payments', COUNT(*)
FROM payments;

SELECT
    name as producto,
    stock,
    min_stock,
    CASE
        WHEN stock < min_stock THEN 'EN RIESGO'
        ELSE 'Stock OK'
    END as estado
FROM products
WHERE
    stock < min_stock
ORDER BY stock ASC;