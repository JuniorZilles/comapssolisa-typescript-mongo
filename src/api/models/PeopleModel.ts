import PersonSearch from '@interfaces/PersonSearch';

export default class PeopleModel {
  constructor(
    public pessoas: PersonSearch[],
    public total: Number,
    public limit: Number,
    public offset: Number,
    public offsets:Number,
  ) {}
}
