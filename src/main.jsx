import React from 'react'
import ReactDOM from 'react-dom/client'
import { Rotas } from './pages/Routes'
import { connect } from './assets/firebase.js'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Rotas app={connect()} />
  </React.StrictMode>,
)
