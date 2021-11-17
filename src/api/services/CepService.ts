import NotFound from '@errors/NotFound';
import { Endereco } from '@interfaces/Endereco';
import axios from 'axios';
import config from '../../config/config';

const getCEP = async (cep: string): Promise<Endereco> => {
  const url = config.cepApi.replace('{cep}', cep);
  const response = await axios.get(url);
  if (response.data.erro === true) {
    throw new NotFound(`CEP ${cep}`);
  }
  return response.data;
};

export default getCEP;
