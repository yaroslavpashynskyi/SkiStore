import { Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";


interface Props {
  products: Product[]
}
export default function ProductList({ products }: Props) {
  return (
    <Grid container spacing={4}>
      {products.map(item => (
        <Grid key={item.id} item xs={4} >
          <ProductCard product={item} />
        </Grid>
      ))}
    </Grid>
  )
}