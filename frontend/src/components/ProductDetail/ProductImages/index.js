import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Magnifier from "react-magnifier"
import { makeStyles } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"

const useStyles = makeStyles(theme => ({
  selected: {
    height: "30rem",
    width: "30rem",
    [theme.breakpoints.down("sm")]: {
      height: "20rem",
      width: "20rem",
    },
    [theme.breakpoints.down("xs")]: {
      height: "10rem",
      width: "10rem",
    },
  },
  small: {
    height: "5rem",
    width: "5rem",
    [theme.breakpoints.down("xs")]: {
      height: "3rem",
      width: "3rem",
    },
  },
  imageItem: {
    margin: "0.5rem",
  },
}))

function ProductImages({ images, selectedImage, setSelectedImage }) {
  const classes = useStyles()
  const matchesSM = useMediaQuery(theme => theme.breakpoints.down("sm"))

  return (
    <Grid item container direction="column" alignItems="center" lg={6}>
      <Grid item>
        {/* <img
          src={process.env.GATSBY_STRAPI_URL + images[selectedImage].url}
          alt="large product picture"
          className={classes.selected}
        /> */}
        <Magnifier
          src={process.env.GATSBY_STRAPI_URL + images[selectedImage].url}
          alt="large product picture"
          width={matchesSM ? "20rem" : "30rem"}
          mgWidth={matchesSM ? 70 : 200}
          mgHeight={matchesSM ? 70 : 200}
          zoomFactor={0.8}
          className={classes.selected}
        />
      </Grid>

      <Grid item container justify="center">
        {images.map((image, i) => (
          <Grid item key={image.url} classes={{ root: classes.imageItem }}>
            <IconButton onClick={() => setSelectedImage(i)}>
              <img
                src={process.env.GATSBY_STRAPI_URL + image.url}
                alt={`product_small${i}`}
                className={classes.small}
              />
            </IconButton>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

export default ProductImages
