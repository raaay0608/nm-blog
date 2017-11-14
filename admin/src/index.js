import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

import './index.css'
import './include/bootstrap'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker()
