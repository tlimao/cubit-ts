export abstract class State<T> {

    constructor(
        private readonly _value: T
    ) { }

    public value(): T {
        return this._value;
    }
}