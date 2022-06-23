import React, { useEffect, useReducer, createContext } from "react"
import cartReducer from "../../reducers/cart-reducer"

export const CartContext = createContext()
const CartProvider = CartContext.Provider

export const CartWrapper = ({ children }) => {
  const storedCart = JSON.parse(localStorage.getItem("cart"))
  const [cart, dispatchCart] = useReducer(cartReducer, storedCart || [])

  //   useEffect(() => {}, [])

  return <CartProvider value={{ cart, dispatchCart }}>{children}</CartProvider>
}
