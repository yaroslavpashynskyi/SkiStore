import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";

export interface BasketState {
    basket: Basket | null;
    status: string;
}

const initialState: BasketState = {
    basket: null,
    status: "idle"
}

export const addBasketItemAsync = createAsyncThunk<Basket, { productId: number, quantity?: number }>(
    "basket/addBasketItemAsync",
    async ({ productId, quantity = 1 }, thunkAPI) => {
        try {
            return await agent.Basket.addItem(productId, quantity)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.respone.data });
        }
    }
);

export const removeBasketItemAsync = createAsyncThunk<void, { productId: number, quantity?: number }>(
    "basket/removeBaksetItemAsync",
    async ({ productId, quantity = 1 }, thunkAPI) => {
        try {
            await agent.Basket.removeItem(productId, quantity)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.respone.data });
        }
    }
);
export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload;
        }
    },
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            state.status = "pendingAddItem" + action.meta.arg.productId;
        });
        builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
            state.basket = action.payload;
            state.status = "idle";
        });
        builder.addCase(addBasketItemAsync.rejected, (state) => {
            state.status = "idle";
        });
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            state.status = (action.meta.arg.quantity === current(state).basket?.items.find(i => i.productId === action.meta.arg.productId)?.quantity
                ? "pendingDeleteItem" : "pendingRemoveItem") + action.meta.arg.productId;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const { productId, quantity = 1 } = action.meta.arg;
            const itemIndex = state.basket?.items.findIndex(i => i.productId === productId)
            if (itemIndex === -1 || itemIndex === undefined) return;
            state.basket!.items[itemIndex].quantity -= quantity!;
            if (state.basket!.items[itemIndex].quantity <= 0)
                state.basket!.items.splice(itemIndex, 1);
            state.status = "idle";
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            state.status = "idle";
            console.log(action.payload);
        });
    })
})

export const { setBasket } = basketSlice.actions;