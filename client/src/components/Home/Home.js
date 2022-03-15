import React, {useState, useEffect} from 'react';
import {Container, Grow, Grid, Paper, AppBar, TextField, Button} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import { useNavigate, useLocation} from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import {getPosts, getPostsBySearch} from '../../actions/posts';
import Posts from '../Posts/Posts';
import Pagination from '../Pagination';
import Form from '../Form/Form';
import useStyles from './styles';

function useQuery(){
    return new URLSearchParams(useLocation().search)
}

const Home = () => {
    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState('');
    const[tags,setTags] = useState([]);

    //BIG ERROR!!! when home gets reloaded it automatically reloads Pagination which fires the fetch all get request for page 1
    //we need to stop it from doing that if it is a search request

    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const query = useQuery();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');

    //dispatch is in the dependency array because React told us to place it in there
    //we have currentId in here, so every time we delete or update, we want to get the new version of all the posts
    //so we always fetch all the posts right after we do any change

    const searchPost = () => {
        if(search.trim() || tags){
            dispatch(getPostsBySearch({search, tags:tags.join(',') }));
            navigate(`/posts/search?searchQuery=${ search || 'none' }&tags=${ tags.join(',') }`);
        }
        else{
            navigate("/");
        }
    }

    const handleKeyPress = (e) => {
        //13 is the ENTER key
        if(e.keyCode === 13){
            //search for post
            searchPost();
        }
    }

    const handleAdd = (tag) => {
        setTags([...tags, tag]);
    }
    const handleDelete = (tagToDelete) => {
        setTags(tags.filter((tag) => tag !== tagToDelete))
    }

    //grow is just for animation  NAVBAR is unaffected
  return (<Grow in>
                <Container maxWidth='xl'>
                    <Grid className={classes.gridContainer} container justifyContent="space-between" alignItems="stretch" spacing={3}>
                        <Grid item xs={12} sm={6} md={9}>
                            <Posts setCurrentId={setCurrentId} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <AppBar className={classes.appBarSearch} position='static' color='inherit'>
                                <TextField 
                                    name='search' 
                                    variant='outlined' 
                                    label='Search Memories' 
                                    fullWidth 
                                    value={search} 
                                    onChange={(e)=>setSearch(e.target.value)}
                                    onKeyPress={handleKeyPress} 
                                />
                                <ChipInput 
                                    style={{ margin: '10px 0'}}
                                    value={tags}
                                    onAdd = {handleAdd}
                                    onDelete = {handleDelete}
                                    label='Search Tags'
                                    variant='outlined'
                                />
                                <Button variant='contained' color='primary' onClick={searchPost}>
                                    Search
                                </Button>


                            </AppBar>
                            <Form currentId={currentId} setCurrentId={setCurrentId} />
                            {/* always think of conditional rendering when trying to stop certain components from firing  */}
                            {(!searchQuery && !tags.length) && 
                                <Paper elevation={6} className={classes.pagination}>
                                    <Pagination page={page} />
                                </Paper>
                            }
                        </Grid>
                    </Grid>
                </Container>
            </Grow>);
};

export default Home;
