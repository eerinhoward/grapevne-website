import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function PostsChart({ data, loading, type = 'line' }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Posts Over Time
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-5xl mb-2">📊</p>
            <p>No data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform data for chart
  const chartData = data.map(item => ({
    date: typeof item.date === 'string' ? item.date : format(parseISO(item.date), 'MMM d'),
    posts: item.postCount || item.post_count || 0,
    posters: item.uniquePosters || item.unique_posters || 0
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Posts Over Time (Last 30 Days)
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Track post creation and user engagement trends
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPosters" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '14px' }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="posts"
                name="Total Posts"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorPosts)"
              />
              <Area
                type="monotone"
                dataKey="posters"
                name="Unique Posters"
                stroke="#ec4899"
                fillOpacity={1}
                fill="url(#colorPosters)"
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '14px' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="posts"
                name="Total Posts"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="posters"
                name="Unique Posters"
                stroke="#ec4899"
                strokeWidth={3}
                dot={{ fill: '#ec4899', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
