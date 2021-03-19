import axios from 'axios';
const ENROLL_IN_COURSE = 'ENROLL_IN_COURSE';
const LOAD_ENROLLMENTS = 'LOAD_ENROLLMENTS';

export const _enrollInCourse = (enrollments) => ({
  type: ENROLL_IN_COURSE,
  enrollments,
});

export const _loadEnrollments = (enrollments) => ({
  type: LOAD_ENROLLMENTS,
  enrollments,
});

export const enrollInCourse = (courseId, userId, title) => {
  try {
    return async (dispatch) => {
      const enrollments = (
        await axios.post(`/api/enrollments`, {
          courseId,
          userId,
        })
      ).data;

      dispatch(_enrollInCourse(enrollments));
    };
  } catch (err) {
    console.log(err);
  }
};

export const loadEnrollments = (userId) => {
  return async (dispatch) => {
    const enrollments = (await axios.get(`/api/enrollments/${userId}`)).data;
    dispatch(_loadEnrollments(enrollments));
  };
};

const initialState = [];

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_ENROLLMENTS:
      return action.enrollments;
    case ENROLL_IN_COURSE:
      return action.enrollments;
    // why is this undefeind
    default:
      return state;
  }
}
