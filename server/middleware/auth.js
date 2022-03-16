import jwt from 'jsonwebtoken';

//first get token
//find out if it is from google or custom
const auth = async(req,res,next) => {
    try {
        // console.log(req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;
        
        let decodedData;

        if(token && isCustomAuth){
            //verify is the way we extract the info from the token 
            //verify also decodes after checking the signature
            //we are getting their id from the token 
            decodedData = jwt.verify(token,'test');
            req.userId = decodedData?.id;
        }else{
            //sub is googles name for a specific id
            //since we dont know the signature for google tokens, we just use the decode function
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        next();

    } catch (error) {
        console.log(error);
    }
}
export default auth;