const {validationResult} = require('express-validator')

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        creator: {
          name: "haben",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    res.status(403).json({
      message:'Validation failed', err: errors.array()
    })
  }
  const title = req.body.title;
  const content = req.body.content;
  console.log(req.body);
  // Create post in db
  res.status(201).json({
    message: "Post created successfully!",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator: {
        name: "haben",
      },
      createdAt: new Date(),
    },
  });
};
