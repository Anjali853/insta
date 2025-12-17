// function doLike(id) {
//   axios.post(`http://localhost:4000/like/${id}`)
//     .then(res => {
//       alert("Liked!");
//       console.log("Likes:", res.data.likes);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// }

import axios from "axios";
import {useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const API = "http://localhost:4000";
// import React from "react";
// import "./Home.css";
const Home = () => {
    const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null); // current logged-in user
  const [commentInputs, setCommentInputs] = useState({}); // { postId: "text" }
  const [commentCounts, setCommentCounts] = useState({}); // local counts fallback
  const navigate = useNavigate();

  //  Agar token nahi hai to login page pe bhej do
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // login page
    } else {
      // try get current user (for userId)
      (async () => {
        try {
          const res = await axios.get(`${API}/me`, {
            headers: { Authorization: token },
          });
          setMe(res.data);
        } catch (err) {
          console.warn("GET /me failed:", err?.response?.data || err.message);
        }
      })();
    }
  }, [navigate]);

  // Backend se posts loooooooo 
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API}/upload`, {
          headers: {
            Authorization: token, // backend me req.headers.authorization directly use ho raha hai
          },
        });

        // Backend se: imgUrl, user:{name}, likeCount...
        const mapped = res.data.map((p) => ({
          _id: p._id,
          ImgUrl: p.imgUrl,
          name: p.user?.name || "unknown_user",
          likeCount: p.likeCount || 0,
          // agar backend comments ka count deta hai use karo, warna 0
          commentsCount: p.commentsCount ?? 0,
        }));

        //commentsssssssssssssssssssssss
        const counts = {};
        mapped.forEach((m) => {
          counts[m._id] = m.commentsCount || 0;
        });
        setCommentCounts(counts);

        setPosts(mapped);
      } catch (err) {
        console.error("FETCH POSTS ERROR:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  //  like/unlike using backend /like/:id
  const handleLike = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      navigate("/");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/like/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const { likeCount, message } = res.data;

      setPosts((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                ...p,
                likeCount: likeCount ?? p.likeCount,
              }
            : p
        )
      );

      setLikedPosts((prev) => {
        const updated = new Set(prev);
        if (message === "Liked") updated.add(id);
        else if (message === "Disliked") updated.delete(id);
        else {
          if (updated.has(id)) updated.delete(id);
          else updated.add(id);
        }
        return updated;
      });
    } catch (err) {
      console.error("LIKE API ERROR:", err);
      alert("Like failed, check console.");
    }
  };

  const handleSave = (postId) => {
    setSavedPosts((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(postId)) newSaved.delete(postId);
      else newSaved.add(postId);
      return newSaved;
    });
  };

  // ============================
  // Comments: frontend handlers
  // ============================

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const postComment = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      navigate("/");
      return;
    }

    const text = (commentInputs[postId] || "").trim();
    if (!text) {
      alert("Please type a comment.");
      return;
    }

    // userId: prefer using `me` fetched from /me; fallback try localStorage 'user'
    const userId = me?._id ?? JSON.parse(localStorage.getItem("user") || "{}")._id;
    if (!userId) {
      alert("User info missing. Login again.");
      return;
    }

    try {
      // your backend endpoint: POST /:postId  (body: { text, userId })
      const res = await axios.post(
        `${API}/${postId}`,
        { text, userId },
        { headers: { Authorization: token } }
      );

      // success
      console.log("COMMENT API RES:", res.data);

      // clear input for that post
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));

      // optimistic increment of local comment count
      setCommentCounts((prev) => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1,
      }));

    
    } catch (err) {
      console.error("POST COMMENT ERROR:", err?.response ?? err.message);
      alert("Comment failed — check console.");
    }
  };

  return (
    <div className="insta-page">

      {/* LEFT SIDEBAR */}
      <div className="left-sidebar">
        <h1 className="insta-logo">Instagram</h1>

        <ul className="sidebar-menu">
          <li><i className="fa-solid fa-house"></i> Home</li>
          <li><i className="fa-solid fa-magnifying-glass"></i> Search</li>
          <li><i className="fa-regular fa-compass"></i> Explore</li>
          <li><i className="fa-solid fa-clapperboard"></i> Reels</li>
          <li><i className="fa-brands fa-facebook-messenger"></i> Messages</li>
          <li><i className="fa-regular fa-heart"></i> Notifications</li>
          <Link  to={'/upload'} >  
          <li><i className="fa-solid fa-plus"></i> Create</li>
           </Link>
           <Link to={'/profile'}>
          <li><i className="fa-regular fa-user"></i> Profile</li>
          </Link>
        </ul>
      </div>

      {/* CENTER FEED */}
      <div className="center-feed">

  {/* STORIES */}
  <div className="stories-row">
    {["you", "cat1", "cat2", "cat3"].map((name, index) => (
      <div className="story" key={index}>
        <img
          src={`https://cataas.com/cat?width=150&height=150&v=${index}`}
          alt="cat"
        />
        <p>{name}</p>
      </div>
    ))}
  </div>

  {/* POSTS */}
  {loading && <p style={{ color: "gray" }}>Loading posts...</p>}

  {posts.map((post) => (
    <div
      key={post._id}
      className="bg-[#121212] rounded-xl overflow-hidden"
    >

      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">

          <div className="rounded-full p-[2px] bg-gradient-to-tr from-pink-500 to-yellow-500">
            <div className="bg-black rounded-full p-[2px]">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={post.imgUrl}
                alt={post.user?.name}
              />
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-semibold">
              {post.user?.name || "unknown"}
            </p>
            <p className="text-gray-400 text-xs">Original audio</p>
          </div>

        </div>

        <button className="text-white hover:opacity-80">
          <svg
            aria-label="More options"
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="6" cy="12" r="1.5" />
            <circle cx="18" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Post Image */}
    <div className="space-y-6">
  {posts.map((post) => (
    <div
      key={post._id}
      className="bg-[#121212] rounded-xl overflow-hidden"
    >

      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">

          <div className="rounded-full p-[2px] bg-gradient-to-tr from-pink-500 to-yellow-500">
            <div className="bg-black rounded-full p-[2px]">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={post.imgUrl}
                alt={post.user?.name}
              />
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-semibold">
              {post.user?.name || "unknown"}
            </p>
            <p className="text-gray-400 text-xs">Original audio</p>
          </div>

        </div>

        <button className="text-white hover:opacity-80">
          <svg
            aria-label="More options"
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="6" cy="12" r="1.5" />
            <circle cx="18" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Post Image */}
      <div className="relative aspect-square">
        <img
          className="w-full h-full object-cover"
          src={post.imgUrl}
          alt="post"
          onDoubleClick={() => handleLike(post._id)}
        />
      </div>

      {/* Like Count */}
      <div className="p-3 text-white text-sm">
        ❤️ {post.likeCount || 0} likes
      </div>

    </div>
  ))}
</div>

    </div>
  ))}

</div>



      {/* RIGHT SIDEBAR */}
      <div className="right-sidebar">
        <h3>Suggested for you</h3>

        <div className="suggest-user">
          <img src="https://cataas.com/cat?width=200&height=200" alt="cat" />
          <div>
            <p>samvad__</p>
            <small>Follows you</small>
          </div>
          <button className="follow-btn">Follow</button>
        </div>

        <div className="suggest-user">
          <img src="https://cataas.com/cat?width=150&height=150" alt="cat" />
          <div>
            <p>aryan_dev</p>
            <small>Suggested</small>
          </div>
          <button className="follow-btn">Follow</button>
        </div>
      </div>

    </div>
  );
};
  

export default Home;






// mongodb+srv://anjali19:<db_password>@cluster0.lkgew0o.mongodb.net/


///meeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee



// import axios from "axios";
// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const API = "http://localhost:4000";

// const Home = () => {
//   const [posts, setPosts] = useState([]);
//   const [me, setMe] = useState(null);
//   const navigate = useNavigate();

//   // 🔐 Check login
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/");
//       return;
//     }

//     axios
//       .get(`${API}/me`, {
//         headers: { Authorization: token },
//       })
//       .then((res) => setMe(res.data))
//       .catch(() => navigate("/"));
//   }, [navigate]);

//   // 📥 Fetch posts
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     axios.get(`${API}/upload`, {
//   headers: { Authorization: token },
// })
// .then((res) => {
//   const fixedPosts = res.data.map((p) => ({
//     ...p,
//     imgUrl: p.imgUrl || p.ImgUrl || p.imageUrl || "",
//   }));
//   setPosts(fixedPosts);
// })

      
//       .catch((err) => console.error("FETCH POST ERROR", err));
//   }, []);
// console.log(posts);

//   return (
//     <div className="insta-page">

//       {/* LEFT SIDEBAR */}
//       <div className="left-sidebar">
//         <h1 className="insta-logo">Instagram</h1>

//         <ul className="sidebar-menu">
//           <li>Home</li>
//           <li>Search</li>
//           <li>Explore</li>
//           <li>Reels</li>
//           <li>Messages</li>
//           <li>Notifications</li>
//           <Link to="/upload"><li>Create</li></Link>
//           <Link to="/profile"><li>Profile</li></Link>
//         </ul>
//       </div>

//       {/* CENTER FEED */}
//      {/* CENTER FEED */}
// {/* CENTER FEED */}
// <div className="center-feed">

//   {/* STORIES */}
//   <div className="stories-row">
//     {["you", "cat1", "cat2", "cat3"].map((name, index) => (
//       <div className="story" key={index}>
//         <img
//           src={`https://cataas.com/cat?width=150&height=150&v=${index}`}
//           alt="cat"
//         />
//         <p>{name}</p>
//       </div>
//     ))}
//   </div>



// {/* POSTS */} 
// {posts.length === 0 && <p style={{ color: "gray" }}>No posts yet</p>}

//  <div className="space-y-6">
//   {posts.length === 0 && (
//     <p className="text-gray-400 text-sm text-center mt-4">
//       No posts yet. Create your first post!
//     </p>
//   )}

//   {posts.map((post) => (
//     <div
//       key={post._id}
//       className="bg-[#121212] rounded-xl overflow-hidden border border-zinc-800"
//     >
//       {/* Post Header */}
//       <div className="flex items-center justify-between p-3">
//         <div className="flex items-center gap-3">
//           <img
//             src="https://cataas.com/cat?width=100&height=100"
//             className="h-8 w-8 rounded-full object-cover"
//             alt="user"
//           />
//           <div>
//             <p className="text-white text-sm font-semibold">
//               {post.user?.name || "unknown"}
//             </p>
//             <p className="text-gray-400 text-xs">Original audio</p>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Post Image */}
//       <img
//         src={post.imgUrl}   
//         alt="post"
//         className="w-full object-cover max-h-[500px]"
//       />

//       {/* Likes */}
//       <div className="p-3 text-sm text-gray-300">
//         ❤️ {post.likeCount || 0} likes
//       </div>
//     </div>
//   ))}
// </div>



// </div>



//       {/* RIGHT SIDEBAR */}
//       <div className="right-sidebar">
//         <h3>Suggested for you</h3>

//         <div className="suggest-user">
//           <img src="https://cataas.com/cat?width=50&height=50" alt="" />
//           <p>samvad__</p>
//           <button>Follow</button>
//         </div>

//         <div className="suggest-user">
//           <img src="https://cataas.com/cat?width=50&height=50" alt="" />
//           <p>aryan_dev</p>
//           <button>Follow</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
