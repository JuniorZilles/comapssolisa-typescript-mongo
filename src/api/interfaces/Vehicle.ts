import Car from '@interfaces/Car';
import { List } from './List';

export default interface Vehicles extends List {
  veiculos: Car[];
}
