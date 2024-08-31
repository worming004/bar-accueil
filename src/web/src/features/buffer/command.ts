import { TokenWithCount } from "../counter/counterSlice"

export type Command = {
  tokensWithCount: TokenWithCount[],
  isElectronique: boolean,
  isCash: boolean,
  cashReceived: number,
  cashToGiveBack: number,
  amount: number,
}

export function buildElectronique(tokensWithCount: TokenWithCount[], amount: number): Command {
  return {
    tokensWithCount,
    isElectronique: true,
    isCash: false,
    cashReceived: 0,
    cashToGiveBack: 0,
    amount,
  }
}
export function buildCash(tokensWithCount: TokenWithCount[], cashReceived: number, cashToGiveBack: number, amount: number): Command {
  return {
    tokensWithCount,
    isElectronique: false,
    isCash: true,
    cashReceived,
    cashToGiveBack,
    amount,
  }
}
