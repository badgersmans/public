import React from "react"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  size: {
    color: theme.palette.common.WHITE,
  },
  button: {
    border: "3px solid #fff",
    borderRadius: 50,
    height: "3rem",
    width: "3rem",
    minWidth: 0,
  },
  selected: {
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  // size: {},
  // size: {},
}))

function Sizes({ sizes, selectedSize, setSelectedSize }) {
  const classes = useStyles()

  const possibleSizes = ["S", "M", "L"]
  let actualSizes = []

  if (possibleSizes.every(size => sizes.includes(size))) {
    actualSizes = possibleSizes
  }
  return (
    <Grid item container justify="space-between">
      {actualSizes.map(size => (
        <Grid item key={size}>
          <Button
            classes={{
              root: clsx(classes.button, {
                [classes.selected]: selectedSize === size,
              }),
            }}
            onClick={() => setSelectedSize(size)}
          >
            <Typography variant="h3" classes={{ root: classes.size }}>
              {size}
            </Typography>
          </Button>
        </Grid>
      ))}
    </Grid>
  )
}

export default Sizes
