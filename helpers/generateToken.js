const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
    const secretKey = process.env.SECRET_KEY;
  const token = jwt.sign({ ...payload },  secretKey, { expiresIn: "2h" });
  return token;
};

module.exports = { generateToken };