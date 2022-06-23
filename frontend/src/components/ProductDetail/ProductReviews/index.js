import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import { useQuery } from "@apollo/client"
import { UserContext } from "../../../contexts"
import ProductReview from "../ProductReview"
import { GET_REVIEWS } from "../../../apollo/queries"
import { StyledPagination } from "../../../templates/ProductList"

const useStyles = makeStyles(theme => ({
  reviews: {
    padding: "0 3rem",
  },
  pagination: {
    marginBottom: "3rem",
  },

  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
}))

function ProductReviews({ product, editComment, setEditComment }) {
  const classes = useStyles()
  const { user } = useContext(UserContext)

  const { data } = useQuery(GET_REVIEWS, { variables: { id: product } })
  const [reviews, setReviews] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (data) {
      // console.log(`data? ->`, data)
      setReviews(data.product.reviews)
    }
  }, [data])
  console.log(`reviews? ->`, reviews)

  const reviewsPerPage = 2
  const numberOfPages = Math.ceil(reviews.length / reviewsPerPage)

  return (
    <Grid
      item
      container
      direction="column"
      classes={{ root: classes.reviews }}
      id="reviews"
    >
      {editComment && (
        <ProductReview
          product={product}
          setEditComment={setEditComment}
          reviews={reviews}
          user={user}
          setReviews={setReviews}
        />
      )}
      {reviews
        .filter(review =>
          editComment ? review.user.username !== user.username : review
        )
        // if page = 1, then 1 - 1 = 0 then 0 * reviewsPerPage (1 in this case) = 0
        // so start slicing at 0 index, then page (1) * reviewsPerPage (1) = 1 means to end the slice at 1 index
        // therefore displaying 1 per page
        .slice((page - 1) * reviewsPerPage, page * reviewsPerPage)
        .map(review => (
          <ProductReview
            product={product}
            key={review.id}
            review={review}
            reviews={reviews}
          />
        ))}

      <Grid item container justify="center">
        <Grid item>
          <StyledPagination
            classes={{ root: classes.pagination }}
            count={numberOfPages}
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            color="primary"
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProductReviews
