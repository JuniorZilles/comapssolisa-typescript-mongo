import { PersonUpdateModel } from "./PersonUpdateModel";

export interface PersonSearch extends PersonUpdateModel{
    offset?:string
    limit?:string
}