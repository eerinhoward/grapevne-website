/**
 * Script to set Firebase custom claims for university users
 *
 * Usage:
 * 1. Copy this file: cp set-campus.example.js set-campus.js
 * 2. Edit set-campus.js with your user emails and campuses
 * 3. Run: node set-campus.js
 *
 * This script sets the 'campus' and 'role' custom claims on Firebase users.
 * These claims are used for multi-tenant access control in the dashboard.
 */

require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

/**
 * Set campus custom claim for a user
 * @param {string} email - User's email address
 * @param {string} campus - Campus name (must match BigQuery data)
 * @param {string} role - User role (default: 'university')
 */
async function setCampusClaim(email, campus, role = 'university') {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);

    // Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, {
      campus: campus,
      role: role
    });

    console.log(`✅ Successfully set claims for ${email}`);
    console.log(`   Campus: ${campus}`);
    console.log(`   Role: ${role}`);
    console.log(`   UID: ${user.uid}`);

    // Verify the claims were set
    const updatedUser = await admin.auth().getUser(user.uid);
    console.log(`   Custom Claims:`, updatedUser.customClaims);

  } catch (error) {
    console.error(`❌ Error setting claims for ${email}:`, error.message);
  }
}

/**
 * Set claims for multiple users
 */
async function setMultipleUsers(users) {
  console.log(`🔧 Setting custom claims for ${users.length} users...\n`);

  for (const user of users) {
    await setCampusClaim(user.email, user.campus, user.role);
    console.log(''); // Empty line for readability
  }

  console.log('✅ All done!');
  process.exit(0);
}

// ============================================================================
// CONFIGURATION
// Edit this array with your university users
// ============================================================================

const users = [
  // Example 1: UC Berkeley
  {
    email: 'berkeley@university.edu',
    campus: 'UC Berkeley',
    role: 'university'
  },

  // Example 2: Stanford
  {
    email: 'stanford@university.edu',
    campus: 'Stanford University',
    role: 'university'
  },

  // Example 3: UCLA
  {
    email: 'ucla@university.edu',
    campus: 'UCLA',
    role: 'university'
  },

  // Add more users here...
  // {
  //   email: 'your-email@university.edu',
  //   campus: 'Your University Name',
  //   role: 'university'
  // },
];

// ============================================================================
// RUN THE SCRIPT
// ============================================================================

// Validate environment variables
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('❌ Error: Missing Firebase credentials in .env file');
  console.error('Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY');
  process.exit(1);
}

// Run the script
setMultipleUsers(users);
