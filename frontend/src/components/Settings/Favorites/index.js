import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import CircularProgress from "@material-ui/core/CircularProgress"
import formatMoney from "../../../../utils/formatMoney"
import Chip from "@material-ui/core/Chip"
import Sizes from "../../ProductList/Sizes"
import Swatches from "../../ProductList/Swatches"
import QuantityButton from "../../ProductList/QuantityButton"
import Delete from "../../../images/Delete"
import axios from "axios"
import { makeStyles } from "@material-ui/core/styles"
import { UserContext, FeedbackContext } from "../../../contexts"
import { setSnackbar } from "../../../contexts/actions/feedback-actions"
import { setUser } from "../../../contexts/actions/user-actions"
import SettingsDataGrid from "../SettingsDataGrid"

const useStyles = makeStyles(theme => ({
  mainContainer: {
    height: "100%",
    width: "100%",
  },
  image: {
    height: "10rem",
    width: "10rem",
  },
  name: {
    color: theme.palette.common.WHITE,
  },
  chipRoot: {
    height: "3rem",
    width: "10rem",
    borderRadius: 50,
  },
  deleteWrapper: {
    height: "2rem",
    width: "2rem",
  },
  // something: {},
  // something: {},
  // something: {},
  // something: {},
}))

function Favorites({ setSelectedSetting }) {
  const classes = useStyles()
  const [products, setProducts] = useState([])
  const [selectedVariants, setSelectedVariants] = useState({})
  const [loading, setLoading] = useState(null)
  const [selectedSizes, setSelectedSizes] = useState({})
  const [selectedColors, setSelectedColors] = useState({})
  const { user, dispatchUser } = useContext(UserContext)
  const { dispatchFeedback } = useContext(FeedbackContext)
  // console.log(user.favorites)

  const createRows = data =>
    data.map(item => {
      const selectedVariant = selectedVariants[item.id]
      return {
        item: {
          name: item.variants[selectedVariant].product.name.split(" ")[0],
          image: item.variants[selectedVariant].images[0].url,
        },
        variant: { all: item.variants, current: item.product_variant },
        quantity: item.variants,
        price: item.variants[selectedVariant].price,
        // id is the favorite id
        id: item.id,
      }
    })

  const setSelectedHelper = (selectedFunction, existingValues, value, row) => {
    selectedFunction({ ...existingValues, [row]: value })

    // fav.id is the favorite id
    const { variants } = products.find(fav => fav.id === row)
    const selectedVariant = selectedVariants[row]

    let newVariant

    // if changing color
    if (value.includes("#")) {
      newVariant = variants.find(
        variant =>
          variant.size === selectedSizes[row] &&
          variant.style === variants[selectedVariant].style &&
          variant.color === value
      )
    } else {
      // changing the size
      let newColors = []

      variants.map(variant => {
        // if color not already in list
        if (
          !newColors.includes(variant.color) &&
          variant.size === value &&
          variants[selectedVariant].style === variant.style
        ) {
          newColors.push(variant.color)
        }
      })
      newVariant = variants.find(
        variant =>
          variant.size === value &&
          variant.style === variants[selectedVariant].style &&
          variant.color === newColors[0]
      )
    }
    setSelectedVariants({
      ...selectedVariants,
      [row]: variants.indexOf(newVariant),
    })
  }

  const columns = [
    {
      field: "item",
      headerName: "Item",
      width: 250,
      renderCell: ({ value }) => (
        <Grid container direction="column">
          <Grid item>
            <img
              src={`${process.env.GATSBY_STRAPI_URL}${value.image}`}
              alt={value.name}
              className={classes.image}
            />
          </Grid>

          <Grid item>
            <Typography variant="h3" classes={{ root: classes.name }}>
              {value.name}
            </Typography>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "variant",
      headerName: "Variant",
      width: 275,
      sortable: false,
      renderCell: ({ value, row }) => {
        let sizes = []
        let colors = []

        value.all.map(variant => {
          sizes.push(variant.size)

          // if color not already on the list
          if (
            !colors.includes(variant.color) &&
            variant.size === selectedSizes[row.id] &&
            variant.style === value.current.style
          ) {
            colors.push(variant.color)
          }
        })

        return (
          <Grid container direction="column">
            <Sizes
              sizes={sizes}
              selectedSize={selectedSizes[row.id]}
              setSelectedSize={size =>
                setSelectedHelper(setSelectedSizes, selectedSizes, size, row.id)
              }
            />
            <Swatches
              colors={colors}
              selectedColor={selectedColors[row.id]}
              setSelectedColor={color =>
                setSelectedHelper(
                  setSelectedColors,
                  selectedColors,
                  color,
                  row.id
                )
              }
            />
          </Grid>
        )
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 250,
      sortable: false,
      renderCell: ({ value, row }) => {
        const selectedVariant = selectedVariants[row.id]
        const stock = value.map(variant => ({
          quantity: variant.quantity,
        }))
        return (
          <QuantityButton
            stock={stock}
            variants={value}
            selectedVariant={selectedVariant}
            name={value[selectedVariant].product.name.split(" ")[0]}
          />
        )
      },
    },
    {
      field: "price",
      headerName: "Price",
      width: 250,
      renderCell: ({ value }) => (
        <Chip classes={{ root: classes.chipRoot }} label={formatMoney(value)} />
      ),
    },
    {
      field: "",
      width: 500,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value, row }) => (
        <IconButton onClick={() => handleDelete(row.id)} disabled={!!loading}>
          {loading === row.id ? (
            <CircularProgress size="2rem" color="secondary" />
          ) : (
            <span className={classes.deleteWrapper}>
              <Delete />
            </span>
          )}
        </IconButton>
      ),
    },
  ]

  const handleDelete = row => {
    console.log(`row ->`, row)
    setLoading(row)

    axios
      .delete(`${process.env.GATSBY_STRAPI_URL}/favorites/${row}`, {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      })
      .then(response => {
        setLoading(null)

        const newProducts = products.filter(product => product.id !== row)
        const newFavorites = user.favorites.filter(fav => fav.id !== row)
        dispatchUser(setUser({ ...user, favorites: newFavorites }))
        setProducts(newProducts)
        dispatchFeedback(
          setSnackbar({ status: "success", message: "Removed from favorites" })
        )
      })
      .catch(error => {
        setLoading(null)
        console.error(error)
        dispatchFeedback(
          setSnackbar({
            status: "error",
            message:
              "There was a problem removing from favorites, please try again.",
          })
        )
      })
  }

  console.log(selectedSizes)

  useEffect(() => {
    axios
      .get(`${process.env.GATSBY_STRAPI_URL}/favorites/userFavorites`, {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      })
      .then(response => {
        setProducts(response.data)

        let newVariants = {}
        let newSizes = {}
        let newColors = {}

        response.data.forEach(fav => {
          const found = fav.variants.find(
            variant => variant.id === fav.product_variant.id
          )

          const index = fav.variants.indexOf(found)

          newVariants = { ...newVariants, [fav.id]: index }
          newSizes = { ...newSizes, [fav.id]: fav.product_variant.size }
          newColors = { ...newColors, [fav.id]: fav.product_variant.color }
        })
        setSelectedVariants(newVariants)
        setSelectedSizes(newSizes)
        setSelectedColors(newColors)
      })
      .catch(error => {
        console.error(error)
        dispatchFeedback(
          setSnackbar({
            status: "error",
            message:
              "There was a problem getting your favorite products, please refresh the page",
          })
        )
      })
  }, [])

  const rows =
    Object.keys(selectedVariants).length > 0 ? createRows(products) : []
  console.log(`products ->`, products)
  return (
    <Grid item container classes={{ root: classes.mainContainer }}>
      <SettingsDataGrid
        rows={rows}
        columns={columns}
        setSelectedSetting={setSelectedSetting}
        rowsPerPage={2}
      />
    </Grid>
  )
}

export default Favorites
