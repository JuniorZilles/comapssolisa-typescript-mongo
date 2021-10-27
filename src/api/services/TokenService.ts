import jwt from 'jsonwebtoken';
import auth from '../../config/auth';

export const generateToken = (userId:string) => jwt.sign(
  { id: userId }, auth.secret, { expiresIn: 86400 },
);

export const verifyToken = (token:string) => jwt.verify(token, auth.secret);
