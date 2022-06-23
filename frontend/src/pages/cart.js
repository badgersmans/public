import React, { useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import Layout from "../components/ui/Layout"
import CheckoutContainer from "../components/Cart/CheckoutContainer"
import CartItems from "../components/Cart/CartItems"
import { UserContext } from "../contexts"

const useStyles = makeStyles(theme => ({
  cartContainer: {
    minHeight: "80vh",
  },
  userCartContainer: {
    [theme.breakpoints.down("md")]: {
      marginTop: "2.5rem",
      marginBottom: "2rem",
    },
  },
  userCartText: {
    [theme.breakpoints.down("md")]: {
      fontSize: "3.5rem",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "3rem",
    },
  },
  // cartContainer: {},
  // cartContainer: {},
  // cartContainer: {},
}))

function Cart() {
  const classes = useStyles()
  const { user } = useContext(UserContext)
  return (
    <Layout>
      <Grid
        container
        direction="column"
        alignItems="center"
        classes={{ root: classes.cartContainer }}
      >
        <Grid item classes={{ root: classes.userCartContainer }}>
          <Typography
            variant="h1"
            align="center"
            classes={{ root: classes.userCartText }}
          >{`${user.username}'s Cart`}</Typography>
        </Grid>

        <Grid item container>
          <CheckoutContainer user={user} />
          <CartItems />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Cart
