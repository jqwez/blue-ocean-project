import './StyleSheets/App.css';
import { useState, useContext, useEffect } from 'react';
import { Routes, Route } from "react-router-dom"
import Loading from './Components/LoadingDisplay/Loading'
import LandingPage from './Components/Landing/LandingPage'
import HomePage from './Components/HomePage/HomePage'
import CreateAccountModal from './Components/Landing/CreateAccountModal';
import LoginContext from './Context/LoginContext';
import AppContext from './Context/AppContext';
import "./StyleSheets/Header.css"
import StudentPage from './Components/StudentPage/StudentPage';
import NotFound from './Components/LoadingDisplay/NotFound'
import Archive from './Components/Archive/Archive'
import Settings from './Components/Settings/Settings'
import Header from './Components/Header/Header';
import io from 'socket.io-client'

const socket = io.connect("https://hacking-transition.herokuapp.com")

function App() {
  const { login, userData, setUserData, invokeSetLogin } = useContext(LoginContext)
  const { allUsersData, allCohortsData, invokeSetAllUsersData, invokeSetAllCohortsData, loading, setLoading } = useContext(AppContext)

  useEffect(() => {
    fetchAllCohortData()
    fetchAllUserData()
  }, [])

  const fetchAllUserData = () => {
    fetch('https://hacking-transition.herokuapp.com/api/users')
      .then(res => res.json())
      .then(data => invokeSetAllUsersData(data))
      .then(() => setLoading(false))
      .catch(err => console.log(err))
  }

  const fetchAllCohortData = () => {
    fetch('https://hacking-transition.herokuapp.com/api/cohorts')
      .then(res => res.json())
      .then(data => invokeSetAllCohortsData(data))
      .catch(err => console.log(err))
  }


  return (
    <div className="AppContainer">
      {loading ? <Loading /> : null}
      {login || userData || localStorage.currentUser ? <Header /> : null}

      <Routes>
        <Route path="/" element={login ? <StudentPage socket={socket} userData={userData} setUserData={setUserData} invokeSetLogin={invokeSetLogin} /> : <LandingPage invokeSetLogin={invokeSetLogin} />} />
        <Route path="/createAccount" element={<CreateAccountModal />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  );
}

export default App;
