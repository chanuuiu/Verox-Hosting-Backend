const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { loadUsers, saveUsers } = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

// Verify admin middleware
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all users
router.get('/users', verifyAdmin, (req, res) => {
  try {
    const users = loadUsers();
    const sanitized = users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      isAdmin: u.isAdmin,
      createdAt: u.createdAt,
    }));
    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create user
router.post('/users', verifyAdmin, async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const users = loadUsers();
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    saveUsers(users);

    res.json({
      message: 'User created successfully',
      user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    let users = loadUsers();

    if (!users.find(u => u.id === id)) {
      return res.status(404).json({ message: 'User not found' });
    }

    users = users.filter(u => u.id !== id);
    saveUsers(users);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user
router.put('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;
    let users = loadUsers();

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex].isAdmin = isAdmin || users[userIndex].isAdmin;
    saveUsers(users);

    const updated = users[userIndex];
    res.json({
      message: 'User updated successfully',
      user: { id: updated.id, username: updated.username, email: updated.email, isAdmin: updated.isAdmin },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
