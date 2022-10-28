const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
  const authHeader = req.header('Authorization')
  const accessToken = authHeader && authHeader.split(' ')[1]
  if (!accessToken) return res.status(401).json({ message: 'Token not found' })

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    req.id = decoded.id
    next()
  } catch (error) {
    res.status(403).json({ message: 'Forbidden: invalid token' })
  }
}

module.exports = verifyJWT
