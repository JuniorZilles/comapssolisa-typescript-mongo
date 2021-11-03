/* eslint-disable class-methods-use-this */
import bcrypt from 'bcryptjs';
import NotFound from '@errors/NotFound';
import { generateToken } from '@services/TokenService';
import PeopleRepository from '@repositories/PeopleRepository';
import InvalidValue from '@errors/InvalidValue';

class AuthenticateService {
  async authenticate(email:string, senha:string) {
    const user = await PeopleRepository.findUser({ email });

    if (!user) {
      throw new NotFound(email);
    }

    if (!await bcrypt.compare(senha, user.senha)) {
      throw new InvalidValue('senha', 'The value ****** for senha is invalid', true);
    }

    const token = generateToken({
      id: user.id as string,
      email: user.email as string,
      habilitado: user.habilitado as string,
    });

    return token;
  }
}

export default new AuthenticateService();
