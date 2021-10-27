import jwt from 'jsonwebtoken';
import auth from '../../config/auth';

export const generateToken = (obj:Object) => jwt.sign(
  { content: obj }, auth.secret, { expiresIn: 86400 },
);

export const verifyToken = (token:string) => jwt.verify(token, auth.secret);
