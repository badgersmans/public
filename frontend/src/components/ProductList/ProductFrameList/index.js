import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"
import { makeStyles } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { Link } from "gatsby"

import frame from "../../../images/product-frame-list.svg"
import Rating from "../../Home/Rating"
import formatMoney from "../../../../utils/formatMoney"
import Sizes from "../Sizes"
import Swatches from "../Swatches"
import QuantityButton from "../QuantityButton"
import { colorIndex } from "../ProductFrameGrid"
import { getStockDisplay } from "../../ProductDetail/ProductInfo"

const useStyles = makeStyles(theme => ({
  frame: {
    // backgroundImage: `url(${square})`,
    // backgroundPosition: "center",
    // backgroundSize: "cover",
    // backgroundRepeat: "no-repeat",
    height: "28rem",
    // width: "25rem",
    backgroundColor: theme.palette.common.TIBETAN_JASMINE,
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
  },
  info: {
    backgroundColor: theme.palette.primary.main,
    // same size as the frame
    height: "100%",
    width: "100%",
    padding: "1rem",
    [theme.breakpoints.down("md")]: {
      height: "50%",
    },
    [theme.breakpoints.down("sm")]: {
      height: "28rem",
    },
  },
  productImage: {
    height: "15rem",
    width: "15rem",
  },
  stock: {
    color: theme.palette.common.WHITE,
  },
  sizesAndSwatches: {
    maxWidth: "15rem",
  },
  chipLabel: {
    fontSize: "2rem",
    "&:hover": {
      cursor: "pointer",
    },
  },
  chipContainer: {
    margin: "0.8rem 0",
  },
}))

function ProductFrameList({
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
  rating,
}) {
  const classes = useStyles()
  const imageIndex = colorIndex(product, variant, selectedColor)
  const images =
    imageIndex !== -1
      ? product.node.product_variants[imageIndex].images
      : variant.images
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

  const selectedVariant =
    imageIndex === -1
      ? product.node.product_variants.indexOf(variant)
      : imageIndex

  const stockDisplay = getStockDisplay(stock, selectedVariant)

  const ImagesDisplay = ({ slicePosition }) => {
    return (
      // slice determines how many images are displayed.
      images.slice(0, slicePosition).map(image => (
        <>
          <Grid
            item
            key={image.url}
            component={Link}
            to={`/${product.node.category.name.toLowerCase()}/${
              product.node.name.split(" ")[0]
            }${hasStyles ? `?style=${variant.style}` : ""}`}
          >
            <img
              src={process.env.GATSBY_STRAPI_URL + image.url}
              alt={image.url}
              className={classes.productImage}
            />
          </Grid>
        </>
      ))
    )
  }

  return (
    <Grid item container>
      <Grid
        item
        lg={9}
        container
        alignItems="center"
        justify="space-around"
        classes={{ root: classes.frame }}
      >
        {matchesMD ? (
          <ImagesDisplay slicePosition={1} />
        ) : (
          <ImagesDisplay slicePosition={5} />
        )}
      </Grid>

      <Grid
        item
        lg={3}
        container
        direction="column"
        justify="space-between"
        classes={{ root: classes.info }}
      >
        <Grid
          item
          container
          direction="column"
          component={Link}
          to={`/${product.node.category.name.toLowerCase()}/${
            product.node.name.split(" ")[0]
          }${hasStyles ? `?style=${variant.style}` : ""}`}
        >
          <Grid item>
            <Typography variant="h4">
              {product.node.name.split(" ")[0]}
            </Typography>
          </Grid>

          <Grid item>
            <Rating number={rating} />
          </Grid>

          <Grid item classes={{ root: classes.chipContainer }}>
            <Chip
              label={formatMoney(variant.price)}
              classes={{ label: classes.chipLabel }}
            />
          </Grid>

          <Grid item>
            <Typography variant="h3" classes={{ root: classes.stock }}>
              {stockDisplay}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="column"
          classes={{ root: classes.sizesAndSwatches }}
        >
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
        <QuantityButton
          stock={stock}
          selectedVariant={selectedVariant}
          name={product.node.name.split(" ")[0]}
          variants={product.node.product_variants}
        />
      </Grid>
    </Grid>
  )
}

export default ProductFrameList
