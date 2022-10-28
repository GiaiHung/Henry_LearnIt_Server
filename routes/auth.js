const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

router.post('/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing username and/or password' })
  }

  try {
    // Check for duplicate
    const user = await User.findOne({ username })
    if (user) return res.status(400).json({ success: false, message: 'User already exists' })

    const hashedPassword = await argon2.hash(password)

    const newUser = await User.create({
      username,
      password: hashedPassword,
    })

    const accessToken = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET)

    return res.status(201).json({ success: true, newUser, accessToken })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing username and/or password' })
  }

  try {
    // Check password
    const user = await User.findOne({ username })

    if (!user) return res.status(400).json({ message: 'User not found' })
    const passworValid = await argon2.verify(user.password, password)
    if (!passworValid)
      return res.status(400).json({ success: false, message: 'Password is incorrect' })

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET)

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        accessToken,
        ...user._doc,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
