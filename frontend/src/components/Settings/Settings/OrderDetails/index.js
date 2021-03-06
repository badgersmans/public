import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Button from "@material-ui/core/Button"
import Hidden from "@material-ui/core/Hidden"
import formatMoney from "../../../../../utils/formatMoney"
import OrderDetailItems from "../OrderDetailItems"
import DayJS from "react-dayjs"
import dayjs from "dayjs"
let advancedFormat = require("dayjs/plugin/advancedFormat")
dayjs.extend(advancedFormat)
dayjs().format("Do")

const useStyles = makeStyles(theme => ({
  drawer: {
    height: "100%",
    width: "30rem",
    backgroundColor: "transparent",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  id: {
    fontSize: "2.25rem",
    fontWeight: 600,
    marginLeft: "1rem",
  },
  bold: {
    fontWeight: 600,
  },
  date: {
    fontWeight: 600,
    marginLeft: "1rem",
    marginBottom: "1rem",
  },
  // heading: {
  //   marginTop: "1rem",
  // },
  padding: {
    padding: "1rem",
  },
  status: {
    marginLeft: "1rem",
  },
  dark: {
    backgroundColor: theme.palette.secondary.main,
  },
  light: {
    backgroundColor: theme.palette.primary.main,
  },
  prices: {
    padding: "0.5rem 1rem",
  },
  text: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.25rem",
    },
  },
  buttonSpacer: {
    minHeight: "10rem",
  },
  // drawer: {},
  // drawer: {},
  // drawer: {},
}))

function OrderDetails({ open, setOpen, orders }) {
  const classes = useStyles()
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const order = orders.find(order => order.id === open)
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const prices = [
    { label: "Subtotal", value: order?.subtotal },
    { label: "Shipping", value: order?.shippingOption.price },
    { label: "Tax", value: order?.tax },
    { label: "Total", value: order?.total },
    {
      label: "Payment",
      string: `${order?.paymentMethod.brand.toUpperCase()} ${
        order?.paymentMethod.last4
      }`,
    },
    { label: "Transaction ID", string: `${order?.transaction} ` },
  ]

  // console.log(`open? -> `, open)
  // console.log(`order? -> `, order)
  return (
    <SwipeableDrawer
      open={!!open}
      onOpen={() => null}
      onClose={() => setOpen(null)}
      classes={{ paper: classes.drawer }}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      anchor={matchesXS ? "bottom" : "left"}
    >
      <Hidden smUp>
        <Grid
          item
          component={Button}
          onClick={() => setOpen(null)}
          classes={{ root: classes.buttonSpacer }}
          disableRipple
        />
      </Hidden>
      <Grid container direction="column" classes={{ root: classes.light }}>
        <Grid item classes={{ root: classes.dark }}>
          <Typography
            variant="h2"
            classes={{ root: classes.id }}
            // align="center"
          >
            Order #
            {order?.id
              .slice(order.id.length - 10, order.id.length)
              .toUpperCase()}
          </Typography>
        </Grid>

        <Grid item container classes={{ root: classes.dark }}>
          <Grid item classes={{ root: classes.status }}>
            <Chip
              label={order?.status}
              classes={{ label: classes.bold, root: classes.light }}
            />
          </Grid>

          <Grid item>
            <Typography variant="body2" classes={{ root: classes.date }}>
              {<DayJS format="Do MMM YYYY h:mma">{order?.createdAt}</DayJS>}
            </Typography>
          </Grid>
        </Grid>

        <Grid item classes={{ root: classes.padding }}>
          <Typography variant="body2" classes={{ root: classes.bold }}>
            Billing
          </Typography>

          <Typography variant="body2" classes={{ root: classes.text }}>
            {order?.billingInfo.name}
            <br />
            {order?.billingInfo.email}
            <br />
            {order?.billingInfo.phone}
            <br />
            <br />
            {order?.billingAddress.street}
            <br />
            {order?.billingAddress.city}, {order?.billingAddress.state}{" "}
            {order?.billingAddress.postcode}
          </Typography>
        </Grid>

        <Grid item classes={{ root: clsx(classes.padding, classes.dark) }}>
          <Typography variant="body2" classes={{ root: classes.bold }}>
            Shipping
          </Typography>

          <Typography variant="body2" classes={{ root: classes.text }}>
            {order?.shippingInfo.name}
            <br />
            {order?.shippingInfo.email}
            <br />
            {order?.shippingInfo.phone}
            <br />
            <br />
            {order?.shippingAddress.street}
            <br />
            {order?.shippingAddress.city}, {order?.shippingAddress.state}{" "}
            {order?.shippingAddress.postcode}
          </Typography>
        </Grid>

        {prices.map(price => (
          <Grid
            item
            container
            justify="space-between"
            classes={{ root: classes.prices }}
            key={price.label}
          >
            <Grid item>
              <Typography variant="body2" classes={{ root: classes.bold }}>
                {price.label}
              </Typography>
            </Grid>

            <Grid item>
              {price.string ? (
                <Typography variant="body2" classes={{ root: classes.text }}>
                  {price.string}
                </Typography>
              ) : (
                <Chip
                  label={formatMoney(price.value)}
                  classes={{ label: classes.bold }}
                />
              )}
            </Grid>
          </Grid>
        ))}

        <Grid item classes={{ root: clsx(classes.padding, classes.dark) }}>
          <Typography
            variant="body2"
            classes={{ root: classes.bold }}
            gutterBottom
          >
            Items
          </Typography>

          {order?.items.map(item => (
            <OrderDetailItems key={item.variant.id} item={item} />
          ))}
        </Grid>
      </Grid>
    </SwipeableDrawer>
  )
}

export default OrderDetails
