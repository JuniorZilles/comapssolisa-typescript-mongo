import PersonSearch from '@interfaces/PersonSearch';
import { List } from './List';

export default interface People extends List {
  pessoas: PersonSearch[];
}
