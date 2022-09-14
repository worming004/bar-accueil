import {Item, Token} from "./counterSlice";
import {createAsyncThunk} from "@reduxjs/toolkit";

type itemsFilesType  = {
    items: {name: string, tokenName: string}[],
    tokens: {name: string, value: number},
}

function getTokenByName(tokens: Token[], name: string): Token {
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

export function getItems(fileContent: { items: { name: any; tokenName: string; }[], tokens: Token[] }): Item[] {
    const tokens = fileContent.tokens;
    return fileContent.items.map(i => ({name: i.name, token: getTokenByName(tokens, i.tokenName)}))
}

export function getTokens(fileContent: { tokens: Token[] }): Token[] {
    return fileContent.tokens;
}
//
// export const itemsApi = createApi({
//     reducerPath: 'itemsApi',
//     baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000'}),
//     endpoints: (builder) => ({
//         getItems: builder.query<itemsFilesType, {}>({
//             query: () => 'items.json',
//         })
//     })
// });
//
// export const { useGetItemsQuery } = itemsApi as any
