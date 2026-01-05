/**
 * BigQuery SQL Templates for Firebase Analytics
 * These queries assume Firebase Analytics data is exported to BigQuery
 * Dataset structure: firebase_analytics.events_YYYYMMDD
 */

const DATASET = process.env.BIGQUERY_DATASET || 'analytics_YOUR_FIREBASE_PROJECT_ID';

/**
 * Get Daily Active Users (DAU) for the last 30 days
 * Filters by campus using user_properties
 */
const getDailyActiveUsersQuery = `
  SELECT
    PARSE_DATE('%Y%m%d', event_date) as date,
    COUNT(DISTINCT user_pseudo_id) as daily_active_users
  FROM
    \`${DATASET}.events_*\`
  WHERE
    _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
      AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND (
      SELECT value.string_value
      FROM UNNEST(user_properties)
      WHERE key = 'campus'
    ) = @campus
  GROUP BY
    event_date
  ORDER BY
    date DESC
`;

/**
 * Get total DAU for a specific date range
 */
const getTotalActiveUsersQuery = `
  SELECT
    COUNT(DISTINCT user_pseudo_id) as total_active_users
  FROM
    \`${DATASET}.events_*\`
  WHERE
    _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY))
      AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND (
      SELECT value.string_value
      FROM UNNEST(user_properties)
      WHERE key = 'campus'
    ) = @campus
`;

/**
 * Get Free Food Posts count for the last 7 days
 * Assumes you log a 'post_created' event with category = 'free_food'
 */
const getFreeFoodPostsQuery = `
  SELECT
    COUNT(*) as total_posts
  FROM
    \`${DATASET}.events_*\`
  WHERE
    _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
      AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'post_created'
    AND (
      SELECT value.string_value
      FROM UNNEST(event_params)
      WHERE key = 'post_category'
    ) = 'free_food'
    AND (
      SELECT value.string_value
      FROM UNNEST(user_properties)
      WHERE key = 'campus'
    ) = @campus
`;

/**
 * Get Check-in Rate (percentage of users who viewed a post and then checked in)
 * This is a funnel analysis: post_view -> check_in
 */
const getCheckInRateQuery = `
  WITH post_views AS (
    SELECT
      user_pseudo_id,
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'post_id') as post_id,
      event_timestamp
    FROM
      \`${DATASET}.events_*\`
    WHERE
      _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
        AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
      AND event_name = 'post_view'
      AND (
        SELECT value.string_value
        FROM UNNEST(user_properties)
        WHERE key = 'campus'
      ) = @campus
  ),
  check_ins AS (
    SELECT
      user_pseudo_id,
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'post_id') as post_id,
      event_timestamp
    FROM
      \`${DATASET}.events_*\`
    WHERE
      _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
        AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
      AND event_name = 'check_in'
      AND (
        SELECT value.string_value
        FROM UNNEST(user_properties)
        WHERE key = 'campus'
      ) = @campus
  )
  SELECT
    COUNT(DISTINCT pv.user_pseudo_id) as total_viewers,
    COUNT(DISTINCT ci.user_pseudo_id) as total_check_ins,
    ROUND(
      SAFE_DIVIDE(
        COUNT(DISTINCT ci.user_pseudo_id),
        COUNT(DISTINCT pv.user_pseudo_id)
      ) * 100,
      2
    ) as check_in_rate_percentage
  FROM
    post_views pv
  LEFT JOIN
    check_ins ci
  ON
    pv.user_pseudo_id = ci.user_pseudo_id
    AND pv.post_id = ci.post_id
    AND ci.event_timestamp > pv.event_timestamp
    AND ci.event_timestamp <= pv.event_timestamp + 3600000000 -- Within 1 hour
`;

/**
 * Get posts over time (daily aggregation for the last 30 days)
 */
const getPostsOverTimeQuery = `
  SELECT
    PARSE_DATE('%Y%m%d', event_date) as date,
    COUNT(*) as post_count,
    COUNT(DISTINCT user_pseudo_id) as unique_posters
  FROM
    \`${DATASET}.events_*\`
  WHERE
    _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
      AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'post_created'
    AND (
      SELECT value.string_value
      FROM UNNEST(user_properties)
      WHERE key = 'campus'
    ) = @campus
  GROUP BY
    event_date
  ORDER BY
    date ASC
`;

/**
 * Get top campuses by activity (for admin/analytics purposes)
 * NOT filtered by campus - use with caution and proper admin permissions
 */
const getTopCampusesQuery = `
  SELECT
    (
      SELECT value.string_value
      FROM UNNEST(user_properties)
      WHERE key = 'campus'
    ) as campus,
    COUNT(DISTINCT user_pseudo_id) as unique_users,
    COUNT(*) as total_events
  FROM
    \`${DATASET}.events_*\`
  WHERE
    _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
      AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  GROUP BY
    campus
  ORDER BY
    unique_users DESC
  LIMIT 20
`;

module.exports = {
  getDailyActiveUsersQuery,
  getTotalActiveUsersQuery,
  getFreeFoodPostsQuery,
  getCheckInRateQuery,
  getPostsOverTimeQuery,
  getTopCampusesQuery
};
