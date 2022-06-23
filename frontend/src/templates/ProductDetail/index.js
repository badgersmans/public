import React, { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import Layout from "../../components/ui/layout"
import Grid from "@material-ui/core/Grid"
import ProductImages from "../../components/ProductDetail/ProductImages"
import ProductInfo from "../../components/ProductDetail/ProductInfo"
import ProductReviews from "../../components/ProductDetail/ProductReviews"
import RecentlyViewed from "../../components/ProductDetail/RecentlyViewed"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { GET_DETAILS } from "../../apollo/queries"

function ProductDetail({
  pageContext: { id, name, description, category, productVariants, product },
}) {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)
  const [editComment, setEditComment] = useState(false)
  const [stock, setStock] = useState(null)
  const [rating, setRating] = useState(0)
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

  const params = new URLSearchParams(window.location.search)
  const style = params.get("style")

  const { loading, error, data } = useQuery(GET_DETAILS, {
    variables: { id },
  })

  useEffect(() => {
    if (error) {
      setStock(-1)
    } else if (data) {
      setStock(data.product.product_variants)
      setRating(data.product.averageRating)
    }
  }, [error, data])
  console.log(error)

  useEffect(() => {
    const styledVariant = productVariants.filter(
      variant => variant.style === params.get("style")
    )[0]

    const variantIndex = productVariants.indexOf(styledVariant)

    let recentlyViewed = JSON.parse(
      window.localStorage.getItem("recentlyViewed")
    )

    if (recentlyViewed) {
      if (recentlyViewed.length === 10) {
        recentlyViewed.shift()
      }

      if (
        !recentlyViewed.some(
          product =>
            product.node.name === name &&
            product.selectedVariant === variantIndex
        )
      ) {
        recentlyViewed.push({ ...product, selectedVariant: variantIndex })
      }
    } else {
      recentlyViewed = [{ ...product, selectedVariant: variantIndex }]
    }

    window.localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(recentlyViewed)
    )

    setSelectedVariant(variantIndex)
  }, [style])
  // console.log(productVariants)
  return (
    <Layout>
      <Grid container direction="column">
        <Grid item container direction={matchesMD ? "column" : "row"}>
          <ProductInfo
            name={name}
            description={description}
            productVariants={productVariants}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            stock={stock}
            setEditComment={setEditComment}
            rating={rating}
            product={id}
          />

          <ProductImages
            // get all images for the selected varian
            images={productVariants[selectedVariant].images}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
        </Grid>

        <RecentlyViewed
          products={JSON.parse(window.localStorage.getItem("recentlyViewed"))}
        />

        <ProductReviews
          product={id}
          editComment={editComment}
          setEditComment={setEditComment}
        />
      </Grid>
    </Layout>
  )
}

export default ProductDetail
