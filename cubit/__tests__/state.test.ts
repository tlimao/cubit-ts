import { State } from '../src/state';

class TestState<T> extends State<T> {
    constructor(value: T) {
        super(value);
    }
}

describe('State - Basic Operations', () => {
    it('should wrap primitive values', () => {
        const state = new TestState(42);
        expect(state.value()).toBe(42);
    });

    it('should wrap string values', () => {
        const state = new TestState('hello');
        expect(state.value()).toBe('hello');
    });

    it('should wrap object values', () => {
        const obj = { name: 'Alice', age: 30 };
        const state = new TestState(obj);
        expect(state.value()).toEqual(obj);
    });

    it('should wrap array values', () => {
        const arr = [1, 2, 3];
        const state = new TestState(arr);
        expect(state.value()).toEqual(arr);
    });

    it('should return the same reference for objects', () => {
        const obj = { count: 0 };
        const state = new TestState(obj);
        expect(state.value()).toBe(obj);
    });

    it('should handle null values', () => {
        const state = new TestState<number | null>(null);
        expect(state.value()).toBeNull();
    });

    it('should handle undefined values', () => {
        const state = new TestState<string | undefined>(undefined);
        expect(state.value()).toBeUndefined();
    });
});
