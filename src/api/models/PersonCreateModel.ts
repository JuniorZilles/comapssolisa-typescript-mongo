export interface PersonCreateModel {
    id?: string
    nome: string
    cpf: string
    data_nascimento: Date
    email: string
    senha: string
    habilitado: string
    dataCriacao?: Date
}