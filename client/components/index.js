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
export { default as Landing } from './landing';
export { default as Broadcaster } from './broadcaster';
export { default as Watcher } from './watcher';
export { Login, Signup } from './auth-form';
export { default as Dashboard } from './dashboard';
export { default as Parallax } from './parallax';
export { default as FindAClass } from './find-a-class';
export { default as CreateAClass } from './create-class';
export { default as CourseCard } from './course-card';
export { default as CoursesView } from './courses-view';
export { default as ViewCourses } from './view-courses';
export { default as ClassSearch } from './find-a-class-search';
export { default as Questions } from './questions';
export { default as Modal } from './modal';

// Onboarding / Payment Components
export { default as StripeOnboard } from './onboard_stripe';
export { default as SuccessfulOnboard } from './onboard_success';
export { default as FailedOnboard } from './onboard_failed';
export { default as Tip } from './tip';
export { default as Earnings } from './earnings';

export { default as ViewParticipants } from './viewParticipants';
export { default as AssociatedCourses } from './associated-courses';
export { default as EnrolledCourses } from './enrolled-courses';
export { default as Settings } from './settings_sidebar';
export { default as AccountInfo } from './account_info';
export { default as Breakout } from './breakout';
export { default as Chatroom } from './breakout-video';
export { default as ClassOptions } from './class-options';
export { default as TaughtCourses } from './taught-courses';
export { default as SingleCourseView } from './single-course-view';
export { default as ResourceUpload } from './resource-upload';
export { default as Resources } from './resources';
export { default as Discussion } from './discussion';
