import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState, AppThunk} from '../../app/store';

type Mode = 'Add' | 'Subtract'

export interface CounterState {
    selection: Selection[],
    items: Item[],
    mode: Mode
}

function setSelectionIfNotHere(cs: CounterState, item: Item) {
    if (!!findByItem(item)(cs.selection))
        return;

    cs.selection.push({item: item, count: 0})
}

function findByItem(item: Item) {
    return (selections: Selection[]) => {
        return selections.find(s => s.item.name === item.name);
    }
}

export interface Selection {
    item: Item,
    count: number
}

export interface Item {
    name: string
}

const initialState: CounterState = {
    selection: [],
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
            setSelectionIfNotHere(state, action.payload);
            const selection = findByItem(action.payload)(state.selection)
            // @ts-ignore, previous step ensured it is set
            if (state.mode === 'Add')
                // @ts-ignore, previous step ensured it is set
                selection.count ++;
            else
                // @ts-ignore, previous step ensured it is set
                selection.count --;

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
