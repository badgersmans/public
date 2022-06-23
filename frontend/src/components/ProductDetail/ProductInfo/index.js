import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import Rating from "../../Home/Rating"
import formatMoney from "../../../../utils/formatMoney"
import { UserContext, FeedbackContext } from "../../../contexts"
import { setSnackbar } from "../../../contexts/actions/feedback-actions"
import Sizes from "../../ProductList/Sizes"
import Swatches from "../../ProductList/Swatches"
import QuantityButton from "../../ProductList/QuantityButton"
import { colorIndex } from "../../ProductList/ProductFrameGrid"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Favorite from "../../ui/Favorite"
import Subscription from "../../ui/Subscription"

const useStyles = makeStyles(theme => ({
  background: {
    backgroundColor: theme.palette.secondary.main,
    height: "45rem",
    width: "35rem",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      height: "58rem",
    },
  },
  center: {
    backgroundColor: theme.palette.primary.main,
    height: "35rem",
    width: "45rem",
    position: "absolute",
    [theme.breakpoints.down("lg")]: {
      width: "40rem",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      height: "48rem",
    },
  },
  infoContainer: {
    marginBottom: "2rem",
  },
  icon: {
    height: "2.8rem",
    width: "2.8rem",
  },
  iconWrapper: {
    margin: "1.1rem 0.8rem",
  },
  sectionContainer: {
    height: "calc(100% / 3)",
  },
  descriptionContainer: {
    backgroundColor: theme.palette.secondary.main,
    overflowY: "auto",
    padding: "0.5rem 1rem",
    // overflowX: "auto",
  },
  name: {
    color: theme.palette.common.WHITE,
  },
  reviewButton: {
    textTransform: "none",
    marginLeft: "-8px",
  },
  detailsContainer: {
    padding: "0.5rem 1rem",
  },
  chipContainer: {
    marginTop: "1rem",
    [theme.breakpoints.down("xs")]: {
      marginTop: 0,
      marginBottom: "1rem",
    },
  },
  chipRoot: {
    height: "3rem",
    width: "auto",
    borderRadius: 50,
  },
  chipLabel: {
    fontSize: "2rem",
  },
  stock: {
    color: theme.palette.common.WHITE,
  },
  sizesAndSwatches: {
    maxWidth: "13rem",
  },
  actionsContainer: {
    padding: "0 1rem",
  },
  // iconButton: {},
  // iconButton: {},
  // iconButton: {},
  // iconButton: {},
  // iconButton: {},
  // iconButton: {},
}))

export const getStockDisplay = (stock, variant) => {
  switch (stock) {
    case undefined:
    case null:
      return "Loading inventory..."
    case -1:
      return "Error loading inventory..."
    default:
      if (stock[variant].quantity === 0) {
        return `Out of stock.`
      } else {
        return `${stock[variant].quantity} currently in stock.`
      }
  }
}

function ProductInfo({
  name,
  description,
  productVariants,
  selectedVariant,
  setSelectedVariant,
  stock,
  setEditComment,
  rating,
  product,
}) {
  console.log(`productVariants ->`, productVariants)
  const classes = useStyles()
  const [selectedSize, setSelectedSize] = useState(
    productVariants[selectedVariant].size
  )
  const [selectedColor, setSelectedColor] = useState(null)
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const imageIndex = colorIndex(
    { node: { product_variants: productVariants } },
    productVariants[selectedVariant],
    selectedColor
  )
  const { user, dispatchUser } = useContext(UserContext)
  const { dispatchFeedback } = useContext(FeedbackContext)

  useEffect(() => {
    setSelectedColor(null)

    const newVariant = productVariants.find(
      variant =>
        variant.size === selectedSize &&
        variant.style === productVariants[selectedVariant].style &&
        variant.color === colors[0]
    )
    setSelectedVariant(productVariants.indexOf(newVariant))
  }, [selectedSize])

  useEffect(() => {
    if (imageIndex !== -1) {
      setSelectedVariant(imageIndex)
    }
  }, [imageIndex])

  const stockDisplay = getStockDisplay(stock, selectedVariant)
  console.log(stock)

  const sizes = []
  const colors = []

  productVariants.map(variant => {
    sizes.push(variant.size)

    // no duplicate colors and only colors for the selected size
    // also colors for the selected variant style (applicable to shirts)
    if (
      !colors.includes(variant.color) &&
      variant.size === selectedSize &&
      variant.style === productVariants[selectedVariant].style
    ) {
      colors.push(variant.color)
    }
  })
  // console.log(selectedVariant)

  const handleEditComment = () => {
    if (user.username === "Guest") {
      dispatchFeedback(
        setSnackbar({
          status: "error",
          message: "You must be logged in to leave a review",
        })
      )
      return
    }

    setEditComment(true)
    const reviewRef = document.getElementById("reviews")
    reviewRef.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Grid
      item
      container
      direction="column"
      lg={6}
      justify="center"
      //   alignItems="flex-end"
      classes={{ root: classes.infoContainer }}
    >
      <Grid
        item
        container
        justify="center"
        // direction="row"
        classes={{ root: classes.background }}
      >
        <Grid item classes={{ root: classes.iconWrapper }}>
          <Favorite variant={productVariants[selectedVariant].id} noPadding />
        </Grid>

        <Grid item classes={{ root: classes.iconWrapper }}>
          <Subscription
            stock={stock}
            variant={productVariants[selectedVariant]}
            name={name.split(" ")[0]}
            selectedVariant={selectedVariant}
            noPadding
          />
        </Grid>
      </Grid>

      <Grid
        item
        container
        direction="column"
        classes={{ root: classes.center }}
      >
        <Grid
          item
          container
          justify="space-between"
          direction={matchesXS ? "column" : "row"}
          classes={{
            root: clsx(classes.sectionContainer, classes.detailsContainer),
          }}
        >
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <Typography variant="h1" classes={{ root: classes.name }}>
                  {name.split(" ")[0]}
                </Typography>
              </Grid>

              <Grid item>
                <Rating number={rating} />
              </Grid>

              <Grid item>
                <Button onClick={handleEditComment}>
                  <Typography
                    variant="body2"
                    classes={{ root: classes.reviewButton }}
                  >
                    Leave A Review &gt;
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* this is displayed as a row */}
          <Grid item classes={{ root: classes.chipContainer }}>
            <Chip
              label={formatMoney(productVariants[selectedVariant].price)}
              classes={{ root: classes.chipRoot, label: classes.chipLabel }}
            />
          </Grid>
        </Grid>

        <Grid
          item
          container
          classes={{
            root: clsx(classes.sectionContainer, classes.descriptionContainer),
          }}
        >
          <Grid item>
            <Typography variant="h5">Description</Typography>
            <Typography variant="body2">{description}</Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction={matchesXS ? "column" : "row"}
          classes={{
            root: clsx(classes.sectionContainer, classes.actionsContainer),
          }}
          justify={matchesXS ? "space-around" : "space-between"}
          alignItems={matchesXS ? "flex-start" : "center"}
        >
          <Grid item>
            <Grid container direction="column">
              <Grid item classes={{ root: classes.sizesAndSwatches }}>
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
              </Grid>

              <Grid item>
                <Typography variant="h3" classes={{ root: classes.stock }}>
                  {stockDisplay}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <QuantityButton
              stock={stock}
              selectedVariant={selectedVariant}
              name={name}
              productVariants={productVariants}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProductInfo
