import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";

interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null;
}

const productsAdapter = createEntityAdapter<Product>();

function getAxiosParams(productParams: ProductParams) {
    const params = new URLSearchParams();
    params.append("pageNumber", productParams.pageNumber.toString());
    params.append("pageSize", productParams.pageSize.toString());
    params.append("orderBy", productParams.orderBy.toString());
    if (productParams.searchTerm) params.append("searchTerm", productParams.searchTerm.toString());
    if (productParams.brands) params.append("brands", productParams.brands.toString());
    if (productParams.types) params.append("types", productParams.types.toString());

    return params;
}

export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
    "catalog/fetchProductsAsync",
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams)
        try {
            const response = await agent.Catalog.list(params);
            thunkAPI.dispatch(setMetaData(response.metaData))
            return response.items;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.response.data })
        }
    }
)
export const fetchProductAsync = createAsyncThunk<Product, number>(
    "catalog/fetchProductAsync",
    async (productId, thunkAPI) => {
        try {
            return await agent.Catalog.details(productId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.response.data })
        }
    }
)

export const fetchFiltersAsync = createAsyncThunk(
    "catalog/fetchFiltersAsync",
    async (_, thunkAPI) => {
        try {
            return await agent.Catalog.filters();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.response.data })
        }
    }
)

function initParams() {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: "name"
    }
}

export const catalogSlice = createSlice({
    name: "catalog",
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: "idle",
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false;
            state.productParams = { ...state.productParams, ...action.payload }
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload;
        },
        resetProductParams: (state) => {
            state.productsLoaded = false;
            state.productParams = initParams();
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = "pendingFetchProducts";
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = "idle";
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log(action.payload)
            state.status = "idle";
        });
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = "pendingFetchProduct";
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload)
            state.status = "idle";
        });
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action)
            state.status = "idle";
        });
        builder.addCase(fetchFiltersAsync.pending, (state) => {
            state.status = "pendingFetchFilters";
        });
        builder.addCase(fetchFiltersAsync.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;

            state.status = "idle";
            state.filtersLoaded = true;
        });
        builder.addCase(fetchFiltersAsync.rejected, (state, action) => {
            console.log(action.payload)
            state.status = "idle";
        });
    })
});

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);

export const { setProductParams, resetProductParams, setMetaData } = catalogSlice.actions;