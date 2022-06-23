import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import { Link } from "gatsby"

import cta from "../../../images/cta.svg"

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: "13rem",
  },
  account: {
    color: theme.palette.common.WHITE,
    marginRight: "2rem",
  },
  body: {
    maxWidth: "45rem",
    marginBottom: "2rem",
    [theme.breakpoints.down("md")]: {
      padding: "0 1rem",
    },
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
  ctaImage: {
    width: "20rem",
    height: "20rem",
    [theme.breakpoints.down("md")]: {
      marginTop: "3.5rem",
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: "3.5rem",
      width: "15rem",
      height: "15rem",
    },
  },
  headingContainer: {
    [theme.breakpoints.down("md")]: {
      padding: "0 1rem",
    },
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
}))

function CallToAction() {
  const classes = useStyles()
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

  return (
    <Grid
      container
      justify="space-around"
      alignItems="center"
      classes={{ root: classes.container }}
      direction={matchesMD ? "column" : "row"}
    >
      <Grid item>
        <Grid container direction="column">
          <Grid item classes={{ root: classes.headingContainer }}>
            <Typography variant="h1" align={matchesMD ? "center" : undefined}>
              Commited To Quality
            </Typography>
          </Grid>
          <Grid item classes={{ root: classes.body }}>
            <Typography
              variant="body1"
              align={matchesMD ? "center" : undefined}
            >
              At Dev++, our mission is to provide developers with the highest
              quality clothing and clothing accessories that are comfortable,
              durable, and premium.
            </Typography>
          </Grid>

          <Grid item container justify={matchesMD ? "center" : undefined}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                classes={{ root: classes.account }}
                component={Link}
                to="/account"
              >
                Create Account
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/contact"
              >
                Contact Us
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <img src={cta} alt="commited to quality" className={classes.ctaImage} />
      </Grid>
    </Grid>
  )
}

export default CallToAction
