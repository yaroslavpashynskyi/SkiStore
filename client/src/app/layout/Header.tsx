import { AppBar, Badge, Box, Button, IconButton, List, ListItem, Stack, Toolbar, Typography } from "@mui/material";
import CustomSwitch from "./CustomSwitch";

import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";

const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
]

const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
]

interface Props {
  darkMode: boolean,
  handleThemeChange: () => void
}

const navStyles = {
  textDecoration: "none",
  color: "inherit",
  typography: "h6",
  "&:hover": {
    color: "grey.500"
  },
  "&.active": {
    color: "text.secondary"
  }
}
export default function Header({ darkMode, handleThemeChange }: Props) {
  const { basket } = useAppSelector(state => state.basket);
  const { user } = useAppSelector(state => state.account);
  const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <AppBar position="static" >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box display={"flex"} alignItems={"center"}>
          <Typography variant="h6" component={NavLink}
            to={"/"}
            sx={navStyles}>
            SKI-STORE
          </Typography>
          <CustomSwitch darkMode={darkMode} handleThemeChange={handleThemeChange} />
        </Box>
        <Stack direction="row" spacing={4}>
          {midLinks.map(({ title, path }) => (
            <Button
              key={path}
              component={NavLink}
              to={path}
              sx={navStyles}
            >
              {title.toUpperCase()}
            </Button>
          ))}
        </Stack>
        <Box display={"flex"} alignItems={"center"}>
          <IconButton
            component={Link}
            to="basket"
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          {user ? <SignedInMenu />
            : <List sx={{ display: "flex" }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem key={path} disablePadding>
                  <Button
                    component={NavLink}
                    to={path}
                    sx={navStyles}
                  >
                    {title.toUpperCase()}
                  </Button>
                </ListItem>
              ))}
            </List>}
        </Box>
      </Toolbar >
    </AppBar >
  )
}