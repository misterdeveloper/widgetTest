const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const sqlite3 = require('sqlite3').verbose();
const { Sequelize, DataTypes } = require('sequelize');
const util = require('util');

const app = express();
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: ':memory:'
// });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database_turingtest3.sqlite"
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// The following code forces the databse to be re-written and will erase all existing data.
// (async () => {
//   await sequelize.sync({ force: true });
//   await User.create({
//     username: 'admin',
//     password: bcrypt.hashSync('admin123', 10),
//     role: 'admin'
//   });
//   await User.create({
//     username: 'user',
//     password: bcrypt.hashSync('user123', 10),
//     role: 'user'
//   });
// })();

const SECRET_KEY = 'secret';

function authenticate(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }
  try {
    const payload = jwt.decode(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ where: { username } });
//   if (!user || !bcrypt.compareSync(password, user.password)) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }
//   const payload = { id: user.id, username: user.username, role: user.role };
//   const token = jwt.encode(payload, SECRET_KEY);
//   res.json({ token });
// });

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Missing username' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }
  const user = await User.findOne({ where: { username } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const payload = { id: user.id, username: user.username, role: user.role };
  const token = jwt.encode(payload, SECRET_KEY);
  res.json({ token });
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: 'user'
    });
    const payload = { id: newUser.id, username: newUser.username, role: newUser.role };
    const token = jwt.encode(payload, SECRET_KEY);
    res.json({ token });
  });

  app.get('/users', authenticate, authorize('admin'), async (req, res) => {
    const users = await User.findAll({ attributes: ['id', 'username', 'role'] });
    res.json(users);
  });
  
  app.put('/users/:id', authenticate, async (req, res) => {
      const userId = req.params.id;
      const { username, password } = req.body;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (username && user.username !== username) {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
          return res.status(409).json({ message: 'Username already taken' });
        }
        user.username = username;
      }
      if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        user.password = hashedPassword;
      }
      await user.save();
      const payload = { id: user.id, username: user.username, role: user.role };
      const token = jwt.encode(payload, SECRET_KEY);
      res.json({ token });
    });
    


app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
