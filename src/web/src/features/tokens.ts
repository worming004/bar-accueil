import {Token} from "./counter/counterSlice";

export function aggregateValues<T extends Token>(tokens: T[]): number {
    return tokens.reduce((previous, token)=> previous+token.value, 0);
}

export function GetTokenColor(token : Token): string | undefined {
    return token?.displayColor
}