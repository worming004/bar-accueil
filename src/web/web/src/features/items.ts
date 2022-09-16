import {Item} from "./counter/counterSlice";

export function GetColor(item: Item): string {
    return item.tokens[0]?.displayColor ?? "#f1f1f1"
}