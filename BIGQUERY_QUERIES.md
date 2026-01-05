# BigQuery Query Examples for Grapevne Analytics

## 📊 Overview

This document contains example BigQuery queries for the Grapevne University Dashboard. All queries include **campus filtering** for multi-tenant security.

## 🔐 Security Rule

**CRITICAL:** Every query MUST include:
```sql
WHERE (
  SELECT value.string_value
  FROM UNNEST(user_properties)
  WHERE key = 'campus'
) = @campus
```

This ensures universities only see their own data.

## 📋 Table of Contents

1. [Daily Active Users (DAU)](#daily-active-users-dau)
2. [Free Food Posts](#free-food-posts)
3. [Check-in Rate (Conversion)](#check-in-rate-conversion)
4. [Posts Over Time](#posts-over-time)
5. [User Engagement Metrics](#user-engagement-metrics)
6. [Advanced Analytics](#advanced-analytics)

---

## Daily Active Users (DAU)

### DAU for Today
```sql
SELECT
  COUNT(DISTINCT user_pseudo_id) as daily_active_users
FROM
  `analytics_YOUR_PROJECT_ID.events_*`
WHERE
  _TABLE_SUFFIX = FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND (
    SELECT value.string_value
    FROM UNNEST(user_properties)
    WHERE key = 'campus'
  ) = 'UC Berkeley'  -- Replace with @campus parameter in code
```

### DAU Trend (Last 30 Days)
```sql
SELECT
  PARSE_DATE('%Y%m%d', event_date) as date,
  COUNT(DISTINCT user_pseudo_id) as daily_active_users
FROM
  `analytics_YOUR_PROJECT_ID.events_*`
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
```

### Weekly Active Users (WAU)
```sql
SELECT
  COUNT(DISTINCT user_pseudo_id) as weekly_active_users
FROM
  `analytics_YOUR_PROJECT_ID.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
    AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND (
    SELECT value.string_value
    FROM UNNEST(user_properties)
    WHERE key = 'campus'
  ) = @campus
```

---

## Free Food Posts

### Total Posts This Week
```sql
SELECT
  COUNT(*) as total_posts
FROM
  `analytics_YOUR_PROJECT_ID.events_*`
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
```

### Top Posters
```sql
SELECT
  user_pseudo_id,
  COUNT(*) as post_count
FROM
  `analytics_YOUR_PROJECT_ID.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
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
GROUP BY
  user_pseudo_id
ORDER BY
  post_count DESC
LIMIT 10
```

### Post Category Breakdown
```sql
SELECT
  (
    SELECT value.string_value
    FROM UNNEST(event_params)
    WHERE key = 'post_category'
  ) as category,
  COUNT(*) as count
FROM
  `analytics_YOUR_PROJECT_ID.events_*`
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
  category
ORDER BY
  count DESC
```

---

## Check-in Rate (Conversion)

### Overall Check-in Rate
```sql
WITH post_views AS (
  SELECT
    user_pseudo_id,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'post_id') as post_id,
    event_timestamp
  FROM
    `analytics_YOUR_PROJECT_ID.events_*`
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
    `analytics_YOUR_PROJECT_ID.events_*`
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
  AND ci.event_timestamp <= pv.event_timestamp + 3600000000  -- Within 1 hour
```

### Check-in Rate by Day
```sql
WITH daily_views AS (
  SELECT
    PARSE_DATE('%Y%m%d', event_date) as date,
    COUNT(DISTINCT user_pseudo_id) as viewers
  FROM
    `analytics_YOUR_PROJECT_ID.events_*`
  WHERE
    _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
      AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'post_view'
    AND (
      SELECT value.string_value
      FROM UNNEST(user_properties)
      WHERE key = 'campus'
    ) = @campus
  GROUP BY event_date
),
daily_checkins AS (
  SELECT
    PARSE_DATE('%Y%m%d', event_date) as date,
    COUNT(DISTINCT user_pseudo_id) as check_ins
  FROM
    `analytics_YOUR_PROJECT_ID.events_*`
  WHERE
    _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
      AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'check_in'
    AND (
      SELECT value.string_value
      FROM UNNEST(user_properties)
      WHERE key = 'campus'
    ) = @campus
  GROUP BY event_date
)
SELECT
  v.date,
  v.viewers,
  IFNULL(c.check_ins, 0) as check_ins,
  ROUND(SAFE_DIVIDE(IFNULL(c.check_ins, 0), v.viewers) * 100, 2) as conversion_rate
FROM
  daily_views v
LEFT JOIN
  daily_checkins c
ON
  v.date = c.date
ORDER BY
  v.date DESC
```

---

## Posts Over Time

### Daily Post Volume
```sql
SELECT
  PARSE_DATE('%Y%m%d', event_date) as date,
  COUNT(*) as post_count,
  COUNT(DISTINCT user_pseudo_id) as unique_posters
FROM
  `analytics_YOUR_PROJECT_ID.events_*`
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
```

### Hourly Posting Patterns
```sql
SELECT
  EXTRACT(HOUR FROM TIMESTAMP_MICROS(event_timestamp)) as hour,
  COUNT(*) as posts
FROM
  `analytics_YOUR_PROJECT_ID.events_*`
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
  hour
ORDER BY
  hour
```

---

## User Engagement Metrics

### Retention Rate (Day 1, Day 7, Day 30)
```sql
WITH first_event AS (
  SELECT
    user_pseudo_id,
    MIN(PARSE_DATE('%Y%m%d', event_date)) as first_active_date
  FROM
    `analytics_YOUR_PROJECT_ID.events_*`
  WHERE
    (
      SELECT value.string_value
      FROM UNNEST(user_properties)
      WHERE key = 'campus'
    ) = @campus
  GROUP BY
    user_pseudo_id
),
cohorts AS (
  SELECT
    fe.first_active_date,
    fe.user_pseudo_id,
    PARSE_DATE('%Y%m%d', e.event_date) as event_date
  FROM
    first_event fe
  LEFT JOIN
    `analytics_YOUR_PROJECT_ID.events_*` e
  ON
    fe.user_pseudo_id = e.user_pseudo_id
    AND PARSE_DATE('%Y%m%d', e.event_date) >= fe.first_active_date
  WHERE
    (
      SELECT value.string_value
      FROM UNNEST(e.user_properties)
      WHERE key = 'campus'
    ) = @campus
)
SELECT
  first_active_date,
  COUNT(DISTINCT user_pseudo_id) as new_users,
  COUNT(DISTINCT CASE
    WHEN DATE_DIFF(event_date, first_active_date, DAY) = 1 THEN user_pseudo_id
  END) as day_1_retained,
  COUNT(DISTINCT CASE
    WHEN DATE_DIFF(event_date, first_active_date, DAY) = 7 THEN user_pseudo_id
  END) as day_7_retained,
  COUNT(DISTINCT CASE
    WHEN DATE_DIFF(event_date, first_active_date, DAY) = 30 THEN user_pseudo_id
  END) as day_30_retained
FROM
  cohorts
WHERE
  first_active_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY)
GROUP BY
  first_active_date
ORDER BY
  first_active_date DESC
```

### Average Sessions Per User
```sql
SELECT
  COUNT(DISTINCT
    CONCAT(user_pseudo_id, '_', (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id'))
  ) / COUNT(DISTINCT user_pseudo_id) as avg_sessions_per_user
FROM
  `analytics_YOUR_PROJECT_ID.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
    AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND (
    SELECT value.string_value
    FROM UNNEST(user_properties)
    WHERE key = 'campus'
  ) = @campus
```

---

## Advanced Analytics

### Peak Usage Times
```sql
SELECT
  FORMAT_TIMESTAMP('%A', TIMESTAMP_MICROS(event_timestamp)) as day_of_week,
  EXTRACT(HOUR FROM TIMESTAMP_MICROS(event_timestamp)) as hour,
  COUNT(*) as event_count
FROM
  `analytics_YOUR_PROJECT_ID.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
    AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND (
    SELECT value.string_value
    FROM UNNEST(user_properties)
    WHERE key = 'campus'
  ) = @campus
GROUP BY
  day_of_week, hour
ORDER BY
  event_count DESC
LIMIT 20
```

### User Segments by Activity Level
```sql
WITH user_activity AS (
  SELECT
    user_pseudo_id,
    COUNT(*) as event_count
  FROM
    `analytics_YOUR_PROJECT_ID.events_*`
  WHERE
    _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
      AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND (
      SELECT value.string_value
      FROM UNNEST(user_properties)
      WHERE key = 'campus'
    ) = @campus
  GROUP BY
    user_pseudo_id
)
SELECT
  CASE
    WHEN event_count >= 100 THEN 'Power Users (100+ events)'
    WHEN event_count >= 20 THEN 'Active Users (20-99 events)'
    WHEN event_count >= 5 THEN 'Regular Users (5-19 events)'
    ELSE 'Casual Users (<5 events)'
  END as segment,
  COUNT(*) as user_count,
  ROUND(AVG(event_count), 2) as avg_events_per_user
FROM
  user_activity
GROUP BY
  segment
ORDER BY
  avg_events_per_user DESC
```

### Event Funnel Analysis
```sql
WITH funnel AS (
  SELECT
    user_pseudo_id,
    COUNTIF(event_name = 'post_view') as views,
    COUNTIF(event_name = 'check_in') as check_ins,
    COUNTIF(event_name = 'share') as shares
  FROM
    `analytics_YOUR_PROJECT_ID.events_*`
  WHERE
    _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
      AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND (
      SELECT value.string_value
      FROM UNNEST(user_properties)
      WHERE key = 'campus'
    ) = @campus
  GROUP BY
    user_pseudo_id
)
SELECT
  'Post Views' as step,
  COUNT(DISTINCT user_pseudo_id) as users,
  100.0 as conversion_rate
FROM funnel WHERE views > 0
UNION ALL
SELECT
  'Check-ins' as step,
  COUNT(DISTINCT user_pseudo_id) as users,
  ROUND(COUNT(DISTINCT user_pseudo_id) * 100.0 / (SELECT COUNT(DISTINCT user_pseudo_id) FROM funnel WHERE views > 0), 2) as conversion_rate
FROM funnel WHERE check_ins > 0
UNION ALL
SELECT
  'Shares' as step,
  COUNT(DISTINCT user_pseudo_id) as users,
  ROUND(COUNT(DISTINCT user_pseudo_id) * 100.0 / (SELECT COUNT(DISTINCT user_pseudo_id) FROM funnel WHERE views > 0), 2) as conversion_rate
FROM funnel WHERE shares > 0
ORDER BY conversion_rate DESC
```

---

## 🔧 Query Optimization Tips

### 1. Use Partitioning
Always use `_TABLE_SUFFIX` to scan only necessary partitions:
```sql
_TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
  AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
```

### 2. Filter Early
Apply campus filter before joins and aggregations:
```sql
WHERE (SELECT value.string_value FROM UNNEST(user_properties) WHERE key = 'campus') = @campus
```

### 3. Use Parameterized Queries
Always use `@campus` parameter instead of hardcoding:
```javascript
const options = {
  query: yourQuery,
  params: { campus: userCampus },
  location: 'US'
};
```

### 4. Limit Result Size
Add `LIMIT` for testing:
```sql
ORDER BY event_timestamp DESC
LIMIT 1000
```

---

## 📊 Testing Queries

### Run a Test Query
```bash
# Using gcloud CLI
bq query --use_legacy_sql=false \
  --parameter=campus:STRING:UC\ Berkeley \
  'SELECT COUNT(*) FROM `analytics_YOUR_PROJECT_ID.events_20240104`'
```

### Estimate Query Cost
```bash
bq query --dry_run --use_legacy_sql=false \
  'YOUR_QUERY_HERE'
```

---

## 🚨 Common Errors

### "Table not found"
- Dataset name might be wrong
- Check: `analytics_<project_id>` not `firebase_analytics`
- Verify export is enabled and data exists

### "No matching signature"
- Missing `SAFE_DIVIDE` for division by zero
- Use: `SAFE_DIVIDE(numerator, denominator)` instead of `numerator / denominator`

### "OUT OF MEMORY"
- Query scanning too much data
- Add date partitioning filter
- Limit results with `LIMIT`

---

**Need Help?** Check the [DASHBOARD_SETUP.md](./DASHBOARD_SETUP.md) for full setup instructions.
