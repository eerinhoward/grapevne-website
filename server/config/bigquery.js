const { BigQuery } = require('@google-cloud/bigquery');

// Initialize BigQuery client
let bigQueryClient;

try {
  // Option 1: Using service account key file
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    bigQueryClient = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
  }
  // Option 2: Using environment variables
  else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    bigQueryClient = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      }
    });
  }
  // Option 3: Application default credentials (for GCP environments)
  else {
    console.warn('⚠️  No BigQuery credentials found. Using application default credentials.');
    bigQueryClient = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
    });
  }

  console.log('✅ BigQuery client initialized successfully');
} catch (error) {
  console.error('❌ Error initializing BigQuery client:', error.message);
  throw error;
}

/**
 * Execute a BigQuery query with parameters
 * @param {string} query - SQL query string
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
async function executeQuery(query, params = {}) {
  try {
    const options = {
      query: query,
      params: params,
      location: 'US', // BigQuery dataset location
    };

    console.log('🔍 Executing BigQuery:', query.substring(0, 100) + '...');

    const [job] = await bigQueryClient.createQueryJob(options);
    console.log(`⏳ Job ${job.id} started.`);

    const [rows] = await job.getQueryResults();
    console.log(`✅ Query returned ${rows.length} rows`);

    return rows;
  } catch (error) {
    console.error('❌ BigQuery execution error:', error.message);
    throw new Error(`BigQuery query failed: ${error.message}`);
  }
}

/**
 * Test BigQuery connection
 * @returns {Promise<boolean>}
 */
async function testConnection() {
  try {
    const query = 'SELECT 1 as test';
    const [rows] = await bigQueryClient.query(query);
    return rows.length > 0;
  } catch (error) {
    console.error('❌ BigQuery connection test failed:', error.message);
    return false;
  }
}

module.exports = {
  bigQueryClient,
  executeQuery,
  testConnection
};
