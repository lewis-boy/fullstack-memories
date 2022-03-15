import axios from 'axios';

//when we only had one route of /posts
// const url = 'http://localhost:5000/posts';
// 'https://memories-project-lewis.herokuapp.com/posts';
const API = axios.create({ baseURL:'https://memories-project-lewis.herokuapp.com/' });
API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')){
        req.headers.authorization = `Bearer ${ JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
})

// export const fetchPosts = () => axios.get();
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPost = (postId) => API.get(`/posts/${postId}`);

export const getPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const commentPost = (value, id) => API.post(`/posts/${id}/commentPost`, {value});


export const signin = (formData) => API.post('/users/signin', formData);
export const signup = (formData) => API.post('/users/signup', formData);

