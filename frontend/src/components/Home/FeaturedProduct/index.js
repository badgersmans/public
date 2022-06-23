import React, { useState, useEffect } from "react"
import clsx from "clsx"
import { useQuery } from "@apollo/client"
import { GET_DETAILS } from "../../../apollo/queries"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import Chip from "@material-ui/core/Chip"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import formatMoney from "../../../../utils/formatMoney"
import { Link } from "gatsby"

import featuredAdornment from "../../../images/featured-adornment.svg"
import frame from "../../../images/product-frame-grid.svg"
import explore from "../../../images/explore.svg"

import Rating from "../Rating"

const useStyles = makeStyles(theme => ({
  featured: {
    height: "20rem",
    width: "20rem",
    [theme.breakpoints.down("md")]: {
      width: "15rem",
      height: "15rem",
    },
  },
  frame: {
    backgroundImage: `url(${frame})`,
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    borderRadius: 0,
    width: "25.5rem",
    height: "25rem",
    boxSizing: "border-box",
    boxShadow: theme.shadows[10],
    position: "absolute",
    zIndex: 1,
    [theme.breakpoints.down("md")]: {
      width: "19.8rem",
      height: "20rem",
    },
  },
  slide: {
    backgroundColor: theme.palette.primary.main,
    height: "20rem",
    width: "24.5rem",
    transition: "transform 0.5s ease",
    zIndex: 0,
    padding: "1rem 2rem",
    [theme.breakpoints.down("md")]: {
      width: "19.5rem",
      height: "15.2rem",
    },
  },
  slideLeft: {
    transform: "translate(-24.5rem, 0px)",
  },
  slideRight: {
    transform: "translate(24.5rem, 0px)",
  },
  slideDown: {
    transform: "translate(0px, 17rem)",
  },
  productContainer: {
    margin: "2rem 0",
  },
  exploreContainer: {
    marginTop: "auto",
  },
  exploreButton: {
    textTransform: "none",
  },
  exploreIcon: {
    height: "1.4rem",
    // width: "1.2rem",
    marginLeft: "1rem",
  },
  chipLabel: {
    ...theme.typography.h5,
  },
  chipRoot: {
    marginTop: "1rem",
    backgroundColor: theme.palette.secondary.main,
  },
  // something: {},
}))

function FeaturedProduct({ node, i, matchesMD, expanded, setExpanded }) {
  const classes = useStyles()
  const [rating, setRating] = useState(0)
  console.log(`node ->`, node)

  const alignment = matchesMD
    ? "center"
    : i === 0 || i === 3
    ? "flex-end"
    : i === 1 || i === 4
    ? "center"
    : "flex-start"

  const { data } = useQuery(GET_DETAILS, {
    variables: { id: node.product.id },
  })
  //   console.log(`data-> `, data)
  //   console.log(`node-> `, node)

  useEffect(() => {
    if (data) {
      setRating(data.product.averageRating)
    }
  }, [data])

  return (
    <Grid
      item
      container
      justify={alignment}
      key={node.strapiId}
      classes={{ root: classes.productContainer }}
      alignItems="center"
    >
      <IconButton
        classes={{ root: classes.frame }}
        onClick={() => (expanded === i ? setExpanded(null) : setExpanded(i))}
      >
        <img
          src={process.env.GATSBY_STRAPI_URL + node.images[0].url}
          alt={node.product.name}
          className={classes.featured}
        />
      </IconButton>
      <Grid
        container
        direction="column"
        classes={{
          root: clsx(classes.slide, {
            [classes.slideLeft]:
              !matchesMD && expanded === i && alignment === "flex-end",
            [classes.slideRight]:
              !matchesMD &&
              expanded === i &&
              (alignment === "flex-start" || alignment === "center"),
            [classes.slideDown]: matchesMD && expanded === i,
          }),
        }}
      >
        <Grid item>
          <Typography variant="h4">
            {node.product.name.split(" ")[0]}
          </Typography>
          <Rating number={rating} />
        </Grid>
        <Grid item>
          <Chip
            label={formatMoney(node.price)}
            classes={{ root: classes.chipRoot, label: classes.chipLabel }}
          />
        </Grid>
        <Grid item classes={{ root: classes.exploreContainer }}>
          <Button
            classes={{ root: classes.exploreButton }}
            // component={Link}
            // to={`/${node.category.name.toLowerCase()}`}
          >
            <Typography variant="h5">Details</Typography>
            <img
              src={explore}
              alt="go to product details"
              className={classes.exploreIcon}
            />
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default FeaturedProduct
