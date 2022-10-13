import {
  Args_if,
  Args_for,
  _else,
  _while,
  _Box,
  getwhileKey
} from "./wrap";

export function _if(args: Args_if): _else {
  return {
    _else: args._if._else
  };
}

export function _for(args: Args_for): _Box {
  const value: _while = args._in;
  return {
    box: getwhileKey(value)
  };
}
