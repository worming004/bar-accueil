import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import {data, getItems, getTokens} from "./fillStoreFromJson";

type Mode = 'Add' | 'Subtract'

export interface CounterState {
    actions: Action[],
    items: Item[],
    mode: Mode,
    presentation: Presentation
}

export interface Action {
    item: Item,
    operation: Mode
}

export interface Item {
    name: string,
    token: Token
}

export interface Token {
    name: string,
    value: number
}

export interface ItemWithCount extends Item {
    count: number
}

export interface Presentation {
    items: ItemWithCount[],
    tokens: Token[],
    amount: number,
    mode: Mode
}

export const initialState: CounterState = {
    actions: [],
    items: [],
    mode: 'Add',
    presentation: {
        tokens: [],
        mode: 'Add',
        items: [],
        amount: 0
    }
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        addItem: (state, action: PayloadAction<Item>) => {
            state.items.push(action.payload);
            SetPresentation(state);
        },
        addItemsByBatch: (state, action: PayloadAction<Item[]>) => {
            action.payload.forEach(it => state.items.push(it))
            SetPresentation(state);
        },
        executeSelection: (state, action: PayloadAction<Item>) => {
            state.actions.push({item: action.payload, operation: state.mode})
            SetPresentation(state);
        },
        setModeTo: (state, action: PayloadAction<Mode>) => {
            state.mode = action.payload;
            SetPresentation(state);
        }
    },
    extraReducers: builder => {
        builder.addCase(data.fulfilled, (state, action) => {
            state.items = getItems(action.payload);
            state.presentation.tokens = getTokens(action.payload)
        })
    }
});

function SetPresentation(state: CounterState) {
    const amountFunc = (actions: Action[]) => actions.reduce((prev: number, next: Action) => prev + next.item.token.value, 0);
    const itemsWithCount = (items: Item[], actions: Action[]): ItemWithCount[] => {
        const result: ItemWithCount[] = items.map(it => ({...it, count: 0}));
        actions.forEach(act => {
            const relatedItem = result.find(it => it.name === act.item.name)
            if (!relatedItem) return;

            if (act.operation === 'Add') {
                relatedItem.count++;
            } else if (act.operation === 'Subtract') {
                relatedItem.count--;
            }
        })
        return result;
    }
    state.presentation = {
        amount: amountFunc(state.actions),
        items: itemsWithCount(state.items, state.actions),
        mode: state.mode,
        tokens: []
    };
}

export const {addItem, addItemsByBatch, executeSelection, setModeTo} = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectItems = (state: RootState) => state.counter.items;
export const selectPresentation = (state: RootState) => state.counter.presentation;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default counterSlice.reducer;
