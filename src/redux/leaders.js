import * as ActionTypes from './ActionTypes';

export const Leaders = (state = {isLoading: false, errmsg: null, leaders: []}, action) => {
    switch(action.type){
        case (ActionTypes.ADD_LEADERS):
            return {...state, isLoading: false, errmsg: null, leaders: action.payload};

        case (ActionTypes.LEADERS_LOADING):
            return {...state, isLoading: true, errmsg: null, leaders: []};

        case (ActionTypes.LEADERS_FAILED):
            return {...state, isLoading: false, errmsg: action.payload, leaders: []};

        default:
            return state;
    }
};