export interface Person {
  id?: string
  nome: string
  cpf: string
  data_nascimento: string | Date
  email: string
  senha: string
  habilitado: string
  dataCriacao?: Date
  dataAtualizacao?: Date
}
