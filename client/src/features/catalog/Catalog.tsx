import LoadingComponent from "../../app/layout/LoadingComponent"
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore"
import ProductList from "./ProductList"
import { setProductParams } from "./catalogSlice"
import { Grid, Paper } from "@mui/material"
import ProductSearch from "./ProductSearch"
import RadioButtonGroup from "../../app/components/RadioButtonGroup"
import CheckboxButtons from "../../app/components/CheckboxButtons"
import AppPagination from "../../app/components/AppPagination"
import useProducts from "../../app/hooks/useProducts"

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to low" },
  { value: "price", label: "Price - Low to high" }
]

export default function Catalog() {
  const { products, brands, types, filtersLoaded, metaData } = useProducts();
  const dispatch = useAppDispatch();

  const { productParams } = useAppSelector(state => state.catalog)

  if (!filtersLoaded) return <LoadingComponent message="Loading products..." />

  return (
    <Grid container columnSpacing={4} >
      <Grid item xs={3} >
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            options={sortOptions}
            selectedValue={productParams.orderBy}
            onChange={e => dispatch(setProductParams({ orderBy: e.target.value }))}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={brands}
            checked={productParams.brands}
            onChange={(items) => dispatch(setProductParams({ brands: items }))}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={types}
            checked={productParams.types}
            onChange={(items) => dispatch(setProductParams({ types: items }))}
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>

      <Grid item xs={3} />
      <Grid item xs={9} mb={10} >
        {metaData && <AppPagination
          metaData={metaData}
          onPageChange={(page: number) => dispatch(setProductParams({ pageNumber: page }))}
        />}
      </Grid>
    </Grid >
  )
}