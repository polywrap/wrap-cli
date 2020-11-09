import { expose } from "threads/worker";

export interface State {
  result?: any
  query?: any // TODO: type this
}

const methods = {
  invoke() {

  },
  sendResult() {
    
  }
};

expose(methods);
