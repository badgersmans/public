import { createTheme } from "@material-ui/core/styles"

const UPBEAT = "#FFE487"
const MORNING_TEA = "#CABD94"
const TIBETAN_JASMINE = "#F6F3E1"

const GREEN = "#99B898"
const DARK_GREEN = "#708670"
const TAN = "#FECEA8"
const LIGHT_RED = "#FF847A"
const RED = "#E84A5F"
const OFF_BLACK = "#2A363B"
const GREY = "#747474"
const WHITE = "#FFF"

const theme = createTheme({
  palette: {
    primary: {
      main: UPBEAT,
    },
    secondary: {
      main: MORNING_TEA,
    },
    common: {
      TAN,
      LIGHT_RED,
      RED,
      OFF_BLACK,
      WHITE,
      TIBETAN_JASMINE,
    },
  },
  typography: {
    h1: {
      fontSize: "4.5rem",
      fontFamily: "Philosopher",
      fontStyle: "italic",
      fontWeight: 700,
      color: UPBEAT,
    },
    h2: {
      fontSize: "3rem",
      fontFamily: "Montserrat",
      //   fontStyle: "italic",
      fontWeight: 500,
      color: WHITE,
    },
    h3: {
      fontSize: "2rem",
      fontFamily: "Montserrat",
      //   fontStyle: "italic",
      fontWeight: 300,
      color: UPBEAT,
    },
    h4: {
      fontSize: "3rem",
      fontFamily: "Philosopher",
      fontStyle: "italic",
      fontWeight: 700,
      color: WHITE,
    },
    h5: {
      fontSize: "2rem",
      fontFamily: "Philosopher",
      fontStyle: "italic",
      fontWeight: 700,
      color: WHITE,
    },
    body1: {
      fontSize: "1.5rem",
      fontFamily: "Montserrat",
      //   fontStyle: "italic",
      //   fontWeight: 700,
      color: GREY,
    },
    body2: {
      fontSize: "1.5rem",
      fontFamily: "Montserrat",
      color: WHITE,
    },
  },
  overrides: {
    MuiChip: {
      root: {
        backgroundColor: MORNING_TEA,
      },
      label: {
        fontSize: "1.5rem",
        fontFamily: "Montserrat",
        color: WHITE,
        fontWeight: 400,
      },
    },
  },
})

export default theme
