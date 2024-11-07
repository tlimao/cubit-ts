import { Cubit, CubitState } from '../../cubit';

class Complex {
    attr1: string;
    attr2: number;

    constructor(attr1: string, attr2: number) {
        this.attr1 = attr1;
        this.attr2 = attr2;
    }

    toString(): string {
        return `${this.attr1} - ${this.attr2}`;
    }
}

class ComplexState extends CubitState<Complex> {
    constructor(value: Complex) {
        super(value);
    }
}

class ComplexCubit extends Cubit<ComplexState> {

    constructor(state: ComplexState) {
        super(state)
    }

    public updateAttr1(attr1: string): void {
        const state: CubitState<Complex> = this.state();
        const new_state: CubitState<Complex> = new ComplexState(
            new Complex(
                attr1,
                state.value().attr2
            )
        )
        this.emit(new_state);
    }

    public updateAttr2(attr2: number): void {
        const state: CubitState<Complex> = this.state();
        const new_state: CubitState<Complex> = new ComplexState(
            new Complex(
                state.value().attr1,
                attr2
            )
        )
        this.emit(new_state);
    }
}

const initial_state: ComplexState = new ComplexState(new Complex("ricky", 0));
const complex_cubit: ComplexCubit = new ComplexCubit(initial_state);

console.log(`State: ${complex_cubit.state().value().toString()}`);
complex_cubit.updateAttr1("Ricky Sanchez");
console.log(`State: ${complex_cubit.state().value().toString()}`);
complex_cubit.updateAttr2(64);
console.log(`State: ${complex_cubit.state().value().toString()}`);