import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import clsx from "clsx"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  swatch: {
    border: "3px solid #FFF",
    height: "3rem",
    width: "3rem",
    minWidth: 0,
    borderRadius: 50,
  },
  swatchContainer: {
    marginTop: "0.8rem",
    "&:not(:first-child)": {
      marginLeft: "-0.5rem",
    },
  },
  selected: {
    borderColor: theme.palette.secondary.main,
  },
}))

function Swatches({ colors, selectedColor, setSelectedColor }) {
  const classes = useStyles()
  return (
    <Grid item container>
      {/* #FFF, #000, etc. sort makes it the same order */}
      {colors.sort().map(color => (
        <Grid item key={color} classes={{ root: classes.swatchContainer }}>
          {/* apparently, style prop is slower than classes */}
          <Button
            style={{ backgroundColor: color }}
            classes={{
              root: clsx(classes.swatch, {
                [classes.selected]: selectedColor === color,
              }),
            }}
            onClick={() => setSelectedColor(color)}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default Swatches
