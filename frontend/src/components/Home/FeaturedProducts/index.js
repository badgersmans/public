import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import { useStaticQuery, graphql } from "gatsby"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"
import FeaturedProduct from "../FeaturedProduct"

const useStyles = makeStyles(theme => ({
  background: {
    // backgroundImage: `url(${featuredAdornment})`,
    // backgroundPosition: "top",
    // backgroundRepeat: "no-repeat",
    // backgroundSize: "cover",
    width: "100%",
    height: "150rem",
    padding: "0 2.5rem",
    marginBottom: "18rem",
    [theme.breakpoints.down("md")]: {
      height: "220rem",
    },
  },
}))

function FeaturedProducts() {
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
  const [expanded, setExpanded] = useState(null)

  const classes = useStyles()
  const data = useStaticQuery(graphql`
    query getFeaturedProducts {
      allStrapiProductVariant(filter: { featured: { eq: true } }) {
        edges {
          node {
            images {
              url
            }
            product {
              averageRating
              name
              id
              category
            }
            strapiId
            price
            style
          }
        }
      }
    }
  `)

  return (
    <Grid
      container
      direction="column"
      justify={matchesMD ? "space-between" : "center"}
      classes={{ root: classes.background }}
    >
      {data.allStrapiProductVariant.edges.map(({ node }, i) => (
        <FeaturedProduct
          node={node}
          i={i}
          matchesMD={matchesMD}
          key={node.strapiId}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      ))}
    </Grid>
  )
}

export default FeaturedProducts
