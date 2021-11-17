import NotFound from '@errors/NotFound';
import { CepPayload } from '@interfaces/CepPayload';
import axios from 'axios';
import config from '../../config/config';

const getCEP = async (cep: string): Promise<CepPayload> => {
  const url = config.cepApi.replace('{cep}', cep);
  const response = await axios.get(url);
  if (response.data.erro === true) {
    throw new NotFound(`CEP ${cep}`);
  }
  return response.data;
};

export default getCEP;
