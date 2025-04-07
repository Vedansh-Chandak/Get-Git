import Hero from "./Components/Hero"
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import UserProfile from "./Components/UserProfile"

function App() {
 

  return (
  <Router>
    <Routes>
      <Route path="/" element={<Hero/>}/>
    <Route path="/user/:username" element={<UserProfile/>} />
    </Routes>
  </Router>
  )
}

export default App
