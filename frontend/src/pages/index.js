import React, { useRef } from "react"
import { Link } from "gatsby"
import Fab from "@material-ui/core/Fab"
import Grid from "@material-ui/core/Grid"
import Layout from "../components/ui/layout"
import { makeStyles } from "@material-ui/styles"

import HeroBlock from "../components/Home/HeroBlock"
import PromotionalProducts from "../components/Home/PromotionalProducts"
import FeaturedProducts from "../components/Home/FeaturedProducts"
import MarketingButtons from "../components/Home/MarketingButtons"
import CallToAction from "../components/Home/CallToAction"

// import Image from "../components/image"
// import SEO from "../components/seo"

const useStyles = makeStyles(theme => ({
  fab: {
    marginRight: "3rem",
    marginBottom: "2rem",
    color: theme.palette.common.WHITE,
    fontFamily: "Montserrat",
    fontSize: "5rem",
    width: "4.5rem",
    height: "4.5rem",
  },
}))

const IndexPage = () => {
  const classes = useStyles()
  const scrollToTopRef = useRef(null)

  const scrollToTop = () => {
    scrollToTopRef.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Layout>
      <div ref={scrollToTopRef} />

      <HeroBlock />
      <PromotionalProducts />
      <FeaturedProducts />
      {/* <MarketingButtons /> */}
      <CallToAction />

      <Grid container justifyContent="flex-end">
        <Fab
          classes={{ root: classes.fab }}
          color="primary"
          onClick={scrollToTop}
        >
          ^
        </Fab>
      </Grid>
    </Layout>
  )
}

export default IndexPage
