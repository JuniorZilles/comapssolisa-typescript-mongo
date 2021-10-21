export class MissingBody extends Error{
    public status:number
    constructor(){
        super(`Corpo da requisição incompleto`)
        this.name = 'MissingBody'
        this.status = 400
    }
}