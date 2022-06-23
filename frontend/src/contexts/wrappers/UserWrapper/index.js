import React, { useEffect, useReducer, createContext } from "react"
import axios from "axios"
import userReducer from "../../reducers/user-reducer"
import { setUser } from "../../actions/user-actions"

export const UserContext = createContext()
const UserProvider = UserContext.Provider

export const UserWrapper = ({ children }) => {
  const defaultUser = { username: "Guest" }

  const storedUser = JSON.parse(localStorage.getItem("user"))

  const [user, dispatchUser] = useReducer(
    userReducer,
    storedUser || defaultUser
  )

  useEffect(() => {
    if (storedUser) {
      // console.log("is there a user?")
      setTimeout(() => {
        axios
          .get(`${process.env.GATSBY_STRAPI_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${storedUser.jwt}`,
            },
          })
          .then(response => {
            dispatchUser(
              setUser({
                ...response.data,
                jwt: storedUser.jwt,
                onboarding: true,
              })
            )
            // console.log("user profile?", response.data)
          })
          .catch(error => {
            console.error(error)
            dispatchUser(setUser(defaultUser))
          })
      }, 3000)
    }
  }, [])

  return (
    <UserProvider value={{ user, dispatchUser, defaultUser }}>
      {children}
    </UserProvider>
  )
}
