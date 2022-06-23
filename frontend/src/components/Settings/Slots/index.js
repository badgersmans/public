import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  slots: {
    backgroundColor: theme.palette.common.WHITE,
    borderRadius: 25,
    width: "2.5rem",
    height: "2.5rem",
    minWidth: 0,
    "&:hover": {
      backgroundColor: theme.palette.common.WHITE,
    },
    border: `0.15rem solid ${theme.palette.secondary.main}`,
    [theme.breakpoints.down("xs")]: {
      width: ({ isCheckout }) => (isCheckout ? "1.8rem" : "2rem"),
      height: ({ isCheckout }) => (isCheckout ? "1.8rem" : "2rem"),
    },
  },
  slotText: {
    color: theme.palette.secondary.main,
    marginLeft: "-0.25rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: ({ isCheckout }) => (isCheckout ? "1.4rem" : undefined),
    },
  },
  slotContainer: {
    marginLeft: "1rem",
    marginBottom: "1rem",
    "& > :not(:first-child)": {
      marginLeft: "-0.5rem",
    },
  },
  selectedSlot: {
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  selectedSlotText: {
    color: theme.palette.common.WHITE,
  },
  shippingInfo: {
    color: theme.palette.common.WHITE,
    fontWeight: 600,
    marginLeft: "0.5rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1rem",
      marginTop: "0.3rem",
    },
  },
}))

function Slots({ slot, setSlot, isCheckout, noLabel }) {
  const classes = useStyles({ isCheckout })
  return (
    <Grid item container xs>
      <Grid item classes={{ root: classes.slotContainer }}>
        {[1, 2, 3].map(number => (
          <Button
            key={number}
            classes={{
              root: clsx(classes.slots, {
                [classes.selectedSlot]: slot === number - 1,
              }),
            }}
            onClick={() => setSlot(number - 1)}
          >
            <Typography
              variant="h5"
              classes={{
                root: clsx(classes.slotText, {
                  [classes.selectedSlotText]: slot === number - 1,
                }),
              }}
            >
              {number}
            </Typography>
          </Button>
        ))}
      </Grid>

      {isCheckout && (
        <Grid item>
          <Typography variant="body1" classes={{ root: classes.shippingInfo }}>
            Shipping
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

export default Slots
