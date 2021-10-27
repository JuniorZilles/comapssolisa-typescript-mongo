export interface PersonCreateModel {
  id?: string
  nome: string
  cpf: string
  data_nascimento: string
  email: string
  senha: string
  habilitado: string
  dataCriacao?: Date
}
