// Only class and string types can be
// "nullable" using the `| null` notation.
// Nullable<T> is used for nullable value types.
// https://www.assemblyscript.org/types.html#type-rules
export class Nullable<T> {
  private _value: T;
  private _nil: bool;

  get value(): T {
    return this._value
  }

  set value(arg: T) {
    this._value = arg;
    this._nil = false;
  }

  get isNull(): boolean {
    return this._nil;
  }

  static fromValue<T>(value: T): Nullable<T> {
    const nullable = new Nullable<T>();
    nullable.value = value;
    return nullable;
  }

  static fromNull<T>(): Nullable<T> {
    return new Nullable<T>();
  }

  constructor() {
    this.toNull();
  }

  toNull(): void {
    this._nil = true;
  }

  @inline
  @operator("==")
  protected eq(rhs: Nullable<T>): bool {
    if (this._nil) {
      return this._nil == rhs._nil;
    } else {
      return !(rhs._nil || this._value != rhs._value)
    }
  }

  @inline
  @operator("!=")
  protected neq(rhs: Nullable<T>): bool {
    return !this.eq(rhs);
  }
}
