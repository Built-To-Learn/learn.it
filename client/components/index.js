/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export { default as Navbar } from './navbar';
export { default as Home } from './home';
// export { default as Video } from './video';
export { default as VideoChat } from './videochat';
export { default as Chat } from './chat';
export { default as Broadcaster } from './broadcaster';
export { default as Watcher } from './watcher';
export { Login, Signup } from './auth-form';
export { default as Dashboard } from './dashboard';
export { default as Parallax } from "./parallax"
