import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { data, getItems, getTokenByName, getTokens } from "./fillStoreFromJson";
import { aggregateValues } from "../tokens";

type TokenMode = 'Add' | 'Subtract'
type PresentationMode = 'Token' | 'Payment'

export interface CounterState {
  actions: Action[],
  items: Item[],
  tokens: Token[],
  featureFlag?: FeatureFlag,
  amountReceived: number,
  amountToGiveBack: number,
  tokenMode: TokenMode,
  presentationMode: PresentationMode,
  presentation: Presentation,
  status?: string
}

export interface FeatureFlag {
  showUndo?: boolean
}

export interface Action {
  item: Item,
  operation: TokenMode
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
  tokenMode: TokenMode
}

const defaultMode: TokenMode = 'Add'

export const initialState: CounterState = {
  actions: [],
  items: [],
  tokens: [],
  featureFlag: {
    showUndo: false,
  },
  tokenMode: defaultMode,
  presentationMode: 'Token',
  amountReceived: 0,
  amountToGiveBack: 0,
  presentation: {
    tokens: [],
    tokenMode: defaultMode,
    items: [],
    amount: 0
  }
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    executeSelection: (state, action: PayloadAction<Item>) => {
      state.actions.push({ item: action.payload, operation: state.tokenMode })
      SetPresentation(state);
    },
    setModeTo: (state, action: PayloadAction<TokenMode>) => {
      state.tokenMode = action.payload;
      SetPresentation(state);
    },
    switchModeTo: (state) => {
      switch (state.tokenMode) {
        case 'Add':
          state.tokenMode = 'Subtract'
          break;
        case 'Subtract':
          state.tokenMode = 'Add'
          break;
      }
      SetPresentation(state);
    },
    undo: (state) => {
      state.actions.pop();
      SetPresentation(state);
    },
    resetSelection: (state) => {
      state.actions = [];
      state.tokenMode = defaultMode
      SetPresentation(state);
    },
    resetAmountReceived: (state) => {
      state.amountReceived = 0;
      SetPresentation(state);
    },
    paymentMode: (state) => {
      state.presentationMode = 'Payment'
      SetPresentation(state)
    },
    tokenMode: (state) => {
      state.presentationMode = 'Token'
      SetPresentation(state)
    },
    amountReceived: (state, action: PayloadAction<number>) => {
      state.amountReceived = action.payload;
      SetPresentation(state)
    },
  },
  extraReducers: builder => {
    builder.addCase(data.fulfilled, (state, action) => {
      state.items = getItems(action.payload);
      const tokens = getTokens(action.payload)
      state.tokens = tokens;
      state.presentation.tokens = tokens.map(t => ({ ...t, count: 0 }))
      SetPresentation(state)
      SetToGiveBack(state)
    })
    builder.addCase(data.rejected, (state) => {
      state.status = "ERROR"
    })
    builder.addCase(data.pending, (state) => {
      state.status = "PENDING"
    })
  }
});

function SetToGiveBack(state: CounterState) {
  state.amountToGiveBack = state.amountReceived - state.presentation.amount;
}

function SetPresentation(state: CounterState) {
  const amountFunc = (actions: Action[]) => actions.reduce((prev: number, next: Action) => {
    switch (next.operation) {
      case "Add":
        return prev + aggregateValues(next.item.tokens);
      case "Subtract":
        return prev - aggregateValues(next.item.tokens);
      default:
        return prev;
    }
  }, 0);

  const itemsWithCount = (items: Item[], actions: Action[]): ItemWithCount[] => {
    const result: ItemWithCount[] = items.map(it => ({ ...it, count: 0 }));
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
    const tokensWithCount = tokens.map(t => ({ ...t, count: 0 }))
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
    tokenMode: state.tokenMode,
    tokens: tokensWithCount(state.tokens, state.actions)
  };
  SetToGiveBack(state);
}

export const { executeSelection, resetAmountReceived, amountReceived, setModeTo, switchModeTo, resetSelection, paymentMode, tokenMode, undo } = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectPresentationItems = (state: RootState) => state.counter.presentation.items;
export const selectPresentationTokens = (state: RootState) => state.counter.presentation.tokens;
export const selectPresentationMode = (state: RootState) => state.counter.presentationMode;
export const selectPresentationAmount = (state: RootState) => state.counter.presentation.amount;
export const selectPresentationAmountReceived = (state: RootState) => state.counter.amountReceived;
export const selectAmountToGiveBack = (state: RootState) => state.counter.amountToGiveBack;
export const selectTokenMode = (state: RootState) => state.counter.presentation.tokenMode;
export const selectPresentation = (state: RootState) => state.counter.presentation;
export const selectFeatureFlag = (state: RootState) => state.counter.featureFlag;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default counterSlice.reducer;
