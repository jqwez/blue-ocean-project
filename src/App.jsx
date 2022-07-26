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

function App() {
  const { login, userData, invokeSetLogin } = useContext(LoginContext)
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
      <Routes>
        <Route path="/" element={login ? <StudentPage /> : <LandingPage invokeSetLogin={invokeSetLogin} />} />
        <Route path="/createAccount" element={<CreateAccountModal />} />
      </Routes>
    </div>
  );
}

export default App;
