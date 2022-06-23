import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import { useQuery } from "@apollo/client"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"
import { GET_DETAILS } from "../../../apollo/queries"

import ProductFrameGrid from "../ProductFrameGrid"
import ProductFrameList from "../ProductFrameList"

const useStyles = makeStyles(theme => ({
  productContainer: {
    width: "95%",
    [theme.breakpoints.only("xl")]: {
      // & > * means every child. 25rem because ProductFrameGrid is 25rem width
      // 25rem * 4 means 4 ProductFrameGrid per row
      // 100% means 100% of the width of 95% (fill up all space available)
      // 100% - (25rem * 4) means the space leftover minus the ProductFrameGrid
      //  then finally divide by 3 to get equal spacing between the ProductFrameGrids
      "& > *": {
        marginRight: ({ layout }) =>
          layout === "grid" ? "calc((100% - (25rem * 4)) / 3)" : 0,
        marginBottom: "5rem",
      },
      // & > :nth-child(4n) means every 4th ProductFrameGrid
      // do not apply marginRight for the 4th ProductFrameGrid (the last one)
      "& > :nth-child(4n)": {
        marginRight: 0,
      },
    },
    [theme.breakpoints.only("lg")]: {
      "& > *": {
        marginRight: ({ layout }) =>
          layout === "grid" ? "calc((100% - (25rem * 3)) / 2)" : 0,
        marginBottom: "5rem",
      },
      "& > :nth-child(3n)": {
        marginRight: 0,
      },
    },
    [theme.breakpoints.only("md")]: {
      "& > *": {
        marginRight: ({ layout }) =>
          layout === "grid" ? "calc(100% - (25rem * 2))" : 0,
        marginBottom: "5rem",
      },
      "& > :nth-child(2n)": {
        marginRight: 0,
      },
    },
    [theme.breakpoints.down("sm")]: {
      "& > *": {
        marginBottom: "4.5rem",
      },
    },
  },
}))

function ListOfProducts({
  products,
  content,
  layout,
  page,
  productsPerPage,
  filterOptions,
}) {
  const classes = useStyles({ layout })
  const matchesSM = useMediaQuery(theme => theme.breakpoints.down("sm"))

  // so this is a Component that accepts a Component and returns a Component lol...
  const FrameHelper = ({ Frame, product, variant }) => {
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [rating, setRating] = useState(0)
    const [stock, setStock] = useState(null)

    const { loading, error, data } = useQuery(GET_DETAILS, {
      variables: { id: product.node.strapiId },
    })

    useEffect(() => {
      if (error) {
        setStock(-1)
      } else if (data) {
        setStock(data.product.product_variants)
        setRating(data.product.averageRating)
      }
    }, [error, data])

    useEffect(() => {
      if (selectedSize === null) return undefined
      setSelectedColor(null)

      const newVariant = product.node.product_variants.find(
        item =>
          item.size === selectedSize &&
          item.style === variant.style &&
          item.color === colors[0]
      )
      setSelectedVariant(newVariant)
    }, [selectedSize])

    let sizes = []
    let colors = []
    product.node.product_variants.map(item => {
      sizes.push(item.size)
      if (
        !colors.includes(item.color) &&
        item.size === (selectedSize || variant.size) &&
        item.style === variant.style
      ) {
        colors.push(item.color)
      }
    })

    const hasStyles = product.node.product_variants.some(
      variant => variant.style !== null
    )
    // console.log(sizes)

    return (
      <Frame
        variant={selectedVariant || variant}
        product={product}
        sizes={sizes}
        colors={colors}
        selectedSize={selectedSize || variant.size}
        selectedColor={selectedColor}
        setSelectedSize={setSelectedSize}
        setSelectedColor={setSelectedColor}
        hasStyles={hasStyles}
        stock={stock}
        rating={rating}
      />
    )
  }

  return (
    <Grid
      item
      container
      classes={{ root: classes.productContainer }}
      direction={matchesSM ? "column" : "row"}
      alignItems={matchesSM ? "center" : undefined}
    >
      {content
        .slice((page - 1) * productsPerPage, page * productsPerPage)
        .map(item => (
          <FrameHelper
            Frame={layout === "grid" ? ProductFrameGrid : ProductFrameList}
            variant={item.variant}
            product={products[item.product]}
            key={item.variant.id}
          />
        ))}
    </Grid>
  )
}

export default ListOfProducts
