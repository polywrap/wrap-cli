import {
  Args__if,
  Args__for,
  _else,
  _while,
  _Box,
  getwhileKey
} from "./wrap";

export function _if(args: Args__if): _else {
  return {
    _else: args._if._else
  };
}

export function _for(args: Args__for): _Box {
  const value: _while = args._in;
  return {
    box: getwhileKey(value)
  };
}
