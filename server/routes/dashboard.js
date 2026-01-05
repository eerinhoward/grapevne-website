const express = require('express');
const router = express.Router();
const { verifyToken, requireCampus } = require('../middleware/auth');
const {
  getDashboardOverview,
  getPostsOverTime,
  getDailyActiveUsersTrend,
  validateCampusAccess
} = require('../services/bigquery.service');

/**
 * All dashboard routes require authentication and campus assignment
 */
router.use(verifyToken);
router.use(requireCampus);

/**
 * GET /api/dashboard/overview
 * Returns summary metrics for the authenticated user's campus
 *
 * Response:
 * {
 *   campus: string,
 *   metrics: {
 *     dailyActiveUsers: number,
 *     freeFoodPostsThisWeek: number,
 *     checkInRate: number,
 *     checkInStats: {
 *       totalViewers: number,
 *       totalCheckIns: number
 *     }
 *   },
 *   timestamp: string
 * }
 */
router.get('/overview', async (req, res, next) => {
  try {
    const { campus } = req.user;

    console.log(`📊 Fetching overview for campus: ${campus}`);

    const metrics = await getDashboardOverview(campus);

    res.json({
      success: true,
      campus,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/dashboard/posts
 * Returns posts data over time for charts
 *
 * Query params:
 * - days: number of days to look back (default: 30, max: 90)
 *
 * Response:
 * {
 *   campus: string,
 *   data: [
 *     { date: string, postCount: number, uniquePosters: number }
 *   ],
 *   period: { days: number, start: string, end: string }
 * }
 */
router.get('/posts', async (req, res, next) => {
  try {
    const { campus } = req.user;
    const days = Math.min(parseInt(req.query.days) || 30, 90); // Max 90 days

    console.log(`📈 Fetching posts data for campus: ${campus} (${days} days)`);

    const data = await getPostsOverTime(campus, days);

    res.json({
      success: true,
      campus,
      data,
      period: {
        days,
        start: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/dashboard/users/trend
 * Returns daily active users trend over time
 *
 * Query params:
 * - days: number of days to look back (default: 30, max: 90)
 *
 * Response:
 * {
 *   campus: string,
 *   data: [
 *     { date: string, activeUsers: number }
 *   ]
 * }
 */
router.get('/users/trend', async (req, res, next) => {
  try {
    const { campus } = req.user;
    const days = Math.min(parseInt(req.query.days) || 30, 90);

    console.log(`👥 Fetching user trend for campus: ${campus} (${days} days)`);

    const data = await getDailyActiveUsersTrend(campus, days);

    res.json({
      success: true,
      campus,
      data,
      period: {
        days,
        start: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/dashboard/me
 * Returns authenticated user's information and campus
 */
router.get('/me', (req, res) => {
  res.json({
    success: true,
    user: {
      uid: req.user.uid,
      email: req.user.email,
      campus: req.user.campus,
      role: req.user.role,
      emailVerified: req.user.emailVerified
    }
  });
});

module.exports = router;
