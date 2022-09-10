import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';

type Mode = 'Add' | 'Subtract'

export interface CounterState {
    actions: Action[],
    items: Item[],
    mode: Mode
}

export interface Action {
    item: Item,
    operation: Mode
}

export interface Item {
    name: string,
}

export interface Token {
    name: string,
    metadata: any,
    price: number,
}

const initialState: CounterState = {
    actions: [],
    items: [],
    mode: 'Add'
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        addItem: (state, action: PayloadAction<Item>) => {
            state.items.push(action.payload);
        },
        addItemsByBatch: (state, action: PayloadAction<Item[]>) => {
            action.payload.forEach(it => state.items.push(it))
        },
        executeSelection: (state, action: PayloadAction<Item>) => {
            state.actions.push({item: action.payload, operation: state.mode})
        },
        setModeTo: (state, action: PayloadAction<Mode>) => {
            state.mode = action.payload;
        }
    },
});

export const {addItem, addItemsByBatch, executeSelection, setModeTo} = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectItems = (state: RootState) => state.counter.items;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default counterSlice.reducer;
