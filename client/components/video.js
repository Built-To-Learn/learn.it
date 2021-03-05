import React, { Component } from 'react'

const io = require('socket.io-client')
const socket = io()

class Video extends Component {
    constructor(props) {
        super(props)
        this.state = {
            img: '',
        }
    }
    componentDidMount() {
        // const video = document.querySelector('video')
        // request access to webcam
        // navigator.mediaDevices
        //     .getUserMedia({ video: { width: 426, height: 240 } })
        //     .then((stream) => (video.srcObject = stream))
        // returns a frame encoded in base64
        // const getFrame = () => {
        //     const canvas = document.createElement('canvas')
        //     canvas.width = video.videoWidth
        //     canvas.height = video.videoHeight
        //     canvas.getContext('2d').drawImage(video, 0, 0)
        //     const data = canvas.toDataURL('image/png')
        //     return data
        // }
        // const FPS = 60
        // socket.on('connect', () => {
        //     console.log(socket.id)
        //     setInterval(() => {
        //         socket.emit('stream', getFrame())
        //     }, 1000 / FPS)
        //     socket.on('receiving', (data) => {
        //         this.setState({ img: data })
        //     })
        // })
    }
    render() {
        return (
            <div>
                {/* <video autoPlay></video>
                <img src={this.state.img} /> */}
            </div>
        )
    }
}

export default Video
