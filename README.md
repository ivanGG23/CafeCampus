# Café Campus - Sistema de Reportes

Dashboard de analítica para cafetería del campus desarrollado con Next.js (TypeScript), PostgreSQL y Docker Compose. Sistema de reportes de ventas con seguridad implementada (usuario app con SELECT solo sobre VIEWS).

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Modelo de Datos](#modelo-de-datos)
- [VIEWS Implementadas](#views-implementadas)
- [Seguridad](#seguridad)
- [Índices y Performance](#índices-y-performance)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## Características

### Reportes Implementados

1. **Ventas Diarias** - Análisis de ventas por día con filtros de fecha
2. **Top Productos** - Ranking de productos con búsqueda y paginación
3. **Inventario en Riesgo** - Productos con stock bajo filtrados por categoría
4. **Valor de Clientes** - Segmentación de clientes con paginación
5. **Mix de Pagos** - Distribución de métodos de pago

### Funcionalidades Técnicas

- Filtros por fecha (Ventas Diarias)
- Búsqueda por nombre (Top Productos)
- Filtros por categoría con whitelist (Inventario en Riesgo)
- Paginación server-side con validación (Top Productos, Valor de Clientes)
- KPIs destacados en cada reporte
- Seguridad: Usuario `app_user` con SELECT solo sobre VIEWS
- Índices optimizados en PostgreSQL
- Despliegue completo con Docker Compose

---

## Tecnologías Utilizadas

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js Server Components, Node.js
- **Base de Datos**: PostgreSQL 16
- **Containerización**: Docker, Docker Compose
- **Librerías**: pg (PostgreSQL client), Zod (validación)

---

## Arquitectura del Proyecto
```
cafecampus/
├── db/                          # Scripts SQL
│   ├── schema.sql              # Creación de tablas
│   ├── seed.sql                # Datos de prueba
│   ├── reports_vw.sql          # 5 VIEWS de reportes
│   ├── indexes.sql             # Índices optimizados
│   ├── roles.sql               # Usuario app_user
│   └── migrate.sql             # Script maestro
├── src/
│   ├── app/
│   │   ├── page.tsx            # Dashboard principal
│   │   └── reports/            # Páginas de reportes
│   │       ├── sales-daily/
│   │       ├── top-products/
│   │       ├── inventory-risk/
│   │       ├── customer-value/
│   │       └── payment-mix/
│   └── lib/
│       └── db.ts               # Conexión PostgreSQL
├── docker-compose.yml          # Orquestación de servicios
├── Dockerfile                  # Imagen de Next.js
└── README.md
```

---

## Requisitos Previos

- **Docker Desktop** instalado ([Descargar aquí](https://www.docker.com/products/docker-desktop/))
- **Git** instalado
- **Node.js 20+** (opcional, solo para desarrollo local)

---

## Instalación y Ejecución

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/cafecampus.git
cd cafecampus
```

### Paso 2: Levantar el Proyecto con Docker
```bash
docker compose up --build
```

Este comando:
1. Descarga las imágenes de PostgreSQL y Node.js
2. Construye la imagen de Next.js
3. Ejecuta automáticamente todos los scripts SQL en orden:
   - `schema.sql` → Crea las 7 tablas
   - `seed.sql` → Inserta datos de prueba
   - `reports_vw.sql` → Crea las 5 VIEWS
   - `indexes.sql` → Crea índices optimizados
   - `roles.sql` → Configura usuario `app_user`

### Paso 3: Acceder a la Aplicación

Abre tu navegador en:
- **Dashboard**: http://localhost:3000
- **PostgreSQL**: localhost:5432

### Paso 4: Detener el Proyecto
```bash
# Detener contenedores
docker compose down

# Detener y eliminar volúmenes (base de datos)
docker compose down -v
```

---

## 🗄 Modelo de Datos

### Tablas (7 en total)

1. **categories** - Categorías de productos
2. **suppliers** - Proveedores
3. **products** - Productos (FK: category_id, supplier_id)
4. **customers** - Clientes
5. **orders** - Órdenes de compra (FK: customer_id)
6. **order_items** - Items de órdenes (FK: order_id, product_id)
7. **payments** - Pagos (FK: order_id)

### Relaciones
```
categories (1) -----> (N) products
suppliers (1) ------> (N) products
customers (1) ------> (N) orders
orders (1) ---------> (N) order_items
orders (1) ---------> (N) payments
products (1) -------> (N) order_items
```

---

## VIEWS Implementadas

### 1. vw_sales_daily
**Descripción**: Ventas diarias con métricas agregadas  
**Grain**: 1 fila por día  
**Métricas**: total_ventas (SUM), tickets (COUNT), ticket_promedio (calculado)  
**Características**:
- Agregado: SUM, COUNT, AVG
- GROUP BY: fecha
- HAVING: tickets > 0
- Campo calculado: ticket_promedio, nivel_actividad (CASE)
- COALESCE para valores nulos

**Query de verificación**:
```sql
SELECT * FROM vw_sales_daily 
WHERE fecha >= CURRENT_DATE - INTERVAL '7 days';
```

---

### 2. vw_top_products_ranked
**Descripción**: Ranking de productos por revenue y unidades vendidas  
**Grain**: 1 fila por producto  
**Métricas**: revenue (SUM), unidades_vendidas (SUM), ranking (RANK)  
**Características**:
- **Window Function**: RANK() OVER (ORDER BY revenue DESC)
- **CTE**: WITH product_sales AS (...)
- HAVING: unidades > 0
- Campo calculado: precio_promedio, clasificacion (CASE)
- Sin SELECT *

**Query de verificación**:
```sql
SELECT * FROM vw_top_products_ranked 
WHERE ranking_revenue <= 5;
```

---

### 3. vw_inventory_risk
**Descripción**: Productos con stock bajo o en riesgo  
**Grain**: 1 fila por producto en riesgo  
**Métricas**: porcentaje_riesgo (calculado), dias_stock_estimado  
**Características**:
- Campo calculado: porcentaje_riesgo, dias_stock_estimado
- CASE: nivel_alerta con múltiples condiciones
- COALESCE: valores por defecto
- Subquery: promedio de ventas últimos 7 días
- Sin SELECT *

**Query de verificación**:
```sql
SELECT * FROM vw_inventory_risk 
WHERE nivel_alerta = 'CRÍTICO';
```

---

### 4. vw_customer_value
**Descripción**: Valor de cada cliente (total gastado, número de órdenes)  
**Grain**: 1 fila por cliente  
**Métricas**: total_gastado (SUM), num_ordenes (COUNT), gasto_promedio  
**Características**:
- Agregados: SUM, COUNT, MAX
- GROUP BY: customer_id
- HAVING: num_ordenes > 0
- Campo calculado: gasto_promedio, segmento (CASE)
- COALESCE para clientes sin órdenes
- Sin SELECT *

**Query de verificación**:
```sql
SELECT * FROM vw_customer_value 
WHERE segmento = 'VIP' 
ORDER BY total_gastado DESC;
```

---

### 5. vw_payment_mix
**Descripción**: Distribución de métodos de pago (total y porcentaje)  
**Grain**: 1 fila por método de pago  
**Métricas**: total_transacciones (COUNT), monto_total (SUM), porcentaje  
**Características**:
- Agregados: COUNT, SUM, AVG
- GROUP BY: method
- HAVING: total_transacciones > 0
- Campo calculado: porcentaje (con subquery), tipo_metodo (CASE)
- Sin SELECT *

**Query de verificación**:
```sql
SELECT * FROM vw_payment_mix 
ORDER BY porcentaje DESC;
```

---

## Seguridad

### Usuario app_user

La aplicación **NO** se conecta como usuario `postgres`. Se creó un usuario específico `app_user` con permisos restringidos.

**Configuración**:
```sql
CREATE ROLE app_user WITH LOGIN PASSWORD 'app_secure_pass_2024';
GRANT CONNECT ON DATABASE "CafeCampus" TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- Permisos SOLO sobre VIEWS
GRANT SELECT ON vw_sales_daily TO app_user;
GRANT SELECT ON vw_top_products_ranked TO app_user;
GRANT SELECT ON vw_inventory_risk TO app_user;
GRANT SELECT ON vw_customer_value TO app_user;
GRANT SELECT ON vw_payment_mix TO app_user;

-- Revocar acceso a tablas base
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;
```

### Verificación de Seguridad

#### 1. Ver permisos del usuario app_user

Conéctate a PostgreSQL como `postgres`:
```bash
docker exec -it cafecampus_db psql -U postgres -d CafeCampus
```

Ejecuta:
```sql
SELECT 
    grantee,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE grantee = 'app_user'
ORDER BY table_name;
```

**Resultado esperado**:
```
 grantee  |        table_name        | privilege_type
----------+--------------------------+----------------
 app_user | vw_customer_value        | SELECT
 app_user | vw_inventory_risk        | SELECT
 app_user | vw_payment_mix           | SELECT
 app_user | vw_sales_daily           | SELECT
 app_user | vw_top_products_ranked   | SELECT
 app_user | vw_categories            | SELECT
 
```

#### 2. Probar acceso permitido (VIEWS)

Conéctate como `app_user`:
```bash
docker exec -it cafecampus_db psql -U app_user -d CafeCampus
```

Ejecuta:
```sql
-- DEBE FUNCIONAR
SELECT * FROM vw_sales_daily LIMIT 3;
```

#### 3. Probar acceso denegado (TABLAS)
```sql
-- DEBE DAR ERROR
SELECT * FROM products LIMIT 3;
```

**Error esperado**:
```
ERROR:  permission denied for table products
```

---

## Índices y Performance

### Índices Creados (6 en total)

1. **idx_orders_created_date** - Filtros por fecha en ventas diarias
2. **idx_orders_customer_status** - Customer value y segmentación
3. **idx_order_items_product** - Top products (agregaciones)
4. **idx_products_category_active** - Inventario por categoría
5. **idx_products_stock_risk** - Productos con stock bajo
6. **idx_payments_method** - Agregaciones por método de pago

### Evidencia con EXPLAIN

#### Query 1: Ventas por rango de fechas
```sql
EXPLAIN ANALYZE
SELECT * FROM vw_sales_daily 
WHERE fecha >= CURRENT_DATE - INTERVAL '7 days';
```

**Resultado**:
```
Planning Time: 0.475 ms
Execution Time: 0.192 ms
```

El índice `idx_orders_created_date` reduce el tiempo de ejecución significativamente al filtrar por fecha.

#### Query 2: Productos en riesgo por categoría
```sql
EXPLAIN ANALYZE
SELECT * FROM vw_inventory_risk 
WHERE categoria = 'Bebidas Calientes';
```

**Resultado**:
```
Index Scan using categories_name_key on categories
Planning Time: ~0.3 ms
Execution Time: ~0.03 ms
```

El índice `idx_products_category_active` optimiza las búsquedas por categoría.

---

## Estructura del Proyecto
```
cafecampus/
├── db/
│   ├── schema.sql              # 7 tablas con FK
│   ├── seed.sql                # Datos de prueba (50+ órdenes)
│   ├── reports_vw.sql          # 5 VIEWS con comentarios
│   ├── indexes.sql             # 6 índices
│   ├── roles.sql               # Usuario app_user
│   └── migrate.sql             # Ejecuta todo en orden
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Dashboard principal
│   │   └── reports/
│   │       ├── sales-daily/page.tsx
│   │       ├── top-products/page.tsx
│   │       ├── inventory-risk/page.tsx
│   │       ├── customer-value/page.tsx
│   │       └── payment-mix/page.tsx
│   └── lib/
│       └── db.ts               # Pool de conexiones PostgreSQL
├── public/
├── .dockerignore
├── .env.local
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── next.config.js
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## Variables de Entorno

### Producción (Docker)
Configuradas automáticamente en `docker-compose.yml`:
```yaml
DATABASE_URL: postgresql://app_user:app_secure_pass_2024@db:5432/CafeCampus
NODE_ENV: production
```

### Desarrollo Local
Crear archivo `.env.local`:
```env
DATABASE_URL=postgresql://app_user:app_secure_pass_2024@localhost:5432/CafeCampus
NODE_ENV=development
```

---

## Comandos Útiles
```bash
# Levantar proyecto
docker compose up --build

# Levantar en background
docker compose up -d

# Ver logs
docker compose logs -f

# Detener proyecto
docker compose down

# Detener y eliminar datos
docker compose down -v

# Acceder a PostgreSQL
docker exec -it cafecampus_db psql -U postgres -d CafeCampus

# Acceder como app_user
docker exec -it cafecampus_db psql -U app_user -d CafeCampus

# Reconstruir solo Next.js
docker compose up --build app

# Ver contenedores activos
docker compose ps
```

---

## Datos de Prueba

El proyecto incluye datos suficientes para demostrar todas las funcionalidades:

- **10 categorías** de productos
- **10 proveedores**
- **10 productos** (5 con stock bajo)
- **10 clientes** con diferentes segmentos
- **10 órdenes** distribuidas en los últimos 30 días
- **10 items** de órdenes
- **10 pagos** con 3 métodos diferentes

---

## Checklist de Requisitos Cumplidos

### Base de Datos
- 7 tablas con relaciones FK
- schema.sql, seed.sql ejecutados automáticamente
- Datos suficientes para filtros y paginación

### VIEWS (5 implementadas)
- Cada VIEW incluye: 1 agregado, GROUP BY, 1 campo calculado
- Mínimo 4 VIEWS con HAVING
- Todas las VIEWS con CASE o COALESCE
- 1 VIEW con CTE (vw_top_products_ranked)
- 1 VIEW con Window Function (vw_top_products_ranked)
- Todas las VIEWS sin SELECT * (listan columnas)
- Comentarios arriba de cada VIEW
- Queries VERIFY incluidos

### Índices
- 6 índices relevantes creados
- Evidencia EXPLAIN de 2 consultas documentada

### Seguridad
- Usuario app_user creado
- SELECT solo sobre VIEWS (no tablas)
- Verificación documentada

### Next.js
- Dashboard principal (/)
- 5 pantallas de reportes
- Cada reporte con título, descripción, tabla y KPIs
- Credenciales NO expuestas al cliente
- Data fetching server-side
- Queries solo SELECT sobre VIEWS

### Filtros y Paginación
- 2 reportes con filtros (Ventas Diarias, Inventario)
- 1 reporte con búsqueda (Top Productos)
- 2 reportes con paginación (Top Productos, Valor Clientes)
- Validación con tipos TypeScript

### Docker
- Corre con `docker compose up --build`
- PostgreSQL + Next.js
- Scripts SQL ejecutados automáticamente

---

##  Autor

**[Tu Nombre]**  
Materia: AWOS y BDA 5°A  
Fecha: Febrero 2026

---

## Licencia

Este proyecto es parte de una evaluación académica.