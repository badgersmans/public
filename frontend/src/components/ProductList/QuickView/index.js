import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Chip from "@material-ui/core/Chip"
import formatMoney from "../../../../utils/formatMoney"
import Sizes from "../Sizes"
import Swatches from "../Swatches"
import QuantityButton from "../QuantityButton"
import Magnifier from "react-magnifier"
import styles from "./styles.css"
import { Link } from "gatsby"
import { getStockDisplay } from "../../ProductDetail/ProductInfo"

import Rating from "../../Home/Rating"
import frame from "../../../images/selected-frame.svg"
import explore from "../../../images/explore.svg"

const useStyles = makeStyles(theme => ({
  selectedFrame: {
    // backgroundImage: `url(${frame})`,
    // backgroundPosition: "center",
    // backgroundRepeat: "no-repeat",
    // backgroundSize: "cover",
    height: "60rem",
    width: "72rem",
    padding: "0 !important",
  },
  dialog: {
    maxWidth: "100%",
  },
  productImage: {
    height: "33.5rem",
    width: "33.5rem",
    marginTop: "5rem",
  },
  toolbar: {
    backgroundColor: theme.palette.primary.main,
    height: "13rem",
    marginTop: "5.7rem",
    padding: "0.5rem 1rem",
    position: "relative",
  },
  stock: {
    color: theme.palette.common.WHITE,
  },
  details: {
    color: theme.palette.common.WHITE,
    textTransform: "none",
    fontSize: "1.5rem",
  },
  exploreIcon: {
    height: "1.5rem",
    width: "2rem",
    marginLeft: "0.5rem",
  },
  detailButton: {
    padding: 0,
  },
  infoContainer: {
    height: "100%",
  },
  chipRoot: {
    transform: "scale(1.5)",
  },
  chipContainer: {
    display: "flex",
    alignItems: "center",
  },
  quantityContainer: {
    marginTop: "2.25rem",
  },
  infoItems: {
    position: "absolute",
    left: "1rem",
    height: "calc(100% - 1rem)",
  },
  actionItems: {
    position: "absolute",
    right: "1rem",
  },
}))

function QuickView({
  open,
  setOpen,
  url,
  name,
  price,
  product,
  variant,
  sizes,
  colors,
  selectedSize,
  selectedColor,
  setSelectedSize,
  setSelectedColor,
  hasStyles,
  stock,
  imageIndex,
  rating,
}) {
  const classes = useStyles()

  const selectedVariant =
    imageIndex === -1
      ? product.node.product_variants.indexOf(variant)
      : imageIndex

  const stockDisplay = getStockDisplay(stock, selectedVariant)

  // console.log(hasStyles)
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      classes={{ paper: classes.dialog }}
    >
      <DialogContent classes={{ root: classes.selectedFrame }}>
        <Grid container direction="column" alignItems="center">
          <Grid
            item
            component={Link}
            to={`/${product.node.category.name.toLowerCase()}/${
              product.node.name.split(" ")[0]
            }${hasStyles ? `?style=${variant.style}` : ""} `}
          >
            {/* <img
              src={url}
              alt="product image"
              className={classes.productImage}
            /> */}
            <Magnifier
              src={url}
              alt="product image"
              width={500}
              mgWidth={300}
              mgHeight={300}
              zoomFactor={0.8}
              className={classes.productImage}
            />
          </Grid>
          {/* containers have 100% width */}
          <Grid
            item
            container
            classes={{ root: classes.toolbar }}
            justify="center"
          >
            <Grid item classes={{ root: classes.infoItems }}>
              <Grid
                container
                direction="column"
                justify="space-between"
                classes={{ root: classes.infoContainer }}
                component={Link}
                to={`/${product.node.category.name.toLowerCase()}/${
                  product.node.name.split(" ")[0]
                }${hasStyles ? `?style=${variant.style}` : ""}`}
              >
                <Grid item>
                  <Typography variant="h4">{name}</Typography>
                  <Rating number={rating} />
                </Grid>

                <Grid item>
                  <Typography variant="h3" classes={{ root: classes.stock }}>
                    {stockDisplay}
                  </Typography>
                  <Button classes={{ root: classes.detailButton }}>
                    <Typography
                      variant="h3"
                      classes={{ root: classes.details }}
                    >
                      Details
                    </Typography>
                    <img
                      src={explore}
                      alt="go to product details page"
                      className={classes.exploreIcon}
                    />
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* prices here... */}
            <Grid item classes={{ root: classes.chipContainer }}>
              <Chip
                label={formatMoney(price)}
                classes={{ root: classes.chipRoot }}
              />
            </Grid>

            {/* size, color, and add to cart here... */}
            <Grid item classes={{ root: classes.actionItems }}>
              {/* column so size, color, and add to cart are on top of each other */}
              <Grid container direction="column">
                <Sizes
                  sizes={sizes}
                  selectedSize={selectedSize}
                  setSelectedSize={setSelectedSize}
                />
                <Swatches
                  colors={colors}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                />
                <span className={classes.quantityContainer}>
                  <QuantityButton
                    stock={stock}
                    selectedVariant={selectedVariant}
                    name={name}
                    variants={product.node.product_variants}
                  />
                </span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default QuickView
