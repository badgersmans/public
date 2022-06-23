import React, { useState, useEffect, useRef } from "react"
import Grid from "@material-ui/core/Grid"
import Fab from "@material-ui/core/Fab"
import Pagination from "@material-ui/lab/Pagination"
import PaginationItem from "@material-ui/lab/PaginationItem"
import { makeStyles, styled } from "@material-ui/styles"
import { graphql } from "gatsby"

import Layout from "../../components/ui/layout"
import DynamicToolbar from "../../components/ProductList/DynamicToolbar"
import ListOfProducts from "../../components/ProductList/ListOfProducts"
import {
  alphabetic,
  timestamp,
  price,
} from "../../components/ProductList/SortFunctions"

const useStyles = makeStyles(theme => ({
  fab: {
    alignSelf: "flex-end",
    marginRight: "3rem",
    marginBottom: "2rem",
    color: theme.palette.common.WHITE,
    fontFamily: "Montserrat",
    fontSize: "5rem",
    width: "4.5rem",
    height: "4.5rem",
  },
  pagination: {
    // alignSelf: "flex-end",
    // marginRight: "2%",
    // marginTop: "-3rem",
    // marginBottom: "4rem",
    [theme.breakpoints.down("md")]: {
      marginTop: "3rem",
    },
    // [theme.breakpoints.only("md")]: {
    //   marginTop: "1rem",
    // },
  },
}))

export const StyledPagination = props => {
  const StyledPaginationItem = styled(PaginationItem)(({ theme }) => ({
    fontFamily: "Montserrat",
    fontSize: "2rem",
    color: theme.palette.primary.main,
    "&.Mui-selected": {
      color: theme.palette.common.WHITE,
    },
  }))
  return (
    <Pagination
      {...props}
      renderItem={item => <StyledPaginationItem {...item} />}
    />
  )
}

function ProductList({
  pageContext: { filterOptions: options, name, description },
  data: {
    allStrapiProduct: { edges: products },
  },
}) {
  // console.log(products)
  const [layout, setLayout] = useState("grid")
  const [page, setPage] = useState(1)
  const [filterOptions, setFilterOptions] = useState(options)
  const [sortOptions, setSortOptions] = useState([
    { label: "A-Z", active: true, function: data => alphabetic(data, "asc") },
    { label: "Z-A", active: false, function: data => alphabetic(data, "desc") },
    {
      label: "PRICE ↑",
      active: false,
      function: data => price(data, "asc"),
    },
    {
      label: "PRICE ↓",
      active: false,
      function: data => price(data, "desc"),
    },
    {
      label: "NEWEST",
      active: false,
      function: data => timestamp(data, "asc"),
    },
    {
      label: "OLDEST",
      active: false,
      function: data => timestamp(data, "desc"),
    },
    {
      label: "REVIEWS",
      active: false,
      function: data => data,
    },
  ])

  useEffect(() => {
    setPage(1)
  }, [filterOptions, layout])

  const scrollToTopRef = useRef(null)
  const classes = useStyles()

  const scrollToTop = () => {
    // .current is referencing the DOM element in this case
    scrollToTopRef.current.scrollIntoView({ behavior: "smooth" })
  }

  const productsPerPage = layout === "grid" ? 16 : 6

  // let variantsCount = 0

  // products.map(
  //   product => (variantsCount += product.node.product_variants.length)
  // )

  let content = []
  // so selectedSort by default will have the object of the form
  // { label: "A-Z", active: true, function: data => alphabetic(data, "asc") }
  const selectedSort = sortOptions.filter(option => option.active)[0]
  const sortedProducts = selectedSort.function(products)

  sortedProducts.map((product, i) =>
    product.node.product_variants.map(variant =>
      content.push({
        product: i,
        variant,
      })
    )
  )

  let isFiltered = false
  let filters = {}
  let filteredProducts = []

  Object.keys(filterOptions)
    .filter(option => filterOptions[option] !== null)
    .map(option => {
      // map because the ones that are !== null are arrays
      // option would be Color, Size, Style but it is specific to the product category
      // hats only have color that is !== null, so it will only have color
      // console.log(option)
      filterOptions[option].forEach(value => {
        // filterOptions is the entire object from strapi, here we want to access certain keys
        // so hats option would be filterOptions[Color] or filterOptions.Color
        // filterOptions[option] is an array of objects
        // taking hats as an example, the object looks like
        // {checked: false, label: "Black"}
        // console.log(filterOptions[option])

        // then value here is an object with the form
        // {checked: false, label: "Black"} (again it depends on the product category, it is different for each)
        console.log(value)
        if (value.checked) {
          // here it will be checked because the filter component manipulates the state and therefore causes a re-render
          // remember, we are checking one by one for each product item in the array for a checked === true
          // remember also, that we are using the content array which contents looks like
          // [{product: 0, variant: {color: "#FFF", colorLabel: "White", id: "theid", images: [...theimages], price: 123, size: null, style: null}  }]
          //  the content array is the original one from strapi.
          // so now we know that option (for hats) is Color.
          // item.variant is an object, we need to access certain keys
          // so item.variant[option] means item.variant.Color or item.variant[Color]
          // but Color is from strapi, somehow it is lowercased in the content array
          // so it is color not Color.
          // so therefore, we need item.variant[option.toLowerCase()]
          // which means item.variant[option.toLowerCase()] would be the value of item.variant.color which is "#FFF"
          // remember! we are lowercasing the keys not the values! so the key Color would be color but the value of #FFF would still be the same casing unchanged.
          // remember earlier where value has the form {checked: false, label: "Black"}
          // so we are then checking if (item.variant[option.toLowerCase()] === value.label)
          // taking hoodies as an example now, item.variant[option.toLowerCase() would be size
          // and let's say value.label is "M"
          // so the expression if (item.variant[option.toLowerCase()] === value.label)
          // would return true for any hoodie that is size "M" === "M"
          // then if that is true, then just return it.

          // console.log(item.variant[option.toLowerCase()])
          // console.log(value.label)
          isFiltered = true

          // check for undefined so if not existing, add to filters
          if (filters[option] === undefined) {
            // filters[option] so like filters[Size] which looks like {Size: }
            filters[option] = []
            // empty array so we can push the actual values that are checked
            // it is actually saying {Size: []} so the filters have a size property that is an empty array
          }

          // check if {Size: []} does not include the value we are currently checking
          // includes prevents duplicates here because we only push to the array if not existing already
          if (!filters[option].includes(value)) {
            // push value which looks like {checked: false, label: "Black"}
            // so the filters object would look like {Size: [{checked: false, label: "Black"}]} after pushing
            filters[option].push(value)
          }

          // remember the content array looks like
          // [{product: 0, variant: {color: "#FFF", colorLabel: "White", id: "theid", images: [...theimages], price: 123, size: null, style: null}  }]
          content.forEach(item => {
            // logic for hats colorLabel
            if (option === "Color") {
              // then value here is an object with the form
              // {checked: false, label: "Black"} (again it depends on the product category, it is different for each)
              // !filteredProducts.includes(item) prevents duplicates
              if (
                item.variant.colorLabel === value.label &&
                !filteredProducts.includes(item)
              ) {
                // push the contents of item into filteredProducts
                filteredProducts.push(item)
              }
            }
            // logic for the rest (not hats)
            // item.variant[option.toLowerCase()] === value.label meaning size === 'S'
            else if (
              item.variant[option.toLowerCase()] === value.label &&
              !filteredProducts.includes(item)
            ) {
              // so the filteredProducts now contains ANY of the matching filters, ANY S and ANY Male for example...
              // meaning that it would also contain S and Female too because ANY S can also be Female with a size of S
              // what we REALLY want is if size is S, M, L it can be any S, M, L + style is Male, then find all any S, M, L that must be Male, no Female.
              filteredProducts.push(item)
            }
          })
        }
      })
    })

  // Remember filters looks like {Size: [{checked: true, label: "S"}], Style: [{checked: true, label: "Male"}]}
  // console.log(filters)
  Object.keys(filters).forEach(filter => {
    // lol...filteredProducts.filter() = filterCeption
    // we are looking at the filteredProducts and then filtering it AGAIN.
    // remember filteredProducts is an array, each item is an object which looks like
    // {product: 0, variant: {color: '#FFF', colorLabel: null, id: "theID", images: [{...theImages}], price: 98.5, size: "S", style: "Male"}}
    // and filter is the name of the keys, like Size, Style, Color
    filteredProducts = filteredProducts.filter(item => {
      let valid

      // some is an array method, so filters[filter] is an array here.
      // value is array with the form [{checked: true, label: "S"}]
      filters[filter].some(value => {
        // hats logic
        if (filter === "Color") {
          if (item.variant.colorLabel === value.label) {
            valid = item
          }
        }
        // logic for the rest (not hats)
        else if (item.variant[filter.toLowerCase()] === value.label) {
          valid = item
        }
      })
      return valid
    })
  })

  if (isFiltered) {
    content = filteredProducts
  }

  // console.log(`content ->`, content)
  // console.log(`filteredProducts ->`, filteredProducts)

  const totalPages = Math.ceil(content.length / productsPerPage)

  return (
    <Layout>
      <Grid container direction="column" alignItems="center">
        {/* it will still be rendered in the DOM, use this div to get location of top */}
        <div ref={scrollToTopRef} />
        {/* note to self, you can't put refs on functional components */}
        <DynamicToolbar
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          sortOptions={sortOptions}
          setSortOptions={setSortOptions}
          name={name}
          description={description}
          layout={layout}
          setLayout={setLayout}
        />
        <ListOfProducts
          products={products}
          content={content}
          layout={layout}
          page={page}
          productsPerPage={productsPerPage}
          filterOptions={filterOptions}
        />
        <StyledPagination
          count={totalPages}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
          color="primary"
          classes={{ root: classes.pagination }}
        />
        <Fab
          classes={{ root: classes.fab }}
          color="primary"
          onClick={scrollToTop}
        >
          ^
        </Fab>
      </Grid>
    </Layout>
  )
}

export default ProductList

export const query = graphql`
  query GetCategoryProducts($id: String!) {
    allStrapiProduct(filter: { category: { id: { eq: $id } } }) {
      edges {
        node {
          strapiId
          createdAt
          name
          category {
            name
          }
          product_variants {
            color
            id
            price
            size
            style
            colorLabel
            images {
              url
            }
          }
        }
      }
    }
  }
`
