 import * as ActionTypes from './ActionTypes';

export const Comments = (state = {errmsg: null, comments:[]}, action) => {
    switch (action.type) {
        case (ActionTypes.ADD_COMMENTS):
            return {...state, errmsg: null, comments: action.payload};
        
        case (ActionTypes.COMMENTS_FAILED):
            return {...state, errmsg: action.payload}

        case(ActionTypes.ADD_COMMENT):
            var comment = action.payload;
            comment.id = state.comments.length;
            comment.date= new Date().toISOString();
            return {...state, comments: state.comments.concat(comment)};

        default:
          return state;
      }
};