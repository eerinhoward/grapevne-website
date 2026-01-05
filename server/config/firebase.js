const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Option 1: Using service account key file (recommended for development)
// Option 2: Using environment variables (recommended for production)

let firebaseApp;

try {
  // Check if using service account file
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  }
  // Use environment variables
  else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines in private key
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      }),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  }
  // Development mode - app default credentials
  else {
    console.warn('⚠️  No Firebase credentials found. Using application default credentials.');
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  }

  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin SDK:', error.message);
  throw error;
}

module.exports = {
  admin,
  auth: admin.auth(),
  firestore: admin.firestore(),
  firebaseApp
};
