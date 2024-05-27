const prisma = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePasswords } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/authUtils');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, walletAddress } = req.body;

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        walletAddress,
        role: 'USER', // Set the default role to 'USER'
      },
    });

    // Generate a JWT token
    const token = generateToken(user.id);

    // Set the token as a cookie
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate a JWT token
    const token = generateToken(user.id);

    // Set the token as a cookie
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });

    res.status(200).json({ message: 'User signed in successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token');

    res.status(200).json({ message: 'User signed out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};