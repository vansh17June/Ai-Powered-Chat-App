const jwt=require("jsonwebtoken");
const AuthenticateUser=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Please login first"})
    }
    const isValidToken=jwt.verify(token,process.env.secretkey);
    if(!isValidToken){
        return res.status(401).json({message:"Please login first"})
    }
    req.user=isValidToken.id;
    next();
}
module.exports=AuthenticateUser;