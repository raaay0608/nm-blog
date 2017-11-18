/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

import './include/bootstrap'
import './style/content.css'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker()
