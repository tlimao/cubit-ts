export class CubitState<T> {
    private readonly _value: T;

    constructor(value: T) {
        this._value= value;
    }

    public value(): T {
        return this._value;
    }
}