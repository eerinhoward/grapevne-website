export default function MetricsCard({ title, value, subtitle, icon, trend, loading }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">
            {title}
          </p>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
              {subtitle && <div className="h-4 bg-gray-200 rounded w-32"></div>}
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-900">
                {value !== null && value !== undefined ? value : '—'}
              </p>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">
                  {subtitle}
                </p>
              )}
            </>
          )}
        </div>
        {icon && (
          <div className="ml-4 text-3xl">
            {icon}
          </div>
        )}
      </div>

      {trend && !loading && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${
            trend.direction === 'up' ? 'text-green-600' :
            trend.direction === 'down' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {trend.direction === 'up' && '↑'}
            {trend.direction === 'down' && '↓'}
            {' '}
            {trend.value}
          </span>
          <span className="text-sm text-gray-500 ml-2">
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
