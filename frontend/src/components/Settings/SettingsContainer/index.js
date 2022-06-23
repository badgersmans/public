import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import clsx from "clsx"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"
import { UserContext } from "../../../contexts"
import { setUser } from "../../../contexts/actions/user-actions"
import { useSpring, useSprings, animated } from "react-spring"
import useResizeAware from "react-resize-aware"
import Settings from "../Settings"
import OrderHistory from "../Settings/OrderHistory"
import Favorites from "../Favorites"
import Subscriptions from "../Settings/Subscriptions"

import accountIcon from "../../../images/account.svg"
import settingsIcon from "../../../images/settings.svg"
import orderHistoryIcon from "../../../images/order-history.svg"
import favIcon from "../../../images/favorite.svg"
import subscription from "../../../images/subscription.svg"

const useStyles = makeStyles(theme => ({
  name: {
    color: theme.palette.secondary.main,
  },
  dashboard: {
    // backgroundColor: "red",
    width: "100%",
    minHeight: "50rem",
    height: "auto",
    borderTop: ({ showComponent }) =>
      `${showComponent ? 0 : 0.4}rem solid ${theme.palette.secondary.main}`,
    borderBottom: ({ showComponent }) =>
      `${showComponent ? 0 : 0.4}rem solid ${theme.palette.secondary.main}`,
    margin: "5rem 0",
    [theme.breakpoints.down("md")]: {
      padding: ({ showComponent }) => (showComponent ? 0 : "5rem 0"),
      "& > :not(:last-child)": {
        marginBottom: ({ showComponent }) => (showComponent ? 0 : "5rem"),
        marginBottom: ({ showComponent }) => (showComponent ? 0 : "5rem"),
      },
    },
    [theme.breakpoints.down("xs")]: {
      padding: ({ showComponent }) => (showComponent ? 0 : "2rem 0"),
      "& > :not(:last-child)": {
        marginBottom: ({ showComponent }) => (showComponent ? 0 : "2rem"),
      },
    },
  },
  icon: {
    height: "8rem",
    width: "8rem",
    [theme.breakpoints.down("lg")]: {
      height: "6rem",
      width: "6rem",
    },
  },
  button: {
    // height: "16rem",
    // width: "16rem",
    // borderRadius: 25,
    display: "flex",
    textTransform: "none",
    backgroundColor: theme.palette.primary.main,
  },
  buttonText: {
    // fontSize: "2rem",
  },
  hoverEffect: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.secondary.main,
    },
  },
  logout: {
    color: theme.palette.error.main,
  },
  // icon: {},
}))

function SettingsContainer() {
  const { user, dispatchUser, defaultUser } = useContext(UserContext)
  const [selectedSetting, setSelectedSetting] = useState(null)
  const [resizeListener, sizes] = useResizeAware()
  const [showComponent, setShowComponent] = useState(false)
  const classes = useStyles({ showComponent })
  const matchesLG = useMediaQuery(theme => theme.breakpoints.down("lg"))
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const buttonWidth = matchesXS
    ? `${sizes.width - 64}px`
    : matchesMD
    ? `${sizes.width - 160}px`
    : matchesLG
    ? "288px"
    : "256px"
  const buttonHeight = matchesMD ? "18rem" : "16rem"

  const buttons = [
    { label: "Order History", icon: orderHistoryIcon, component: OrderHistory },
    { label: "Favorites", icon: favIcon, component: Favorites },
    { label: "Subscriptions", icon: subscription, component: Subscriptions },
    { label: "Settings", icon: settingsIcon, component: Settings, large: true },
  ]

  const handleClick = label => {
    // label of buttons in buttons state...
    if (selectedSetting === label) {
      setSelectedSetting(null)
    } else {
      setSelectedSetting(label)
    }
  }

  const AnimatedGrid = animated(Grid)

  const springs = useSprings(
    buttons.length,
    buttons.map(button => ({
      //   make selected button visible, hide the rest
      // if no buttons selected, then show all buttons
      from: {},
      to: async (next, cancel) => {
        const scale = {
          transform:
            selectedSetting === button.label || selectedSetting === null
              ? "scale(1)"
              : "scale(0)",
          delay: selectedSetting !== null ? 0 : 550,
        }
        const size = {
          height:
            selectedSetting === button.label
              ? matchesMD && button.large
                ? "120rem"
                : "50rem"
              : buttonHeight,
          width:
            selectedSetting === button.label ? `${sizes.width}px` : buttonWidth,
          borderRadius: selectedSetting === button.label ? 0 : 25,
          delay: selectedSetting !== null ? 550 : 0,
        }

        const hide = {
          display:
            selectedSetting === button.label || selectedSetting === null
              ? "flex"
              : "none",
          delay: 150,
        }
        // !== null means something is selected
        await next(selectedSetting !== null ? scale : size)
        await next(hide)
        await next(selectedSetting !== null ? size : scale)
      },
    }))
  )

  const styles = useSpring({
    opacity: selectedSetting === null || showComponent ? 1 : 0,
    delay: selectedSetting === null || showComponent ? 0 : 1250,
  })

  useEffect(() => {
    if (selectedSetting === null) {
      setShowComponent(false)
      return
    }
    const timer = setTimeout(() => setShowComponent(true), 2000)

    return () => clearTimeout(timer)
  }, [selectedSetting])

  const handleLogout = () => {
    dispatchUser(setUser(defaultUser))
  }

  return (
    <Grid container direction="column" alignItems="center">
      {resizeListener}
      <Grid item>
        <img src={accountIcon} alt="settings page" />
      </Grid>
      <Grid item>
        <Typography
          variant="h4"
          classes={{ root: classes.name }}
          align="center"
        >
          Welcome back, {user.username}
        </Typography>
      </Grid>
      <Grid item>
        <Button onClick={handleLogout}>
          <Typography variant="h5" classes={{ root: classes.logout }}>
            Logout
          </Typography>
        </Button>
      </Grid>
      <Grid
        item
        container
        classes={{ root: classes.dashboard }}
        alignItems="center"
        justify="space-around"
        direction={matchesMD ? "column" : "row"}
      >
        {springs.map((prop, i) => {
          const button = buttons[i]
          return (
            <AnimatedGrid
              item
              key={i}
              classes={{
                root: clsx(classes.button, {
                  [classes.hoverEffect]: !showComponent,
                }),
              }}
              onClick={() => (showComponent ? null : handleClick(button.label))}
              style={prop}
            >
              <AnimatedGrid
                container
                direction="column"
                style={styles}
                alignItems="center"
                justify="center"
              >
                {selectedSetting === button.label && showComponent ? (
                  <button.component setSelectedSetting={setSelectedSetting} />
                ) : (
                  <>
                    <Grid item>
                      <img
                        src={button.icon}
                        alt={button.label}
                        className={classes.icon}
                      />
                    </Grid>

                    <Grid item>
                      <Typography
                        variant="h5"
                        classes={{ root: classes.buttonText }}
                      >
                        {button.label}
                      </Typography>
                    </Grid>
                  </>
                )}
              </AnimatedGrid>
            </AnimatedGrid>
          )
        })}
      </Grid>
    </Grid>
  )
}

export default SettingsContainer
