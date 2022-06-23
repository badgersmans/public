import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Chip from "@material-ui/core/Chip"
import clsx from "clsx"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import axios from "axios"
import { UserContext, FeedbackContext } from "../../../../contexts"
import { setSnackbar } from "../../../../contexts/actions/feedback-actions"
import SettingsDataGrid from "../../SettingsDataGrid"
import formatMoney from "../../../../../utils/formatMoney"
import QuantityButton from "../../../ProductList/QuantityButton"
import dayjs from "dayjs"
import DeleteIcon from "../../../../images/Delete"
import pauseIcon from "../../../../images/pause.svg"
let advancedFormat = require("dayjs/plugin/advancedFormat")
let relativeTime = require("dayjs/plugin/relativeTime")
dayjs.extend(relativeTime, advancedFormat)
dayjs().format("Do")

const useStyles = makeStyles(theme => ({
  bold: {
    fontWeight: 600,
  },
  productImage: {
    height: "10rem",
    width: "10rem",
  },
  paymentMethod: {
    color: theme.palette.common.WHITE,
    textTransform: "uppercase",
    marginTop: "1rem",
  },
  lineHeight: {
    lineHeight: 1.1,
  },
  frequencyLabel: {
    textTransform: "capitalize",
  },
  deleteWrapper: {
    height: "3rem",
    width: "2.5rem",
  },
  pause: {
    height: "3rem",
    width: "3rem",
  },
  iconButton: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  // something: {},
}))

function Subscriptions({ setSelectedSetting }) {
  const classes = useStyles()
  const { user, dispatchUser } = useContext(UserContext)
  const { feedback, dispatchFeedback } = useContext(FeedbackContext)
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    axios
      .get(`${process.env.GATSBY_STRAPI_URL}/subscriptions/me`, {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      })
      .then(response => {
        setSubscriptions(response.data)
      })
      .catch(error => {
        console.error(error)
        dispatchFeedback(
          setSnackbar({
            status: "error",
            message:
              "There was a problem getting your subscriptions, please refresh the page.",
          })
        )
      })
  }, [])

  console.log(`subscriptions ->`, subscriptions)

  const createRows = data =>
    data.map(
      ({
        shippingInfo,
        shippingAddress,
        billingInfo,
        billingAddress,
        paymentMethod,
        productName,
        product_variant,
        quantity,
        frequency,
        next_delivery,
        id,
      }) => ({
        details: {
          shippingInfo,
          shippingAddress,
          billingInfo,
          billingAddress,
          paymentMethod,
        },
        item: { productName, product_variant },
        quantity: { quantity, productName, product_variant },
        frequency,
        next_delivery,
        total: product_variant.price * 1.14,
        id,
      })
    )

  const columns = [
    {
      field: "details",
      headerName: "Details",
      width: 350,
      sortable: false,
      renderCell: ({ value }) => (
        <Grid container direction="column">
          <Grid item>
            <Typography
              variant="body2"
              classes={{ root: clsx(classes.bold, classes.lineHeight) }}
            >
              {`${value.shippingInfo.name}`}
              <br />
              {`${value.shippingAddress.street}`}
              <br />
              {`${value.shippingAddress.city}, ${value.shippingAddress.state}, ${value.shippingAddress.postcode}`}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="h3" classes={{ root: classes.paymentMethod }}>
              {`${value.paymentMethod.brand} ${value.paymentMethod.last4}`}
            </Typography>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "item",
      headerName: "Item",
      width: 250,
      sortable: false,
      renderCell: ({ value }) => (
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <img
              src={`${process.env.GATSBY_STRAPI_URL}${value.product_variant.images[0].url}`}
              alt={value.productName}
              className={classes.productImage}
            />
          </Grid>

          <Grid item>
            <Typography variant="body2" classes={{ root: classes.bold }}>
              {value.productName}
            </Typography>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 250,
      sortable: false,
      renderCell: ({ value }) => (
        <QuantityButton
          stock={[{ quantity: value.product_variant.quantity }]}
          variants={value.product_variant}
          selectedVariant={0}
          name={value.productName}
          hideCartButton
          round
        />
      ),
    },

    {
      field: "frequency",
      headerName: "Frequency",
      width: 250,
      sortable: false,
      renderCell: ({ value }) => (
        <Chip
          label={value.split("_").join(" ")}
          classes={{ label: clsx(classes.frequencyLabel, classes.bold) }}
        />
      ),
    },
    {
      field: "next_delivery",
      headerName: "Next Order",
      width: 250,
      renderCell: ({ value }) => dayjs(value).format("Do MMM YYYY"),
    },
    {
      field: "total",
      headerName: "Total",
      width: 250,
      renderCell: ({ value }) => (
        <Chip label={formatMoney(value)} classes={{ label: classes.bold }} />
      ),
    },
    {
      field: "",
      width: 250,
      sortable: false,
      disableColumnMenu: true,
      renderCell: () => (
        <Grid container>
          {/* <Grid item>
            <IconButton classes={{ root: classes.iconButton }}>
              <img
                src={pauseIcon}
                alt="pause subscription"
                className={classes.pause}
              />
            </IconButton>
          </Grid> */}

          <Grid item>
            <IconButton classes={{ root: classes.iconButton }}>
              <span className={classes.deleteWrapper}>
                <DeleteIcon />
              </span>
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ]

  const rows = createRows(subscriptions)
  //   console.log(`rows ->`, rows)
  return (
    <SettingsDataGrid
      rows={rows}
      columns={columns}
      setSelectedSetting={setSelectedSetting}
      rowsPerPage={2}
    />
  )
}

export default Subscriptions
