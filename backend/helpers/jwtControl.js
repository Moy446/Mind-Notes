import token from 'jsonwebtoken';
import 'dotenv/config';

const generateToken = (id,userName) => {
  return token.sign({ id, userName }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export default generateToken;