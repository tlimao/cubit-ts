import { Cubit } from '../../cubit';

class CounterCubit extends Cubit<number> {

    constructor(state: number) {
        super(state)
    }

    public increment(): void {
        this.emit(this.state()+1);
    }

    public decrement(): void {
        this.emit(this.state()-1);
    }
}

const counterCubit: CounterCubit = new CounterCubit(0);

console.log(`State: ${counterCubit.state()}`); // 0
counterCubit.increment();
console.log(`State: ${counterCubit.state()}`); // 1
counterCubit.decrement();
console.log(`State: ${counterCubit.state()}`); // 0