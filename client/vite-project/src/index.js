let express= require('express')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let User=require('./User')
let mongoose= require('mongoose')
let Upload =require('./Upload')
let Comment = require('./Comment')
require('dotenv').config()
mongoose.connect(process.env.Mongo_URL).then(()=>{
    console.log("db.....");
    
})
let cors= require('cors')

let app=  express()
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.send("hello")

})



app.post("/signUp", async (req, res) => {
    try {
      const { name, email, passWord } = req.body;
      console.log(req.body,"hehehe");
      
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ msg: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(passWord, 10);
      const newUser = new User({ name, email, passWord: hashedPassword });
      await newUser.save();
  
      res.json({ msg: "Signup successful", user: newUser });
    } catch (err) {
     return  res.status(500).json({ msg: "Error during signup", error: err.message });
    }
  });


  app.post("/login", async (req, res) => {
    try {
      const { email, passWord } = req.body;
      const user = await User.findOne({ email });
      console.log(user ,"user");
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      console.log("Plain Password:", passWord);
  console.log("Hashed from DB:", user.passWord);
  
      const isMatch = await bcrypt.compare(passWord, user.passWord);
      if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });
  
     const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role || "user" },
    "SECRET123",
    { expiresIn: "1h" }
  );
  
  
  res.json({
    msg: "Login successful",
    token,
    user: { _id: user._id, name: user.name, email: user.email }
  });
    } catch (err) {
     return res.status(500).json({ msg: "Error during login", error: err.message });
    }

})



// middleware/auth.js


let auth = function(req, res, next) {
    const token = req.headers.authorization;
    console.log("header",req.headers)
    console.log("hello",token);
    if (!token) return res.status(401).json({ message: "Login first!" });

    try {
        const decoded = jwt.verify(token, "SECRET123");
        console.log(decoded,"kyaya ");
        
        req.user = decoded;   // IMPORTANT: req.user yahi se aata hai
        console.log("decoded",decoded);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
app.post('/upload', auth, async (req, res) => {
  const userId = req.user._id;
  const { imgUrl } = req.body;

  if(!imgUrl){
    return res.status(400).json({ msg: "URL not found" });
  }

  const uploadD = new Upload({
    imgUrl,
    user: userId,
    likedBy: []
  });

  await uploadD.save();

  res.json({
    msg: "uploaded",   
  });
});


app.get("/upload", auth, async (req, res) => {
  try {
    const posts = await Upload.find()
      .populate("user", "name email")   
      .sort({ createdAt: -1 });         

    res.json(posts);
  } catch (err) {
    console.error("GET /upload error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


app.get("/my-posts", auth, async (req, res) => {
  try {
    const posts = await Upload.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("GET /my-posts error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});



app.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-passWord") // password mat bhejna
      .populate("followers", "name email")
      .populate("following", "name email");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      followers: user.followers || [],
      following: user.following || [],
    });
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});



app.post("/like/:id", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
console.log(postId,"hehe");

    const post = await Upload.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

   
    post.likedBy = post.likedBy.filter(id => id !== null);


    const alreadyLiked = post.likedBy.some(
      id => id.toString() === userId.toString()
    );

    //unlike
    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
      post.likeCount = Math.max(0, post.likeCount - 1);

      await post.save();
      return res.json({
        success: true,
        message: "Disliked",
        likeCount: post.likeCount
      });
    }

    // --------------------------------
    //  LIKE (agar pehle like nahi kiya)
    // --------------------------------
    post.likedBy.push(userId);
    post.likeCount += 1;

    await post.save();
    return res.json({
      success: true,
      message: "Liked",
      likeCount: post.likeCount
    });

  } catch (err) {
    console.log("LIKE API ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.post("/follow/:id",auth,async(req,res)=>{
  let targetUserId=req.params.id;
  let currentUserId=req.user._id
  console.log(req.user,"hehh");
  
  if(targetUserId==currentUserId){
    res.json({msg:"nashe kam kro thoda..."})
  }
    let targetUser=   await User.findById(targetUserId)
   let currentUser=   await User.findById(currentUserId)
   if(!currentUser || !targetUser){
    res.send("user not found")
   }

   let alreadyFollw=currentUser.following.includes(targetUserId)
   console.log(alreadyFollw,"helloo");
   
   if(alreadyFollw){
    currentUser.following=     currentUser.following.filter(
      id=> id.toString()!==targetUserId.toString()
    );
   targetUser.followers=   targetUser.followers.filter(
      id=> id.toString()!==currentUser.toString()

   );

           await currentUser.save();
           await targetUser.save();
         return  res.json("unfollowww.....")
        
   }

    //  followers
    currentUser.following.push(targetUserId)
    targetUser.followers.push(currentUserId)
    await currentUser.save()
    await targetUser.save()
   return res.json({msg:"followed succe......"})
})

//search
app.post("/search",async(req,res)=>{
    let query= req.query.q
    if(!query){
      return res.send("query not found")
    }
    let isMatch= await User.find({
      $or:[
        {name:{$regex:query,$options:"i"}},
        {email:{$regex:query,$options:"i"}},
      ]
    }).select("-passWord")// jo chahiye usko mention karo or jo nahi chahiye usko bhi - se mention kar do ex(-password)
    .limit(1)
    res.json({msg:isMatch})
})

app.post('/comment/:id',async(req,res)=>{
  try{
    const postId = req.params.id;
    const {text, userId}= req.body;
    

    console.log(text,"hehe")
    if(!text ||!userId || !postId){
      return res.status(400).json({msg: "text, userId, postId required"});

    }

    const newComment = new Comment({
      text,
      post: postId,
      user: userId
    });
    await newComment.save();
    return res.status(200).json({
      msg: "Comment added successfully",
      comment: newComment
    });
  } catch (error){
    console.error(error);
    return res.status(500).json({msg: "server error"})
  }
  
});


app.listen(4000,()=>{
    console.log("server running on port no 4000");
    
})