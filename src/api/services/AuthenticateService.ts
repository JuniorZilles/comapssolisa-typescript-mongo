import bcrypt from 'bcryptjs';
import { NotFound } from "@errors/NotFound"
import tokenGenerator from '@services/TokenService'
import PeopleRepository from "@repositories/PeopleRepository"
import { InvalidValue } from '@errors/InvalidValue';
class AuthenticateService{
    async authenticate(email:string, senha:string){
        const user = await PeopleRepository.findUser({email: email})
        
        if (!user){
            throw new NotFound(email)
        }

        if(! await bcrypt.compare(senha, user.senha)){
            throw new InvalidValue('senha')
        }
        
        const token = tokenGenerator(user.id as string)
        
        return {email: user.email as string, habilitado: user.habilitado as string, token: token}
    }
}

export default new AuthenticateService()