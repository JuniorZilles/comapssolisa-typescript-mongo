import PersonSearch from '@interfaces/PersonSearch';

export default class PeopleModel {
  constructor(
    public pessoas: PersonSearch[],
    public total: number,
    public limit: number,
    public offset: number,
    public offsets: number
  ) {}
}
