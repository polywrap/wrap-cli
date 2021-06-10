import {
  QueryHandler,
  InvokeHandler,
} from "./";

export interface Client extends QueryHandler, InvokeHandler {
}
