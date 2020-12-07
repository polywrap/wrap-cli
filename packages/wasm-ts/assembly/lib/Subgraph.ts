import {_w3_subgraph_query} from '../host/subgraph';

export class Subgraph {
  static query(query: string): string {
    return _w3_subgraph_query(query);
  }
}
