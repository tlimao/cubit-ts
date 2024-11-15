import { BehaviorSubject, Observable } from "rxjs";

export class Cubit<T> {

    private readonly _stateStream: BehaviorSubject<T>;

    constructor(state: T) {
        this._stateStream = new BehaviorSubject(state);
    }

    public state(): T {
        return this._stateStream.value;
    }

    public emit(state: T): void {
        this._stateStream.next(state);
    }

    public stream(): Observable<T> {
        return this._stateStream.asObservable();
    }
}