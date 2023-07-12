import { AppBar, Toolbar, Typography } from "@mui/material";
import CustomSwitch from "./CustomSwitch";
interface Props {
  darkMode: boolean,
  handleThemeChange: () => void
}
export default function Header({ darkMode, handleThemeChange }: Props) {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" >
          Ski-Store
        </Typography>
        <CustomSwitch darkMode={darkMode} handleThemeChange={handleThemeChange} />
      </Toolbar>
    </AppBar>
  )
}