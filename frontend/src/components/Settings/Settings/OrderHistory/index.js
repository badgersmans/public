import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Chip from "@material-ui/core/Chip"
import { makeStyles } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import { UserContext } from "../../../../contexts"
import OrderDetails from "../OrderDetails"
import dayjs from "dayjs"
import formatMoney from "../../../../../utils/formatMoney"
import detailsIcon from "../../../../images/details.svg"
import SettingsDataGrid from "../../../Settings/SettingsDataGrid"

let advancedFormat = require("dayjs/plugin/advancedFormat")
dayjs.extend(advancedFormat)
dayjs().format("Do")

const useStyles = makeStyles(theme => ({
  dataGridContainer: {
    height: "100%",
    width: "100%",
    // marginBottom: "5rem",
  },
  chipLabel: {
    fontWeight: 600,
  },
  // dataGridContainer: {},
  // dataGridContainer: {},
  // dataGridContainer: {},
}))

function OrderHistory({ setSelectedSetting }) {
  const classes = useStyles()
  const [orders, setOrders] = useState([])
  const [open, setOpen] = useState(null)
  const { user } = useContext(UserContext)

  useEffect(() => {
    axios
      .get(`${process.env.GATSBY_STRAPI_URL}/orders/history`, {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      })
      .then(response => {
        console.log(response)

        setOrders(response.data.orders)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  const createDataRows = data =>
    data.map(item => ({
      shipping: `${item.shippingInfo.name}\n${item.shippingAddress.street}\n${item.shippingAddress.city}, ${item.shippingAddress.state}, ${item.shippingAddress.postcode}`,
      order: `#${item.id
        .slice(item.id.length - 10, item.id.length)
        .toUpperCase()}`,
      status: item.status,
      date: dayjs(item.createdAt).format("Do MMM YYYY h:mma"),
      total: item.total,
      id: item.id,
    }))

  const columns = [
    { field: "shipping", headerName: "Shipping", width: 350, sortable: false },
    { field: "order", headerName: "Order", width: 350 },
    {
      field: "status",
      headerName: "Status",
      width: 350,
      renderCell: ({ value }) => (
        <Chip label={value} classes={{ label: classes.chipLabel }} />
      ),
    },
    { field: "date", headerName: "Date", width: 250, type: "date" },
    {
      field: "total",
      headerName: "Total",
      width: 250,
      renderCell: ({ value }) => (
        <Chip
          label={formatMoney(value)}
          classes={{ label: classes.chipLabel }}
        />
      ),
    },
    {
      field: "",
      width: 350,
      sortable: false,
      disableColumnMenu: true,
      renderCell: () => (
        <IconButton>
          <img src={detailsIcon} alt="order details" />
        </IconButton>
      ),
    },
  ]

  const rows = createDataRows(orders)

  return (
    <Grid item container classes={{ root: classes.dataGridContainer }}>
      <SettingsDataGrid
        rows={rows}
        columns={columns}
        setOpen={setOpen}
        setSelectedSetting={setSelectedSetting}
      />
      <OrderDetails open={open} setOpen={setOpen} orders={orders} />
    </Grid>
  )
}

export default OrderHistory
