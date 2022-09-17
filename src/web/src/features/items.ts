import {Item} from "./counter/counterSlice";
import {GetTokenColor} from "./tokens";

export function GetItemColor(item: Item): string {
    return GetTokenColor(item.tokens[0] ?? undefined) ?? "#f1f1f1"
}