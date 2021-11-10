import { Rental } from '@interfaces/Rental';
import { List } from './List';

export default interface Rentals extends List {
  locadoras: Rental[];
}
