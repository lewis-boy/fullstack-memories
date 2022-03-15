import {combineReducers} from 'redux';

import posts from './posts';
import auth from './auth';


export default combineReducers({
    //when key and value are the same
    posts, auth
})