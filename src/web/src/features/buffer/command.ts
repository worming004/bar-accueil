import { ItemWithCount } from "../counter/counterSlice"

export type Command = {
  id?: number,
  itemWithCount: ItemWithCount[],
  isElectronique: boolean,
  isCash: boolean,
  cashReceived: number,
  cashToGiveBack: number,
  amount: number,
}

export function buildElectronique(itemWithCount: ItemWithCount[], amount: number): Command {
  const cmd = {
    itemWithCount,
    isElectronique: true,
    isCash: false,
    cashReceived: 0,
    cashToGiveBack: 0,
    amount,
  }
  removeEmptyItems(cmd);
  return cmd;
}
export function buildCash(itemWithCount: ItemWithCount[], cashReceived: number, cashToGiveBack: number, amount: number): Command {
  const cmd = {
    itemWithCount,
    isElectronique: false,
    isCash: true,
    cashReceived,
    cashToGiveBack,
    amount,
  }
  removeEmptyItems(cmd);
  return cmd;
}

function removeEmptyItems(cmd: Command) {
  cmd.itemWithCount = cmd.itemWithCount.filter(item => item.count > 0);
}
