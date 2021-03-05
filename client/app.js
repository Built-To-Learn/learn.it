import React from 'react'

import { Navbar, Video } from './components'
import Parallax from './components/parallax.js'

import Routes from './routes'

const App = () => {
    return (
        <div>
            <Navbar />
            <Parallax />
            <Routes />
            <Video />
        </div>
    )
}

export default App
