import React, { useEffect, useContext } from "react"
import Login from "./components/Login"
import Header from "./components/Header"
import { UserContext } from "./context/UserContext"
import Purchased from "./components/Purchased"

const App = () => {
  const[token,] = useContext(UserContext)

  useEffect(() => {},[])
  return(
    <>
      <Header title={"Mutual Funds"}/>
      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-three-quarters">
          {
            !token ? (
              <div className="columns">
                <Login />
              </div>
            ) : (
              <>
                <Purchased />
              </>
            )
          }
        </div>
        <div className="column"></div>
      </div>
    </> 
  )
}

export default App