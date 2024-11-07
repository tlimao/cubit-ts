export class Cubit<T> {

    private _state: T;

    constructor(state: T) {
        this._state = state;
    }

    public state(): T {
        return this._state;
    }

    public emit(state: T) {
        this._state = state;
    }
}