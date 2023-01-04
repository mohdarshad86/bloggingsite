const jwt = require("jsonwebtoken");

exports.authMid1 = async (req, res, next) => {
  let token = req.headers["x-api-key"];

  if (!token) {
    return res
      .status(401)
      .send({ status: false, msg: "Header is not present" });
  }

  let decodedToken = jwt.verify(token, "project-blogging");
  if (!decodedToken) {
    return res.status().send({ status: false, msg: "Invalid Token" });
  
  }
    let  editUser = req.params.blogId

    let userCheck = decodedToken.authorId
    if(userCheck != editUser) return res.status(403).send({status : false, msg : "u are not a valid authorisor"})
  
   //req.id = decodedToken
  next()
};


 /**exports.authMid2 = async (req,res,next) => {
  let  editUser = req.params.authorId

  let userCheck = decodedToken.authorId
  if(userCheck != editUser) return res.status(403).send({status : false, msg : "u are not a valid authorisor"})

  next()

}  */
