import { BehaviorSubject, Observable } from "rxjs";

export class Cubit<T> {

    private _state: BehaviorSubject<T>;

    constructor(state: T) {
        this._state = new BehaviorSubject(state);
    }

    public state(): T {
        return this._state.value;
    }

    public emit(state: T): void {
        this._state.next(state);
    }

    public stream(): Observable<T> {
        return this._state.asObservable();
    }
}