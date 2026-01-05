import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { dashboardAPI } from '../services/api';
import MetricsCard from '../components/dashboard/MetricsCard';
import PostsChart from '../components/dashboard/PostsChart';

export default function Dashboard() {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [postsData, setPostsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch overview and posts data in parallel
      const [overviewResponse, postsResponse] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getPostsOverTime(30)
      ]);

      setOverview(overviewResponse);
      setPostsData(postsResponse.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Grapevne Analytics
              </h1>
              {userProfile?.campus && (
                <p className="text-sm text-gray-600 mt-1">
                  {userProfile.campus}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.email || user?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userProfile?.role || 'University'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-red-600 text-xl mr-3">⚠️</span>
              <div className="flex-1">
                <p className="text-red-800 font-medium">{error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="text-red-600 hover:text-red-700 text-sm font-medium mt-1"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricsCard
            title="Daily Active Users"
            value={overview?.metrics?.dailyActiveUsers}
            subtitle="Active today"
            icon="👥"
            loading={loading}
          />
          <MetricsCard
            title="Free Food Posts"
            value={overview?.metrics?.freeFoodPostsThisWeek}
            subtitle="Last 7 days"
            icon="🍕"
            loading={loading}
          />
          <MetricsCard
            title="Check-in Rate"
            value={overview?.metrics?.checkInRate ? `${overview.metrics.checkInRate}%` : null}
            subtitle={
              overview?.metrics?.checkInStats
                ? `${overview.metrics.checkInStats.totalCheckIns} / ${overview.metrics.checkInStats.totalViewers} viewers`
                : 'Conversion rate'
            }
            icon="✓"
            loading={loading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
          <PostsChart
            data={postsData}
            loading={loading}
            type="area"
          />
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            About This Dashboard
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Source</h4>
              <p>
                Analytics data is synced from Firebase Analytics via BigQuery.
                Data is filtered to show only your campus's activity.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Security</h4>
              <p>
                All queries are restricted by campus ID. You can only view data
                for {userProfile?.campus || 'your assigned campus'}.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Refresh</h4>
              <p>
                Dashboard data refreshes on page load. Firebase Analytics data
                may have a 24-48 hour delay.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Support</h4>
              <p>
                Questions or issues?{' '}
                <a
                  href="mailto:support@grapevne.com"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2024 Grapevne. All rights reserved. | Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </footer>
    </div>
  );
}
