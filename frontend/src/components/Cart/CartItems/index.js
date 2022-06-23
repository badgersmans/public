import React, { useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import { CartContext } from "../../../contexts"
import CartItem from "../CartItem"

const useStyles = makeStyles(theme => ({}))

function CartItems() {
  const classes = useStyles()
  const { cart } = useContext(CartContext)
  // console.log(cart)
  return (
    <Grid item container lg={6} direction="column">
      {cart.map(item => (
        <CartItem item={item} key={item.variant.id} />
      ))}
    </Grid>
  )
}

export default CartItems
