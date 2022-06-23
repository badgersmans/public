import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import { Link } from "gatsby"

import facebook from "../../../images/facebook.svg"
import twitter from "../../../images/twitter.svg"
import instagram from "../../../images/instagram.svg"

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.secondary.main,
    padding: "2rem",
  },
  linkColumn: {
    width: "20rem",
  },
  link: {
    color: theme.palette.common.WHITE,
    fontSize: "1.15rem",
  },
  linkContainer: {
    [theme.breakpoints.down("md")]: {
      marginBottom: "3rem",
    },
  },
  icon: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  "@global": {
    body: {
      margin: 0,
    },
    a: {
      textDecoration: "none",
    },
  },
}))

function Footer() {
  const classes = useStyles()
  const currentYear = new Date().getFullYear()

  const socialMedia = [
    {
      icon: facebook,
      alt: "facebook",
      link: "https://facebook.com",
    },
    {
      icon: twitter,
      alt: "twitter",
      link: "https://twitter.com",
    },
    {
      icon: instagram,
      alt: "instagram",
      link: "https://instagram.com",
    },
  ]

  const routes = {
    "Contact Us": [
      { label: "012 345 6789", href: "tel:012 345 6789" },
      { label: "Shawn Law Tien Shen" },
      { label: "SUKD1600666@segi4u.my", href: "mailto:SUKD1600666@segi4u.my" },
      { label: `Copyright © ${currentYear}` },
    ],
    "Customer Service": [
      { label: "Contact Us", link: "/contact" },
      { label: "My Account", link: "/account" },
    ],
    Information: [
      { label: "Privacy Policy", link: "/privacy-policy" },
      { label: "Terms and Conditions", link: "/terms-conditions" },
    ],
  }

  return (
    <footer className={classes.footer}>
      <Grid container justify="space-between">
        {/* Social media icons */}
        <Grid item>
          <Grid container direction="column" alignItems="center">
            {socialMedia.map(platform => (
              <Grid item key={platform.alt}>
                <IconButton
                  component="a"
                  href={platform.link}
                  classes={{ root: classes.icon }}
                  disableRipple
                >
                  <img src={platform.icon} alt={platform.alt} />
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Links */}
        <Grid item classes={{ root: classes.linkContainer }}>
          <Grid container>
            {Object.keys(routes).map(category => (
              <Grid
                item
                key={category}
                container
                direction="column"
                classes={{ root: classes.linkColumn }}
              >
                <Grid item>
                  <Typography variant="h5">{category}</Typography>
                </Grid>
                {routes[category].map(route => (
                  <Grid item key={route.label}>
                    <Typography
                      component={route.link ? Link : "a"}
                      to={route.link ? route.link : undefined}
                      href={route.href ? route.href : undefined}
                      variant="body1"
                      classes={{ body1: classes.link }}
                    >
                      {route.label}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </footer>
  )
}

export default Footer
