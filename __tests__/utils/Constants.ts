import { generateToken } from '@services/TokenService';

export const CARPREFIX = '/api/v1/car';
export const CARDATA = {
  modelo: 'GM S10 2.8',
  cor: 'Verde',
  ano: 2021,
  acessorios: [{ descricao: 'Ar-condicionado' }],
  quantidadePassageiros: 5
};
const key = generateToken({
  email: 'joazinho@email.com',
  habilitado: 'sim',
  id: '6171508962f47a7a91938d30'
});

export const TOKEN = { authorization: `Bearer ${key}` };

export const PERSONPREFIX = '/api/v1/people';
export const PERSONDATA = {
  nome: 'joaozinho ciclano',
  cpf: '131.147.860-49',
  data_nascimento: '03/03/2000',
  email: 'joazinho@email.com',
  senha: '123456',
  habilitado: 'sim'
};

export const RENTALPREFIX = '/api/v1/rental';
export const RENTALDATA = {
  nome: 'Localiza Rent a Car',
  cnpj: '16.670.085/0001-55',
  atividades: 'Aluguel de Carros E Gestão de Frotas',
  endereco: [
    {
      cep: '96200-200',
      number: '1234',
      isFilial: false
    },
    {
      cep: '96200-500',
      number: '5678',
      complemento: 'Muro A',
      isFilial: true
    }
  ]
};

export const RENTALRESERVEDATA = {
  id_user: '',
  data_inicio: '20/11/2021',
  data_fim: '30/11/2021',
  id_carro: '',
  id_locadora: ''
};

export const RENTALCARDATA = {
  id_carro: '',
  status: 'disponivel',
  id_locacao: '',
  valor_diaria: '100,00',
  id_locadora: '',
  placa: 'ABC1234'
};

export const RENTALFLEETDATA = {
  id_listagem: '',
  id_locadora: ''
};
