import PostMessage from "../models/postMessage.js";
import mongoose from 'mongoose';

export const getPost = async (req,res) => {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);

    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const getPosts = async (req, res) => {
    const { page } = req.query;
    //when you pass page through the req.query it becomes a String, so you need to convert it back to a number
    try {
        const LIMIT = 8;
        const startIndex = (Number(page)-1) * LIMIT;
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex);

        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT) });

    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const getPostsBySearch = async(req,res) => {
    const {searchQuery, tags} = req.query;
    try {
        // the i flag ignores casing so Test test TEST are all the same
        //we used RegExp because it makes it easier for mongo db to search the database 
        const title = new RegExp(searchQuery, 'i');

        //$or means find me all the posts that meet/match either one of the criteria 
        //left side is for the PostMessage table
        //the right side is what you are providing for it 
        //$in means is any element in our array equal to the tags in the table
       const posts = await PostMessage.find({ $or: [{title}, {tags: {$in:tags.split(',')} }]})

       res.json({data: posts});
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});
    
    try {
        await newPost.save();
        
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({message : error.message});
    }
}

export const updatePost = async (req, res) => {
    const {id: _id} = req.params;
    const post = req.body;

    //check if the id from the params is a valid Mongoose database id
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that ID");

    //we add that object so we can receive that updated version back to us and store it in a variable
    //we add _id because post has every field but the id
    //if we update without the id, the id will be erased
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new:true});

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that ID");
    
    await PostMessage.findByIdAndDelete(id);

    res.json({message: "Post deleted successfully."});
}

export const likePost = async (req, res) => {
    const {id} = req.params;

    if(!req.userId) return res.json({message: "Unauthenticated"});

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that ID");

    //you need to grab the previous post first because you dont know the currentLike count before you increment
    const post = await PostMessage.findById(id);

    //check to see if this user has already liked this post, if not then dislike the post
    const index = post.likes.findIndex((id) => id===String(req.userId))
    if(index === -1){
        //he will like the post
        post.likes.push(req.userId);
    }else{
        //You must convert req.userId to a String 
        //maybe all header parameters are like this
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});

    res.json(updatedPost);
}

export const commentPost = async(req,res) => {
    //post id
    //finalComment
    const {id} = req.params;
    const {value} = req.body;

    const post = await PostMessage.findById(id);
    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new:true});
    res.json(updatedPost);
}