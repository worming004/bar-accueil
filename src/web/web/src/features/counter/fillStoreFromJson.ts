import {Item, Token} from "./counterSlice";
import {createAsyncThunk} from "@reduxjs/toolkit";

type itemsFilesType = {
    items: { name: string, tokenName: string }[],
    tokens: { name: string, value: number }[],
}

export function getTokenByName<T extends Token>(tokens: T[], name: string): T {
    const token = tokens.find(t => t.name === name);
    if (!token) {
        throw new Error("token not found");
    }

    return token;
}

export const data = createAsyncThunk(
    'data/fetch',
    async () => {
        const response = await fetch("items.json");
        return response.json()
    }
)

export function getItems(fileContent: itemsFilesType): Item[] {
    const tokens = fileContent.tokens;
    return fileContent.items.map(i => ({name: i.name, token: getTokenByName(tokens, i.tokenName)}))
}

export function getTokens(fileContent: { tokens: Token[] }): Token[] {
    return fileContent.tokens;
}

