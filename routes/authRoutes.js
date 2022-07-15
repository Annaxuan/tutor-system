import express from 'express';
import jwt from 'jsonwebtoken';
import { validateInfo } from '../middleware/validateInfo.js';
import db from '../models/index.js';
import Account from '../models/account.js';
import Tutor from '../models/tutor.js';
import { verifyUser } from '../middleware/verifyUser.js';
import {
  validatePassword,
  comparePassword,
  encrypt,
} from './helper/passwordHelper.js';

// /api/auth
const router = express.Router();

router.post('/register', validateInfo, async (req, res) => {
  try {
    // destructure the req.body (name, email, password, role)
    const { username, email, password, role } = req.body;

    const validationMessage = validatePassword(password);
    if (validationMessage) {
      return res.status(400).json({ error: validationMessage });
    }
    // check if the username or email already exists, if so then throw error
    // case 1: user might already exist in Account
    let userOfAccount = await Account(db.sequelize, db.Sequelize).findOne({
      where: { username: username },
    });
    if (userOfAccount !== null) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    userOfAccount = await Account(db.sequelize, db.Sequelize).findOne({
      where: { email: email },
    });
    if (userOfAccount !== null) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // case 2: user might already exist in Tutor
    let userOfTutor = await Tutor(db.sequelize, db.Sequelize).findOne({
      where: { username: username },
    });
    if (userOfTutor !== null) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    userOfTutor = await Tutor(db.sequelize, db.Sequelize).findOne({
      where: { email: email },
    });
    if (userOfTutor !== null) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // now, we know that the user is new, so bcrypt the user's password

    const hashedPassword = await encrypt(password);

    // insert the new user into our database
    // branching upon the type of user: student or tutor
    let newUser;
    if (role === 'student' || role === 'admin') {
      newUser = await Account(db.sequelize, db.Sequelize).create({
        username,
        email,
        password: hashedPassword,
        role,
      });
    } else if (role === 'tutor') {
      newUser = await Tutor(db.sequelize, db.Sequelize).create({
        username,
        email,
        password: hashedPassword,
        role,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registered successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    // expiresIn: '20m',
  });
}

// let refreshTokensList = [];
router.post('/login', validateInfo, async (req, res) => {
  try {
    // destructure the req.body (name, email, password, role)
    const { username, password } = req.body;

    // check if the user exists, if NOT then throw error
    // First, find the user from the Account table
    let userData = await Account(db.sequelize, db.Sequelize).findOne({
      where: { username: username },
    });

    if (userData === null) {
      // Second, find the user in the Tutor table
      userData = await Tutor(db.sequelize, db.Sequelize).findOne({
        where: { username: username },
      });
      if (userData === null) {
        return res.status(401).json({ error: 'Username is not correct' });
      }
    }

    // at this point, name is valid, need to check if the password is valid
    const isValidPassword = await comparePassword(
      password,
      userData.dataValues.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Password is not correct' });
    }

    // JWT
    const user = userData.dataValues;
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      description: user.description,
      campus: user.campus,
      programOfStudy: user.programOfStudy,
    };
    // sign tokens
    const accessToken = generateAccessToken(payload);

    return res
      .status(200)
      .cookie('token', accessToken, { httpOnly: true })
      .json({
        userInfo: payload,
        success: true,
        message: 'Logged in successfully',
        accessToken,
        // refreshToken,
      });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// protected route
router.get('/protected', verifyUser, async (req, res) => {
  try {
    // token = req.cookies['token'];
    return res.json({
      info: `protected information from backend ${req.user.email}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  console.log(req.user);
  res.json({ message: 'success' });
});

router.get('/special/:username', verifyUser, async (req, res) => {
  if (req.user.username === req.params.username) {
    res.json('same username');
  } else if (req.user.role === 'admin') {
    res.json('currently logged-in user is admin');
  }
});

router.delete('/:username', verifyUser, (req, res) => {
  if (req.user.role === 'admin') {
    res
      .status(200)
      .json(`User account ${req.params.username} has been deleted.`);
  } else {
    res.status(403).json('You are not allowed to delete this user!');
  }
});

// log out
router.post('/logout', verifyUser, async (req, res) => {
  try {
    return res.status(200).clearCookie('token', { httpOnly: true }).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
