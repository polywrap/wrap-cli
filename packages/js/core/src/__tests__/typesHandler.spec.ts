import { typesHandler } from "../utils";

describe('typesHandler', () => {
  it('should return the original value if it is not a Map', () => {
    const value = { a: 1 };
    expect(typesHandler(undefined, value)).toEqual(value);
  });

  it('should return an empty object if the Map keys are not of type string', () => {
    const value = new Map([[1, 'one'], [2, 'two']]);
    expect(typesHandler(undefined, value)).toEqual({});
  });

  it('should convert empty Map into empty object', () => {
    const value = new Map();
    const expected = {};
    expect(typesHandler(undefined, value)).toEqual(expected);
  });

  it('should convert Map object with string keys into object with key-value pairs', () => {
    const value = new Map([['a', 1], ['b', 2]]);
    const expected = { a: 1, b: 2 };
    expect(typesHandler(undefined, value)).toEqual(expected);
  });

  it('should correctly stringify a Map object with string keys', () => {
    const myObject = {
      myMap: new Map([['a', 1], ['b', 2]])
    };
    const expected = '{\n  "myMap": {\n    "a": 1,\n    "b": 2\n  }\n}';

    const stringified = JSON.stringify(myObject, typesHandler, 2);
    expect(stringified).toEqual(expected);
  });

  it('should correctly stringify a Map object with non-string values', () => {
    const myObject = {
      myMap: new Map([['a', { foo: 'bar' }]])
    };
    const expected = '{\n  "myMap": {\n    "a": {\n      "foo": "bar"\n    }\n  }\n}';

    const stringified = JSON.stringify(myObject, typesHandler, 2);

    expect(stringified).toEqual(expected);
  });

  it('should correctly stringify a non-Map object', () => {
    const myObject = {
      foo: 'bar',
      baz: 42
    };
    const expected = '{\n  "foo": "bar",\n  "baz": 42\n}';

    const stringified = JSON.stringify(myObject, typesHandler, 2);
    expect(stringified).toEqual(expected);
  });
});
