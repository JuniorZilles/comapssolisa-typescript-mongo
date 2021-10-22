import { PersonUpdateModel } from "./PersonUpdateModel";

export interface PersonSearch extends PersonUpdateModel{
    start?:string
    size?:string
}