import React, { useContext } from "react"
import Layout from "../components/ui/Layout"
import AuthContainer from "../components/Account/auth/AuthContainer"
import SettingsContainer from "../components/Settings/SettingsContainer"

import { UserContext } from "../contexts"
import { setUser } from "../contexts/actions/user-actions"

function Account() {
  const { user } = useContext(UserContext)
  // const handleLogout = () => {
  //   dispatchUser(setUser(defaultUser))
  // }
  return (
    <Layout>
      {user.jwt && user.onboarding ? <SettingsContainer /> : <AuthContainer />}
    </Layout>
  )
}

export default Account
