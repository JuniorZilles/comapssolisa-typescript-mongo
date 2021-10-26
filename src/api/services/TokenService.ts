import jwt from 'jsonwebtoken'
import auth from '../../config/auth'
export default function generateToken(userId:string) {
    return jwt.sign({id: userId}, auth.secret, {expiresIn: 86400})
}