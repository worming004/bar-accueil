import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import {data, getItems, getTokenByName, getTokens} from "./fillStoreFromJson";
import {aggregateValues} from "../tokens";
import {stat} from "fs";

type Mode = 'Add' | 'Subtract'

export interface CounterState {
    actions: Action[],
    items: Item[],
    tokens: Token[],
    mode: Mode,
    presentation: Presentation,
    status?: string
}

export interface Action {
    item: Item,
    operation: Mode
}

export interface Item {
    name: string,
    tokens: Token[]
}

export interface Token {
    name: string,
    value: number,
    shape: 'round' | 'card',
    displayColor: string
}

export interface TokenWithCount extends Token {
    count: number
}

export interface ItemWithCount extends Item {
    count: number
}

export interface Presentation {
    items: ItemWithCount[],
    tokens: TokenWithCount[],
    amount: number,
    mode: Mode
}

const defaultMode : Mode = 'Add'

export const initialState: CounterState = {
    actions: [],
    items: [],
    tokens: [],
    mode: defaultMode,
    presentation: {
        tokens: [],
        mode: defaultMode,
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
        },
        switchModeTo: (state, action: PayloadAction) => {
            switch (state.mode) {
                case 'Add':
                    state.mode = 'Subtract'
                    break;
                case 'Subtract':
                    state.mode = 'Add'
                    break;
            }
            SetPresentation(state);
        },
        undo: (state, action: PayloadAction) => {
            state.actions.pop();
            SetPresentation(state);
        },
        reset: (state, action: PayloadAction) => {
            state.actions = [];
            state.mode = defaultMode
            SetPresentation(state);
        }
    },
    extraReducers: builder => {
        builder.addCase(data.fulfilled, (state, action) => {
            state.items = getItems(action.payload);
            const tokens = getTokens(action.payload)
            state.tokens = tokens;
            state.presentation.tokens = tokens.map(t => ({...t, count: 0}))
            SetPresentation(state)
        })
        builder.addCase(data.rejected, (state, action) => {
            state.status = "ERROR"
        })
        builder.addCase(data.pending, (state, action) => {
            state.status = "PENDING"
        })
    }
});

function SetPresentation(state: CounterState) {
    const amountFunc = (actions: Action[]) => actions.reduce((prev: number, next: Action) => {
        switch (next.operation) {
            case "Add":
                return prev + aggregateValues(next.item.tokens);
            case "Subtract":
                return prev - aggregateValues(next.item.tokens);
        }
        return prev;
    }, 0);

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

    const tokensWithCount = (tokens: Token[], actions: Action[]): TokenWithCount[] => {
        const tokensWithCount = tokens.map(t => ({...t, count: 0}))
        actions.forEach(a => {
            a.item.tokens.forEach(t => {
                const token = getTokenByName(tokensWithCount, t.name);
                if (!token) {
                    console.log('token not found');
                    return;
                }
                if (a.operation === "Add")
                    token.count++;
                else if (a.operation === "Subtract")
                    token.count--;
                else {
                    console.log('operation not found')
                }
            });
        })
        return tokensWithCount;
    }

    state.presentation = {
        amount: amountFunc(state.actions),
        items: itemsWithCount(state.items, state.actions),
        mode: state.mode,
        tokens: tokensWithCount(state.tokens, state.actions)
    };
}

export const {addItem, addItemsByBatch, executeSelection, setModeTo, switchModeTo, reset, undo} = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectPresentationItems = (state: RootState) => state.counter.presentation.items;
export const selectPresentationTokens = (state: RootState) => state.counter.presentation.tokens;
export const selectPresentationAmount = (state: RootState) => state.counter.presentation.amount;
export const selectPresentationMode = (state: RootState) => state.counter.presentation.mode;
export const selectPresentation = (state: RootState) => state.counter.presentation;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default counterSlice.reducer;
