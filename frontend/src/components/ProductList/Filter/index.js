import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Chip from "@material-ui/core/Chip"
import FormControl from "@material-ui/core/FormControl"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup"
import Checkbox from "@material-ui/core/Checkbox"
import { makeStyles } from "@material-ui/core/styles"
import filter from "../../../images/filter.svg"
import close from "../../../images/close-outline.svg"

const useStyles = makeStyles(theme => ({
  mainContainer: {
    padding: "1rem 0",
  },
  checkbox: {
    // color: theme.palette.secondary.main,
    color: "#000",
  },
  optionsContainer: {
    [theme.breakpoints.down("xs")]: {
      "& > :not(:last-child)": {
        marginBottom: "2rem",
      },
    },
  },
}))

function Filter({ setOption, filterOptions, setFilterOptions }) {
  const classes = useStyles()

  // filterOptions has the following format.
  //   {
  //     "Color": [
  //        {
  //          "label": "Black",
  //          "checked": false
  //        }
  //      ]
  //   }
  const handleFilter = (option, i) => {
    // console.log(option)
    // console.log(i)
    // must make a copy, as state cannot/should not be mutated directly
    const newFilters = { ...filterOptions }
    // console.log(newFilters)

    // ! to invert boolean
    // newFilters[option][i] === newFilters[Color][{},{}, n...]
    newFilters[option][i].checked = !newFilters[option][i].checked

    setFilterOptions(newFilters)
  }

  // console.log(filterOptions)

  return (
    <Grid
      item
      container
      justify="space-between"
      alignItems="center"
      classes={{ root: classes.mainContainer }}
    >
      <Grid item>
        <IconButton onClick={() => setOption(null)}>
          <img src={filter} alt="filter" />
        </IconButton>
      </Grid>

      <Grid item xs>
        <Grid
          container
          justify="space-around"
          classes={{ root: classes.optionsContainer }}
        >
          {/* filterOptions[option] equivalent to filterOptions.Color for example. */}
          {Object.keys(filterOptions)
            .filter(option => filterOptions[option] !== null)
            .map(option => (
              <Grid item key={option}>
                <Grid container direction="column">
                  <Grid item>
                    <Chip label={option} />
                  </Grid>
                  <Grid item>
                    <FormControl>
                      <FormGroup>
                        {filterOptions[option].map(({ checked, label }, i) => (
                          <FormControlLabel
                            key={label}
                            label={label}
                            classes={{ label: classes.checkbox }}
                            control={
                              <Checkbox
                                checked={checked}
                                name={label}
                                classes={{ root: classes.checkbox }}
                                onChange={() => handleFilter(option, i)}
                              />
                            }
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Grid>
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

export default Filter
