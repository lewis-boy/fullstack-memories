import * as api from '../api/index';
import { FETCH_BY_SEARCH, FETCH_ALL, FETCH_POST, CREATE, DELETE, LIKE, UPDATE, START_LOADING, END_LOADING,COMMENT } from '../constants/actionTypes';

//action creators
//action creators only have a type and a payload
//redux thunk allows us to specify another arrow function
//fetching all the posts is an asynchronous action because it takes awhile
export const getPosts = (page) => async(dispatch) => {
    try {
        dispatch({type: START_LOADING});
        
        const {data} = await api.fetchPosts(page);
        // console.log(data);
        dispatch({type: FETCH_ALL, payload: data});

        dispatch({type: END_LOADING});


    } catch (error) {
        console.log(error.message);
    }
    
    //with redux thunk, you dont return the action, you dispatch the action
}

export const getPost = (id) => async(dispatch) => {
    try {
        dispatch({type: START_LOADING});

        const {data} = await api.fetchPost(id);
        dispatch({type: FETCH_POST, payload: data});


        dispatch({type: END_LOADING});
    } catch (error) {
        console.log(error);
    }
}

export const getPostsBySearch = (searchQuery) => async(dispatch) => {
    try {
        //we destructure twice because instead of just sending the plain posts back in the backend
        //we instead placed the posts in a new property called data
        dispatch({type: START_LOADING});

        const {data: {data} } = await api.getPostsBySearch(searchQuery);
        dispatch({ type:FETCH_BY_SEARCH, payload: data });

        dispatch({type: END_LOADING});

    } catch (error) {
        console.log(error.message);
    }
}

export const createPost = (post, navigate) => async(dispatch) => {
    try {
        dispatch({type: START_LOADING});

        const { data } = await api.createPost(post);
        navigate(`/posts/${data._id}`);
        dispatch({ type:CREATE, payload: data});

        // dispatch({type: END_LOADING});
    } catch (error) {
        console.log(error.message);
    }
}

export const updatePost = (id, post) => async(dispatch) => {
    try {
        const{ data } = await api.updatePost(id, post);
        dispatch({type: UPDATE, payload:data});
    } catch (error) {
        console.log(error.message);
    }
}

export const deletePost = (id) => async(dispatch) => {
    try {
        await api.deletePost(id);

        dispatch({type:DELETE, payload: id});
    } catch (error) {
        console.log(error);
    }
}

export const likePost = (id) => async(dispatch) => {
    try {
        const {data} = await api.likePost(id);
        dispatch({type:LIKE, payload:data})

    } catch (error) {
        console.log(error);
    }
}

export const commentPost = (value, id) => async(dispatch) => {
    try {
        const {data} = await api.commentPost(value,id);
        dispatch({type:COMMENT, payload:data});

        return data.comments;
    } catch (error) {
        console.log(error);
    }
}