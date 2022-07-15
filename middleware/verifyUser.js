import jwt from 'jsonwebtoken';
import {isAdminOrStudentId, isTutorId} from "../routes/helper/idValidationHelper.js";

const verifyUser = (req, res, next) => {
  // Bearer token
  const headerAuth = req.headers.authorization;
  if (headerAuth) {
    const token = headerAuth.split(' ')[1];
    if (token === null) {
      return res.status(401).json({ error: 'Token is Null' });
    }
    // jwt.verify returns the payload decoded if the signature is valid

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }

      // attach user as a property to req
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'No header with tooken! Not authenticated' });
  }
};

const verifyAdmin = (req, res, next) => {
  const role = req.user.role;
  const userId = req.user.id;
  if ((! isAdminOrStudentId(userId)) || role !== "admin") {
    res.status(403).send("You don't have access!")
  } else {
    next()
  }
}

export { verifyUser, verifyAdmin };
