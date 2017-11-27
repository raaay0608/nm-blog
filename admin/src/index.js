/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

import './include/bootstrap'
import './style/app.css'
import './style/content.css'
import './style/table.css'
import './style/post-editor.css'
import './style/form.css'
import './style/post-image.css'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker()
