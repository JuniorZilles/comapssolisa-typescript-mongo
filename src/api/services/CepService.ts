import NotFound from '@errors/NotFound';
import { CepPayload } from '@interfaces/CepPayload';
import axios from 'axios';

const getCEP = async (cep: string): Promise<CepPayload> => {
  const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  if (response.data.erro === true) {
    throw new NotFound(`CEP ${cep}`);
  }
  return response.data;
};

export default getCEP;
