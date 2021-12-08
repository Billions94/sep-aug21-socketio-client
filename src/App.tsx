import React from 'react'
import './App.css'
import Home from './components/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import DM from './components/DM'
import { useState } from "react"

function App() {

  const [username, setUsername] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [message, setMessage] = useState('')
  

  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Home username={username} setUsername={setUsername} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
      <Route path='/dm/:id' element={<DM username={username} setUsername={setUsername} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
