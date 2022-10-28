const { Router } = require('express')
const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')

const Post = require('../models/Post')

// Read
router.get('/', verifyJWT, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.id }).populate('user', ['username'])
    res.status(200).json({ success: true, posts })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// Create
router.post('/', verifyJWT, async (req, res) => {
  const { title, description, status, url } = req.body
  if (!title || !description)
    return res.status(400).json({ success: false, message: 'Title and/or description required' })

  try {
    const newPost = await Post.create({
      title,
      description,
      url: url.startsWith('https://') ? url : `https://${url}`,
      status: status || 'TO LEARN',
      user: req.id,
    })

    return res.status(201).json({ success: true, message: 'Happy learning!', post: newPost })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Update
router.put('/:id', verifyJWT, async (req, res) => {
  const { title, description, status, url } = req.body
  if (!title || !description)
    return res.status(400).json({ success: false, message: 'Title and/or description required' })

  let updatedPost = {
    title,
    description,
    status,
    url: url.startsWith('https://') ? url : `https://${url}`,
  }

  const updateCondition = {
    user: req.id,
    _id: req.params.id,
  }

  updatedPost = await Post.findOneAndUpdate(updateCondition, updatedPost, { new: true })

  if (!updatedPost)
    return res.status(400).json({
      success: false,
      message: 'Update failed, post does not exist but or you are not the owner of this post',
    })
  res.status(202).json({ success: true, message: 'Great progress! Keep it up', post: updatedPost })
})

// Delete
router.delete('/:id', verifyJWT, async (req, res) => {
  try {
    const deleteCondition = {
      user: req.id,
      _id: req.params.id,
    }

    const deletedPost = await Post.findOneAndDelete(deleteCondition)
    if (!deletedPost)
      return res.status(400).json({
        success: false,
        message: 'Delete failed, post does not exist but or you are not the owner of this post',
      })

    res.status(200).json({ success: true, message: 'Delete successful' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
