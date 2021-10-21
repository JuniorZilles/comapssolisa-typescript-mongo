export interface CarSearch {
    modelo?: string
    cor?: string
    ano?: Number
    acessorio?: string
    quantidadePassageiros?: Number
    "acessorios.descricao"?: string
    start?:number
    size?:number
}