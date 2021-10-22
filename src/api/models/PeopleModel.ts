import { PersonUpdateModel } from "./PersonUpdateModel";

export class PeopleModel{
    constructor(
    public people: PersonUpdateModel[],
    public total: Number,
    public limit: Number,
    public offset: Number,
    public offsets:Number){}
}