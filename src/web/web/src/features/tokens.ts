import {Token} from "./counter/counterSlice";

export function aggregateValues<T extends Token>(tokens: T[]): number {
    return tokens.reduce((p, t)=> p+t.value, 0);
}