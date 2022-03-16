import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

const app = express();
dotenv.config();

//always specify cors first before any of the routes
app.use(bodyParser.json({ limit: "30mb", extended: "true"}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: "true"}));
app.use(cors());


app.use('/posts', postRoutes);
app.use('/users', userRoutes);
//this is a landing page for Heroku
app.get('/', (req,res) => {
    res.send("Hello to Memories API")
});


const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`)))
    .catch((error) => console.log(error.message));



