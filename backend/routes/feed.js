const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed");

const router = express.Router();
const isAuth = require('../middlewares/isAuth')

// GET /feed/posts
router.get("/posts", feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],isAuth,
  feedController.createPost
);

router.get('/post/:postId',[
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
],isAuth,feedController.getPost);

router.put('/post/:postId',isAuth,feedController.updatePost);

router.delete('/post/:postId',isAuth,feedController.deletePost);



module.exports = router;
