import { Box, Button, Grid, Typography } from "@mui/material";
import { BasketItem } from "../../app/models/basket";
import { Order } from "../../app/models/order";
import BasketTable from "../basket/BasketTable";
import BasketSummary from "../basket/BasketSummary";

interface Props {
  order: Order;
  handleBackToOrders: () => void;
}

export default function OrderDetails({ order, handleBackToOrders }: Props) {
  const subtotal = order.orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0) ?? 0;
  return (
    <>
      <Box
        mb={3}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}>
        <Typography variant="h4">
          Order #{order.id} - {order.orderStatus}
        </Typography>
        <Button
          sx={{ p: 2 }}
          onClick={handleBackToOrders}
          variant="contained"
          size="large"
        >Back to orders</Button>
      </Box>

      <BasketTable
        isBasket={false}
        items={order.orderItems as BasketItem[]}
      />
      <Grid container marginTop={2}>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary subtotal={subtotal} />
        </Grid>
      </Grid>
    </>
  )
}