const AuthReducer = (state, action) => {
  switch(action.type){
    case 'LOGIN_START':
      return {
        user: null,
        posts: null,
        isFetching: true,
        error: false,
      }
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        posts: null,
        isFetching: false,
        error: false,
      }
    case 'LOGIN_FAIL':
      return {
        user: null,
        posts: null,
        isFetching: false,
        error: action.payload
      }
    default:
      return state
  }
}

export default AuthReducer