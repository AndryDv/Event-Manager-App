const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

//Register new User
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: 'Invalid input, please check your data', errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(422).json({
        msg: 'User already exists, please login instead.',
        type: 'USER_EXISTS'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      events: []
    });

    const token = jwt.sign(
      { userId: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    res.status(201).json({ userId: user.id, name: user.name, token: token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//Login User
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: "Invalid input, please check your data" });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(403).json({ msg: "Invalid credentials, could not log you in." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(403).json({ msg: "Invalid credentials, could not log you in." });
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    return res.json({ userId: user.id, name: user.name, token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    return res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error('Error resetting password:', error.message);
    return res.status(500).json({ message: 'Server error, try again later.', error: error.message });
  }
};

exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.resetPassword = resetPassword;
