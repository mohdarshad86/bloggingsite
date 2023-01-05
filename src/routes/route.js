const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const middleWare = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.post("/authors", authorController.createAuthor);

router.post("/blogs", middleWare.authMid1, blogController.createBlog);

router.get("/authors", authorController.getAuthor);

router.get("/blogs", middleWare.authMid1, blogController.getBlog);

router.post("/login", authorController.loginAuthor);

router.put(
  "/blogs/:blogId",
  middleWare.authMid1,
  middleWare.authMid2,
  blogController.updateBlog
);

router.delete(
  "/blogs/:blogId",
  middleWare.authMid1,
  middleWare.authMid2,
  blogController.deleteBlogByParams
);

router.delete(
  "/blogs",
  middleWare.authMid1,
  
  blogController.DeletedByQuery
);


module.exports = router;
