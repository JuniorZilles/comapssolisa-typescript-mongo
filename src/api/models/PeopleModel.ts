import { PersonPatchModel } from "./PersonPatchModel";

export class PeopleModel{
    constructor(
    public pessoas: PersonPatchModel[],
    public total: Number,
    public limit: Number,
    public offset: Number,
    public offsets:Number){}
}