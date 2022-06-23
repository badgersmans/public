import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CHANGE_FREQUENCY,
  TOGGLE_SUBSCRIPTION,
} from "../../actions/constants/action-types"

const cartReducer = (state, action) => {
  // console.log(`state ->`, state)
  // console.log(`action ->`, action)
  let newCart = [...state]
  let existingIndex

  if (action.payload) {
    //   returns index if found, -1 otherwise
    existingIndex = state.findIndex(
      item => item.variant === action.payload.variant
    )
  }

  const saveCartToLocalStorage = cart => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }

  switch (action.type) {
    case ADD_TO_CART:
      // if cart does not already have the item...
      if (existingIndex !== -1) {
        let newQuantity =
          newCart[existingIndex].quantity + action.payload.quantity

        // check to make sure quantity added does not exceed stock
        if (newQuantity > action.payload.stock) {
          // just set the quantity to the stock
          newQuantity = action.payload.stock
        }
        // above conditions satisfied, then just add to it
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newQuantity,
        }
      } else {
        // otherwise add to cart (because it does not already exist)
        newCart.push(action.payload)
      }
      saveCartToLocalStorage(newCart)
      return newCart
    case REMOVE_FROM_CART:
      const newQuantity =
        newCart[existingIndex].quantity - action.payload.quantity
      // console.log(`newQuantity ->`, newQuantity)

      // if quantity less than 0, just remove it
      if (newQuantity <= 0) {
        newCart = newCart.filter(
          item => item.variant !== action.payload.variant
        )
      } else {
        //  otherwise just update the quantity
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newQuantity,
        }
      }
      saveCartToLocalStorage(newCart)
      return newCart
    case CHANGE_FREQUENCY:
      newCart[existingIndex].subscription = action.payload.frequency
      saveCartToLocalStorage(newCart)
      return newCart
    case TOGGLE_SUBSCRIPTION:
      // check existing subscription !! coerces to boolean
      const existingSubscription = !!newCart[existingIndex].subscription
      if (existingSubscription) {
        delete newCart[existingIndex].subscription
      } else {
        newCart[existingIndex].subscription = action.payload.frequency
      }
      saveCartToLocalStorage(newCart)
      return newCart
    case CLEAR_CART:
      localStorage.removeItem("cart")
      return []

    default:
      return state
  }
}

export default cartReducer
