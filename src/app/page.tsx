import Link from 'next/link';

export default function Home() {
  const reports = [
    {
      id: 1,
      title: 'Ventas Diarias',
      description: 'Análisis de ventas por día con métricas clave',
      href: '/reports/sales-daily',
      icon: '',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Top Productos',
      description: 'Ranking de productos más vendidos por revenue',
      href: '/reports/top-products',
      icon: '',
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Inventario en Riesgo',
      description: 'Productos con stock bajo que requieren atención',
      href: '/reports/inventory-risk',
      icon: '',
      color: 'bg-yellow-500'
    },
    {
      id: 4,
      title: 'Valor de Clientes',
      description: 'Segmentación y análisis de clientes por valor',
      href: '/reports/customer-value',
      icon: '',
      color: 'bg-purple-500'
    },
    {
      id: 5,
      title: 'Mix de Pagos',
      description: 'Distribución de métodos de pago y tendencias',
      href: '/reports/payment-mix',
      icon: '',
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl"></span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Café Campus
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Dashboard de Analítica y Reportes
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Bienvenido al Sistema de Reportes
          </h2>
          <p className="text-gray-600 max-w-3xl">
            Selecciona un reporte para visualizar insights detallados sobre
            ventas, inventario, clientes y más. Todos los datos se obtienen
            en tiempo real desde PostgreSQL.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={report.href}
              className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 overflow-hidden"
            >
              <div className={`h-2 ${report.color}`} />
              
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    {report.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {report.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                  Ver reporte
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        
      </main>

      <footer className="mt-12 pb-8 text-center text-sm text-gray-500">
        <p>Café Campus - Sistema de Reportes © 2026</p>
      </footer>
    </div>
  );
}