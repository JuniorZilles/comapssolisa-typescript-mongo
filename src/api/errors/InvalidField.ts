export class InvalidField extends Error{

    public idError:number
    
    constructor(field:string){
        super(`O campo '${field}' está fora do formato padrão`)
        this.name = 'InvalidField'
        this.idError = 0
    }
}
