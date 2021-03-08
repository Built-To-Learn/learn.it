import React from 'react'

import { Navbar } from './components'
import Parallax from './components/parallax.js'
import Icons from './components/icons.js'

import Routes from './routes'

const App = () => {
    return (
        <div>
            <Navbar />
            <Parallax />
            <Icons />
            <Routes />
        </div>
    )
}

export default App
