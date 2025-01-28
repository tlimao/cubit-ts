import { BehaviorSubject, Observable } from "rxjs";

/**
 * Abstract class for state management using RxJS.
 * 
 * The `Cubit` class manages state reactively, allowing state emission,
 * middleware application, and state observation.
 * 
 * @template T The type of state managed by the class.
 */
export abstract class Cubit<T> {
    private readonly _stateStream: BehaviorSubject<T>;
    private readonly _middlewares: Array<(state: T) => T> = [];
    private _debug: boolean = false;

    /**
     * Creates a new instance of Cubit with the provided initial state.
     * 
     * @param {T} state The initial state of the Cubit.
     */
    constructor(state: T) {
        this._stateStream = new BehaviorSubject(state);
    }

    /**
     * Gets the current state managed by the Cubit.
     * 
     * @returns {T} The current state.
     */
    public state(): T {
        return this._stateStream.value;
    }

    /**
     * Emits a new state to the stream. This method also applies registered middlewares and executes
     * the `beforeEmit` and `afterEmit` hooks.
     * 
     * @param {T} state The next state to be emitted.
     * @throws {Error} If the state stream is closed.
     */
    public emit(state: T): void {
        if (this._stateStream.closed) {
            throw new Error("State stream is closed");
        }

        if (this._debug) {
            console.log("Current State:", this.state());
            console.log("Next State:", state);
        }

        const nextState = this.applyMiddlewares(state);
        this.beforeEmit(nextState);
        this._stateStream.next(nextState);
        this.afterEmit(nextState);
    }

    /**
     * Returns an `Observable` that emits state updates whenever `emit` is called.
     * 
     * @returns {Observable<T>} A reactive state stream.
     */
    public stream(): Observable<T> {
        return this._stateStream.asObservable();
    }

    /**
     * Registers a middleware that will be applied to the state before it is emitted.
     * 
     * @param {(state: T) => T} middleware A function that takes the current state and returns the modified state.
     */
    public use(middleware: ((state: T) => T)): void {
        this._middlewares.push(middleware);
    }

    /**
     * Enables debug mode, which logs the current and next states to the console whenever `emit` is called.
     */
    public enableDebug(): void {
        this._debug = true;
    }

    /**
     * Hook method called before a new state is emitted.
     * Can be overridden by subclasses to add custom logic.
     * 
     * @param {T} state The state that will be emitted.
     */
    protected beforeEmit(state: T): void {
        // Hook for logic before emitting the state.
    }

    /**
     * Hook method called after a new state is emitted.
     * Can be overridden by subclasses to add custom logic.
     * 
     * @param {T} state The state that was emitted.
     */
    protected afterEmit(state: T): void {
        // Hook for logic after emitting the state.
    }

    /**
     * Applies all registered middlewares to the state before emitting it.
     * 
     * @private
     * @param {T} state The original state.
     * @returns {T} The state after middleware processing.
     */
    private applyMiddlewares(state: T): T {
        return this._middlewares.reduce((currentState, middleware) => middleware(currentState), state);
    }
}