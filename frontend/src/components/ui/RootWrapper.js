import React from "react"
import { ThemeProvider } from "@material-ui/core/styles"
import ApolloWrapper from "../../apollo/ApolloWrapper"
import { UserWrapper, FeedbackWrapper, CartWrapper } from "../../contexts"
import theme from "./theme"

const RootWrapper = ({ element }) => {
  return (
    <ThemeProvider theme={theme}>
      <ApolloWrapper>
        <UserWrapper>
          <FeedbackWrapper>
            <CartWrapper>{element}</CartWrapper>
          </FeedbackWrapper>
        </UserWrapper>
      </ApolloWrapper>
    </ThemeProvider>
  )
}

export default RootWrapper
