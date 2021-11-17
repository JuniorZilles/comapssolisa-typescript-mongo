import bcrypt from 'bcryptjs';
import NotFound from '@errors/NotFound';
import { generateToken } from '@services/TokenService';
import PeopleRepository from '@repositories/PeopleRepository';
import InvalidValue from '@errors/InvalidValue';

class AuthenticateService {
  async authenticate(email: string, senha: string) {
    const user = await PeopleRepository.findUser({ email });

    if (!user) {
      throw new NotFound(email);
    }
    const isSame = await bcrypt.compare(senha, user.senha);
    if (!isSame) {
      throw new InvalidValue('senha', 'The value ****** for senha is invalid');
    }

    const token = generateToken({
      id: user.id as string,
      email: user.email as string,
      habilitado: user.habilitado as string
    });

    return token;
  }
}

export default new AuthenticateService();
