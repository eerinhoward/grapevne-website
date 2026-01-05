const { executeQuery } = require('../config/bigquery');
const {
  getDailyActiveUsersQuery,
  getTotalActiveUsersQuery,
  getFreeFoodPostsQuery,
  getCheckInRateQuery,
  getPostsOverTimeQuery
} = require('../utils/queries');

/**
 * SECURITY CRITICAL: All functions require campus parameter
 * This ensures multi-tenant data isolation
 */

/**
 * Get dashboard overview metrics for a specific campus
 * @param {string} campus - Campus identifier
 * @returns {Promise<Object>} Overview metrics
 */
async function getDashboardOverview(campus) {
  if (!campus) {
    throw new Error('Campus parameter is required for security');
  }

  try {
    // Execute queries in parallel for better performance
    const [dauResult, freeFoodResult, checkInResult] = await Promise.all([
      executeQuery(getTotalActiveUsersQuery, { campus, days: 1 }),
      executeQuery(getFreeFoodPostsQuery, { campus }),
      executeQuery(getCheckInRateQuery, { campus })
    ]);

    return {
      dailyActiveUsers: dauResult[0]?.total_active_users || 0,
      freeFoodPostsThisWeek: freeFoodResult[0]?.total_posts || 0,
      checkInRate: checkInResult[0]?.check_in_rate_percentage || 0,
      checkInStats: {
        totalViewers: checkInResult[0]?.total_viewers || 0,
        totalCheckIns: checkInResult[0]?.total_check_ins || 0
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    throw new Error(`Failed to fetch dashboard overview: ${error.message}`);
  }
}

/**
 * Get posts over time data for charts
 * @param {string} campus - Campus identifier
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<Array>} Array of {date, post_count, unique_posters}
 */
async function getPostsOverTime(campus, days = 30) {
  if (!campus) {
    throw new Error('Campus parameter is required for security');
  }

  try {
    const results = await executeQuery(getPostsOverTimeQuery, { campus });

    // Transform results to frontend-friendly format
    return results.map(row => ({
      date: row.date.value, // BigQuery date object
      postCount: row.post_count,
      uniquePosters: row.unique_posters
    }));
  } catch (error) {
    console.error('Error fetching posts over time:', error);
    throw new Error(`Failed to fetch posts data: ${error.message}`);
  }
}

/**
 * Get daily active users trend
 * @param {string} campus - Campus identifier
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<Array>} Array of {date, daily_active_users}
 */
async function getDailyActiveUsersTrend(campus, days = 30) {
  if (!campus) {
    throw new Error('Campus parameter is required for security');
  }

  try {
    const results = await executeQuery(getDailyActiveUsersQuery, { campus });

    return results.map(row => ({
      date: row.date.value,
      activeUsers: row.daily_active_users
    }));
  } catch (error) {
    console.error('Error fetching DAU trend:', error);
    throw new Error(`Failed to fetch DAU data: ${error.message}`);
  }
}

/**
 * Validate campus access for a user
 * This is an extra security layer to ensure users can only access their campus data
 * @param {string} userCampus - Campus from user token
 * @param {string} requestedCampus - Campus being requested
 * @returns {boolean}
 */
function validateCampusAccess(userCampus, requestedCampus) {
  // SECURITY: User can only access their own campus data
  if (userCampus !== requestedCampus) {
    throw new Error('Access denied: Cannot access data from other campuses');
  }
  return true;
}

module.exports = {
  getDashboardOverview,
  getPostsOverTime,
  getDailyActiveUsersTrend,
  validateCampusAccess
};
