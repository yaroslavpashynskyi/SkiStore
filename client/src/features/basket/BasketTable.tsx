import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { currencyFormat } from "../../app/util/util";
import { removeBasketItemAsync, addBasketItemAsync } from "./basketSlice";
import { BasketItem } from "../../app/models/basket";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";

interface Props {
  items: BasketItem[];
  isBasket?: boolean;
}
export default function BasketTable({ items, isBasket = true }: Props) {
  const { status } = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            {isBasket && <TableCell align="right"></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box display="flex" alignItems="center">
                  <img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 30 }} />
                  {item.name}
                </Box>
              </TableCell>
              <TableCell align="right">{currencyFormat(item.price)}</TableCell>
              <TableCell align="center">
                {isBasket &&
                  <LoadingButton
                    color="error"
                    loading={status === "pendingRemoveItem" + item.productId}
                    onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId }))}
                  >
                    <Remove />
                  </LoadingButton>}
                {item.quantity}
                {isBasket &&
                  <LoadingButton
                    color="secondary"
                    loading={status === "pendingAddItem" + item.productId}
                    onClick={() => dispatch(addBasketItemAsync({ productId: item.productId }))}
                  >
                    <Add />
                  </LoadingButton>}
              </TableCell>
              <TableCell align="right">${((item.price / 100) * item.quantity).toFixed(2)}</TableCell>
              {isBasket &&
                <TableCell align="right">
                  <LoadingButton
                    color="error"
                    loading={status === "pendingDeleteItem" + item.productId}
                    onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId, quantity: item.quantity }))}
                  >
                    <Delete />
                  </LoadingButton>
                </TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}