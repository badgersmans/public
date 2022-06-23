import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import fullStar from "../../../images/full-star.svg"
import halfStar from "../../../images/half-star.svg"
import emptyStar from "../../../images/empty-star.svg"

const useStyles = makeStyles(theme => ({
  size: {
    height: ({ size }) => `${size || 2}rem`,
    width: ({ size }) => `${size || 2}rem`,
  },
}))

function Rating({ number, size }) {
  const classes = useStyles({ size })
  const diff = 5 - Math.ceil(number)
  // console.log(`number? ->`, number)
  // console.log(`diff? ->`, diff)

  return (
    <>
      {
        // render the full star
        [...Array(Math.floor(number))].map((e, i) => (
          <img
            src={fullStar}
            alt="full star"
            key={i}
            className={classes.size}
          />
        ))
      }
      {
        // half star
        number % 1 !== 0 ? (
          // !== 0 will be true for any odd number (3.3 mod 1 = 0.3)
          <img src={halfStar} alt="half star" className={classes.size} />
        ) : null
      }
      {
        // empty star
        [...Array(diff)].map((e, i) => (
          <img
            src={emptyStar}
            alt="empty star"
            key={`${i}-empty`}
            className={classes.size}
          />
        ))
      }
    </>
  )
}

export default Rating
