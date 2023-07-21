import { Backdrop, CircularProgress, Stack, Typography } from "@mui/material";
interface Props {
  message?: string,
}
export default function LoadingComponent({ message = "Loading..." }: Props) {
  return (
    <Backdrop open={true} invisible>
      <Stack direction="column" alignItems="center" justifyContent="center" spacing={4}>
        <CircularProgress color="secondary" size={100} />
        <Typography variant="h4">{message}</Typography>
      </Stack>
    </Backdrop>
  )
}