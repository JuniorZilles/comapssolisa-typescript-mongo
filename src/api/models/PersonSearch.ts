import { PersonUpdateModel } from "./PersonUpdateModel";

export interface PersonSearch extends PersonUpdateModel{
    start?:number
    size?:number
}