import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Button from "@material-ui/core/Button"
import clsx from "clsx"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"

import background from "../../../images/toolbar-background.svg"
import ListIcon from "../../../images/List"
import GridIcon from "../../../images/Grid"

const useStyles = makeStyles(theme => ({
  description: {
    color: theme.palette.common.WHITE,
  },
  descriptionContainer: {
    backgroundColor: theme.palette.primary.main,
    height: "15rem",
    width: "60%",
    borderRadius: 25,
    padding: "1rem",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("sm")]: {
      borderRadius: 0,
    },
  },
  mainContainer: {
    padding: "3rem",
    position: "relative",
    // backgroundImage: `url(${background})`,
    // backgroundSize: "cover",
    // backgroundPosition: "center",
    // backgroundRepeat: "no-repeat",
    [theme.breakpoints.down("sm")]: {
      padding: "3rem 0",
    },
  },
  button: {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRightColor: `${theme.palette.primary.main} !important`,
    borderRadius: 25,
    padding: "0.5rem 1.5rem",
    backgroundColor: theme.palette.common.WHITE,
    "&:hover": {
      backgroundColor: theme.palette.common.WHITE,
    },
  },
  selected: {
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  buttonGroup: {
    position: "absolute",
    right: 0,
    bottom: 0,
    marginRight: "2rem",
    marginBottom: "2rem",
    [theme.breakpoints.down("md")]: {
      position: "relative",
      display: "flex",
      alignSelf: "flex-end",
      marginRight: 0,
      marginBottom: 0,
      marginTop: "3rem",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: "1.5rem",
    },
  },
}))

function DescriptionContainer({ name, description, layout, setLayout }) {
  const classes = useStyles()
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
  const changeLayout = option => {
    setLayout(option)
  }
  return (
    <Grid
      item
      container
      direction={matchesMD ? "column" : "row"}
      classes={{ root: classes.mainContainer }}
      justify="center"
      alignItems={matchesMD ? "center" : undefined}
    >
      <Grid item classes={{ root: classes.descriptionContainer }}>
        <Typography variant="h4" align="center">
          {name}
        </Typography>
        <Typography
          variant="body1"
          classes={{ root: classes.description }}
          align="center"
        >
          {description}
        </Typography>
      </Grid>

      <Grid item classes={{ root: classes.buttonGroup }}>
        <ButtonGroup>
          <Button
            onClick={() => changeLayout("list")}
            classes={{
              outlined: clsx(classes.button, {
                [classes.selected]: layout === "list",
              }),
            }}
          >
            <ListIcon color={layout === "list" ? "#FFF" : undefined} />
          </Button>

          <Button
            onClick={() => changeLayout("grid")}
            classes={{
              outlined: clsx(classes.button, {
                [classes.selected]: layout === "grid",
              }),
            }}
          >
            <GridIcon color={layout === "grid" ? "#FFF" : undefined} />
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  )
}

export default DescriptionContainer
