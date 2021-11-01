import PersonPatchModel from './PersonPatchModel';

export interface PersonSearch extends PersonPatchModel{
  offset?:string
  limit?:string
}
