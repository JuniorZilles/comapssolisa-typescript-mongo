import { PersonUpdateModel } from "./PersonUpdateModel";

export class PeopleModel{
    constructor(
    public pessoas: PersonUpdateModel[],
    public total: Number,
    public limit: Number,
    public offset: Number,
    public offsets:Number){}
}