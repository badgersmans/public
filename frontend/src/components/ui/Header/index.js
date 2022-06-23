import React, { useState, useContext } from "react"
import AppBar from "@material-ui/core/AppBar"
import ToolBar from "@material-ui/core/ToolBar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import Badge from "@material-ui/core/Badge"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import { makeStyles } from "@material-ui/core/styles"
import { Link } from "gatsby"
import { CartContext } from "../../../contexts"

import search from "../../../images/search.svg"
import account from "../../../images/account-header.svg"
import cartIcon from "../../../images/cart.svg"
import menu from "../../../images/menu.svg"

const useStyles = makeStyles(theme => ({
  // writing () is the same as writing {} return but only applies if it's a single expression.
  coloredIndicator: {
    backgroundColor: theme.palette.common.WHITE, // apparently, it's faster to use the hex code of a color than the name...
  },
  logoText: {
    color: theme.palette.common.OFF_BLACK,
    fontSize: "3.7rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "2.5rem",
    },
  },
  plusText: {
    fontSize: "3.5rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "2.5rem",
    },
  },
  logoContainer: {
    [theme.breakpoints.down("md")]: {
      marginRight: "auto",
    },
  },
  tab: {
    ...theme.typography.body1,
    fontWeight: 500,
  },
  tabs: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  icon: {
    height: "2rem",
    width: "2rem",
    [theme.breakpoints.down("xs")]: {
      height: "1.5rem",
      width: "1.5rem",
    },
  },
  drawer: {
    backgroundColor: theme.palette.primary.main,
  },
  listItemText: {
    color: theme.palette.common.WHITE,
  },
  badge: {
    fontSize: "1rem",
    color: theme.palette.common.WHITE,
    backgroundColor: theme.palette.secondary.main,
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.75rem",
      height: "0.8rem",
      width: "0.8rem",
      minWidth: 0,
    },
  },
}))

const Header = ({ categories }) => {
  const classes = useStyles()
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { cart } = useContext(CartContext)

  const routes = [
    ...categories,
    { node: { name: "Contact Us", strapiId: "contact", link: "/contact" } },
  ]

  const activeIndex = () => {
    const found = routes.indexOf(
      routes.filter(
        ({ node: { name, link } }) =>
          (link || `/${name.toLowerCase()}`) ===
          `/${window.location.pathname.split("/")[1]}`
      )[0]
    )

    // console.log(window.location.pathname.split("/"))

    return found === -1 ? false : found
  }

  const tabs = (
    <Tabs
      value={activeIndex()}
      classes={{ indicator: classes.coloredIndicator, root: classes.tabs }}
    >
      {routes.map(c => (
        <Tab
          label={c.node.name}
          key={c.node.strapiId}
          classes={{ root: classes.tab }}
          component={Link}
          to={c.node.link || `/${c.node.name.toLowerCase()}`}
        />
      ))}
    </Tabs>
  )

  const drawer = (
    <SwipeableDrawer
      open={drawerOpen}
      onOpen={() => setDrawerOpen(true)}
      onClose={() => setDrawerOpen(false)}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      classes={{ paper: classes.drawer }}
    >
      <List disablePadding>
        {[
          ...routes,
          { node: { name: "Account", strapiId: "account", link: "/account" } },
        ].map((c, i) => (
          <ListItem
            selected={activeIndex() === i}
            component={Link}
            to={c.node.link || `/${c.node.name.toLowerCase()}`}
            divider
            button
            key={c.node.strapiId}
          >
            <ListItemText
              primary={c.node.name}
              classes={{ primary: classes.listItemText }}
            />
          </ListItem>
        ))}
      </List>
    </SwipeableDrawer>
  )

  const actions = [
    {
      icon: search,
      alt: "search",
      visible: false,
      onClick: () => console.log("search clicked..."),
    },
    { icon: cartIcon, alt: "cart", visible: true, link: "/cart" },
    { icon: account, alt: "account", visible: !matchesMD, link: "/account" },
    {
      icon: menu,
      alt: "menu",
      visible: matchesMD,
      onClick: () => setDrawerOpen(true),
    },
  ]

  return (
    <AppBar color="transparent" elevation={false} position="fixed">
      <ToolBar disableGutters>
        <Button
          component={Link}
          to="/"
          classes={{ root: classes.logoContainer }}
        >
          <Typography variant="h1" classes={{ root: classes.plusText }}>
            <span className={classes.logoText}>Dev</span>++
          </Typography>
        </Button>
        {matchesMD ? drawer : tabs}

        {actions.map(action => {
          const image = (
            <img src={action.icon} alt={action.alt} className={classes.icon} />
          )
          if (action.visible) {
            return (
              <IconButton
                component={action.onClick ? undefined : Link}
                to={action.onClick ? undefined : action.link}
                key={action.alt}
                onClick={action.onClick}
              >
                {action.alt === "cart" ? (
                  <Badge
                    overlap="circle"
                    badgeContent={cart.length}
                    classes={{ badge: classes.badge }}
                  >
                    {image}
                  </Badge>
                ) : (
                  image
                )}
              </IconButton>
            )
          }
        })}
      </ToolBar>
    </AppBar>
  )
}

export default Header
