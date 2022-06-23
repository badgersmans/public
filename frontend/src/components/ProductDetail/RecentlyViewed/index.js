import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"

import ProductFrameGrid from "../../ProductList/ProductFrameGrid"

const useStyles = makeStyles(theme => ({
  recentContainer: {
    margin: "10rem 0",
    "& > :not(:last-child)": {
      marginRight: "2.5rem",
    },
  },
  arrow: {
    minWidth: 0,
    height: "4rem",
    width: "4rem",
    fontSize: "4rem",
    color: theme.palette.primary.main,
    borderRadius: 50,
    [theme.breakpoints.down("xs")]: {
      height: "0.25rem",
      width: "0.25rem",
      fontSize: "3rem",
    },
  },
}))

function RecentlyViewed({ products }) {
  const classes = useStyles()
  const [firstIndex, setFirstIndex] = useState(0)
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
  const matchesSM = useMediaQuery(theme => theme.breakpoints.down("sm"))

  const displayNum = matchesSM ? 1 : matchesMD ? 2 : 4

  const handleNavigation = direction => {
    if (firstIndex === 0 && direction === "backward") return null
    if (firstIndex + displayNum === products.length && direction === "forward")
      return null
    setFirstIndex(direction === "forward" ? firstIndex + 1 : firstIndex - 1)
  }

  //   console.log(products)
  return (
    <Grid
      item
      container
      justify="center"
      alignItems="center"
      classes={{ root: classes.recentContainer }}
    >
      <Grid item>
        <Button
          classes={{ root: classes.arrow }}
          onClick={() => handleNavigation("backward")}
        >
          {"<"}
        </Button>
      </Grid>

      {products
        ? products.slice(firstIndex, firstIndex + displayNum).map(product => {
            const hasStyles = product.node.product_variants.some(
              variant => variant.style !== null
            )
            return (
              <ProductFrameGrid
                key={product.node.product_variants[product.selectedVariant].id}
                product={product}
                variant={product.node.product_variants[product.selectedVariant]}
                hasStyles={hasStyles}
                disableQuickView
                small
              />
            )
          })
        : null}

      <Grid item>
        <Button
          classes={{ root: classes.arrow }}
          onClick={() => handleNavigation("forward")}
        >
          &gt;
        </Button>
      </Grid>
    </Grid>
  )
}

export default RecentlyViewed
