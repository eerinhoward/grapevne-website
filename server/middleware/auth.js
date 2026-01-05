const { auth } = require('../config/firebase');

/**
 * Middleware to verify Firebase ID token
 * Attaches user information to req.user
 */
async function verifyToken(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          message: 'No authorization token provided',
          code: 'AUTH_TOKEN_MISSING'
        }
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (!idToken) {
      return res.status(401).json({
        error: {
          message: 'Invalid authorization format',
          code: 'AUTH_TOKEN_INVALID'
        }
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      campus: decodedToken.campus || null, // Custom claim for campus
      role: decodedToken.role || 'university', // Custom claim for role
    };

    console.log(`✅ Authenticated user: ${req.user.email} (${req.user.campus})`);

    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);

    // Handle specific Firebase Auth errors
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        error: {
          message: 'Token has expired',
          code: 'AUTH_TOKEN_EXPIRED'
        }
      });
    }

    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        error: {
          message: 'Token has been revoked',
          code: 'AUTH_TOKEN_REVOKED'
        }
      });
    }

    return res.status(401).json({
      error: {
        message: 'Invalid authentication token',
        code: 'AUTH_TOKEN_INVALID'
      }
    });
  }
}

/**
 * Middleware to check if user has campus assigned
 * Must be used after verifyToken middleware
 */
function requireCampus(req, res, next) {
  if (!req.user || !req.user.campus) {
    return res.status(403).json({
      error: {
        message: 'No campus assigned to this account',
        code: 'CAMPUS_NOT_ASSIGNED'
      }
    });
  }
  next();
}

/**
 * Middleware to check user role
 * Must be used after verifyToken middleware
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          message: `Access denied. Required roles: ${roles.join(', ')}`,
          code: 'INSUFFICIENT_PERMISSIONS'
        }
      });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  requireCampus,
  requireRole
};
