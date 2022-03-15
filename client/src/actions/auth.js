import * as api from '../api/index';
import { AUTH } from '../constants/actionTypes';

export const signup = (formData, navigate) => async(dispatch) => {
    try {
        //log in user
        //data has the fields result and token 
        const {data} = await api.signup(formData);

        dispatch({type:AUTH, data});

        navigate("/");
    } catch (error) {
        console.log(error);
    }
}

export const signin = (formData, navigate) => async(dispatch) => {
    try {
        //sign up user
        const {data} = await api.signin(formData);

        dispatch({type:AUTH, data});

        navigate("/");
    } catch (error) {
        console.log(error);
    }
}