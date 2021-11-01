import PersonPatchModel from '@interfaces/PersonPatchModel';

export default class PeopleModel {
  constructor(
    public pessoas: PersonPatchModel[],
    public total: Number,
    public limit: Number,
    public offset: Number,
    public offsets:Number,
  ) {}
}
