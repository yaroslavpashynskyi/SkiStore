import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const { data, title } = useAppSelector((state) => state.counter)
  return (
    <>
      <Typography variant="h2">
        {title}
      </Typography>
      <Typography variant="h5">
        The data is {data}
      </Typography>
      <ButtonGroup>
        <Button onClick={() => dispatch(decrement(1))} variant="contained" color="error">Decrement counter</Button>
        <Button onClick={() => dispatch(increment(1))} variant="contained" color="primary">Increment counter</Button>
        <Button onClick={() => dispatch(increment(5))} variant="contained" color="primary">Increment counter by 5</Button>
      </ButtonGroup>
    </>
  )
}