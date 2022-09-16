import {Item} from "./counter/counterSlice";

export function GetColor(item: Item): string {
    return item.tokens[0]?.name ?? "#f1f1f1"
}