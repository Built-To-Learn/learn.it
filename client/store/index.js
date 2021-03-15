
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import auth from './auth';
import view from './view';
import payment from './payment';
import courses from './courses.js';
import participants from './participants';
import breakout from './breakout';
import studentBreakout from './student-breakout';
import enrollments from './enrollments'

const reducer = combineReducers({
  auth,
  view,
  courses,
  participants,
  payment,
  breakout,
  studentBreakout,
  enrollments,
});

const middleware = composeWithDevTools(
    applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
)
const store = createStore(reducer, middleware)


export default store;
export * from './auth';
export * from "./payment"

