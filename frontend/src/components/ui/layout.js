/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
// import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby" // static queries cannot have variables and is ran at build time, which means the webpages already have the data baked in
import { makeStyles } from "@material-ui/core/styles"

import Header from "./Header/index"
import Footer from "./Footer/index"
// import "./layout.css"

const useStyles = makeStyles(theme => ({
  spacer: {
    marginBottom: "5rem",
    [theme.breakpoints.down("md")]: {
      marginBottom: "2rem",
    },
  },
}))

const Layout = ({ children }) => {
  const classes = useStyles()

  const data = useStaticQuery(graphql`
    query getCategories {
      allStrapiCategory {
        edges {
          node {
            name
            strapiId
          }
        }
      }
    }
  `)

  return (
    <>
      <Header categories={data.allStrapiCategory.edges} />
      <div className={classes.spacer} />
      <main>{children}</main>
      <Footer />
    </>
  )
}

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
// }

export default Layout
