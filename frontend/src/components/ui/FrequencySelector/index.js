import React from "react"
import Grid from "@material-ui/core/Grid"
import Select from "@material-ui/core/Select"
import Chip from "@material-ui/core/Chip"
import MenuItem from "@material-ui/core/MenuItem"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  chipRoot: {
    backgroundColor: theme.palette.common.WHITE,
    height: "3rem",
    borderRadius: 50,
    "&:hover": {
      cursor: "pointer",
    },
  },
  chipLabel: {
    color: theme.palette.secondary.main,
  },
  select: {
    "&.MuiSelect-select": {
      paddingRight: 0,
    },
  },
  menu: {
    backgroundColor: theme.palette.primary.main,
  },
  menuItem: {
    color: theme.palette.common.WHITE,
  },
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
}))

const frequencies = [
  "Week",
  "Two Weeks",
  "Three Weeks",
  "Month",
  "Three Months",
  "Six Months",
  "Year",
]

function FrequencySelector({ value, setValue, chip }) {
  const classes = useStyles()
  return (
    <Select
      value={value}
      disableUnderline
      IconComponent={() => null}
      MenuProps={{ classes: { paper: classes.menu } }}
      classes={{ select: classes.select }}
      onChange={e => setValue(e.target.value)}
      renderValue={selected =>
        chip || (
          <Chip
            label={selected}
            classes={{
              root: classes.chipRoot,
              label: classes.chipLabel,
            }}
          />
        )
      }
    >
      {frequencies.map(choice => (
        <MenuItem
          key={choice}
          value={choice}
          classes={{ root: classes.menuItem }}
        >
          {" "}
          {choice}{" "}
        </MenuItem>
      ))}
    </Select>
  )
}

export default FrequencySelector
