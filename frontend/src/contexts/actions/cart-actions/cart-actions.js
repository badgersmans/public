import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CHANGE_FREQUENCY,
  TOGGLE_SUBSCRIPTION,
} from "../constants/action-types"

// action creators
export const addToCart = (variant, quantity, name, stock, subscription) => ({
  type: ADD_TO_CART,
  payload: { variant, quantity, name, stock, subscription },
})

export const removeFromCart = (variant, quantity) => ({
  type: REMOVE_FROM_CART,
  payload: { variant, quantity },
})

export const clearCart = () => ({
  type: CLEAR_CART,
})

export const changeFrequency = (variant, frequency) => ({
  type: CHANGE_FREQUENCY,
  payload: { variant, frequency },
})

export const toggleSubscription = (variant, frequency) => ({
  type: TOGGLE_SUBSCRIPTION,
  payload: { variant, frequency },
})
