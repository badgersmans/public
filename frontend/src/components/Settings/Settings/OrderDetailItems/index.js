import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"
import { makeStyles } from "@material-ui/core/styles"
import formatMoney from "../../../../../utils/formatMoney"

const useStyles = makeStyles(theme => ({
  productImage: {
    height: "8rem",
    width: "8rem",
  },
  chipRoot: {
    backgroundColor: theme.palette.primary.main,
  },
  itemInfoWrapper: {
    textAlign: "right",
  },
  mainContainer: {
    height: "10rem",
  },
  subscriptionChip: {
    marginTop: "0.6rem",
  },
  // productImage: {},
  // productImage: {},
  // productImage: {},
  // productImage: {},
}))

function OrderDetailItems({ item }) {
  const classes = useStyles()
  return (
    <Grid
      item
      container
      justify="space-between"
      alignItems="center"
      classes={{ root: classes.mainContainer }}
    >
      <Grid item>
        <img
          src={`${process.env.GATSBY_STRAPI_URL}${item.variant.images[0].url}`}
          alt={item.name}
          className={classes.productImage}
        />
      </Grid>

      <Grid item classes={{ root: classes.itemInfoWrapper }}>
        <Typography variant="body2" classes={{ root: classes.id }}>
          {item.name} - x {item.quantity}
        </Typography>

        {item.variant.style ? (
          <Typography variant="body2">Style: {item.variant.style}</Typography>
        ) : null}

        {item.variant.size ? (
          <Typography variant="body2">Size: {item.variant.size}</Typography>
        ) : null}

        <Grid container direction="column">
          <Grid item>
            <Chip
              label={formatMoney(item.variant.price)}
              classes={{ root: classes.chipRoot }}
            />
          </Grid>

          {item.subscription ? (
            <Grid item classes={{ root: classes.subscriptionChip }}>
              <Chip
                label={`Every ${item.subscription}`}
                classes={{ root: classes.chipRoot }}
              />
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default OrderDetailItems
