import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Lottie from "react-lottie"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"

import animationData from "../../../images/animation2.json"

const useStyles = makeStyles(theme => ({
  textContainer: {
    padding: "2rem",
    [theme.breakpoints.down("xs")]: {
      padding: "1rem",
    },
  },
  heading: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "3rem",
    },
  },
}))

function HeroBlock() {
  const classes = useStyles()
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
  const matchesLG = useMediaQuery(theme => theme.breakpoints.down("lg"))
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  }
  return (
    <Grid container justify="space-around" alignItems="center">
      <Grid item classes={{ root: classes.textContainer }}>
        <Grid container direction="column">
          <Grid item>
            <Typography
              variant="h1"
              align="center"
              classes={{ root: classes.heading }}
            >
              Don't Just
              <br />
              Be A Developer
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h3" align="center">
              but a developer with style 😎
            </Typography>
          </Grid>
        </Grid>

        <Grid item>
          <Lottie
            options={defaultOptions}
            width={
              matchesXS
                ? "20rem"
                : matchesMD
                ? "30rem"
                : matchesLG
                ? "40rem"
                : "50rem"
            }
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default HeroBlock
