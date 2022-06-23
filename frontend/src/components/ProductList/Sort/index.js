import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import clsx from "clsx"
import Chip from "@material-ui/core/Chip"
import sort from "../../../images/sort.svg"
import close from "../../../images/close-outline.svg"

const useStyles = makeStyles(theme => ({
  chipContainer: {
    [theme.breakpoints.down("md")]: {
      margin: "0.5rem",
    },
  },
  notActive: {
    backgroundColor: theme.palette.primary.main,
  },
}))

function Sort({ setOption, sortOptions, setSortOptions }) {
  const classes = useStyles()
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const handleSort = i => {
    const newOptions = [...sortOptions]

    // turn off the active for all the sort buttons
    newOptions.map(option => (option.active = false))

    newOptions[i].active = true

    // newOptions which is a copy of sortOptions but with the new active item inside
    setSortOptions(newOptions)
  }

  return (
    <Grid item container justify="space-between" alignItems="center">
      <Grid item>
        <IconButton onClick={() => setOption(null)}>
          <img src={sort} alt="sort" />
        </IconButton>
      </Grid>

      <Grid item xs>
        <Grid
          container
          justify="space-around"
          alignItems={matchesXS ? "center" : undefined}
          direction={matchesXS ? "column" : "row"}
        >
          {sortOptions.map((option, i) => (
            <Grid
              item
              key={option.label}
              classes={{ root: classes.chipContainer }}
            >
              <Chip
                label={option.label}
                classes={{
                  root: clsx({
                    [classes.notActive]: option.active !== true,
                  }),
                }}
                color={option.active !== true ? "primary" : "secondary"}
                onClick={() => handleSort(i)}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid item>
        <IconButton onClick={() => setOption(null)}>
          <img src={close} alt="close" />
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default Sort
