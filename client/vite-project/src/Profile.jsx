import { Link } from "react-router-dom";

const Profile = () => {
  const dummyUser = {
    name: "its_anjaliii",
    email: "anjali5512@gmail.com",
    followersCount: 120,
    followingCount: 180,
    postsCount: 9,
  };

  const dummyPosts = [
    "https://images.unsplash.com/photo-1761839257664-ecba169506c1?q=80",
    "https://images.unsplash.com/photo-1761839258513-099c3121d72d?q=80",
    "https://images.unsplash.com/photo-1761839257845-9283b7d1b933?q=80",
    "https://images.unsplash.com/photo-1761839256601-e768233e25e7?q=80",
    "https://images.unsplash.com/photo-1761839257664-ecba169506c1?q=80",
    "https://images.unsplash.com/photo-1761839258513-099c3121d72d?q=80",
    "https://images.unsplash.com/photo-1761839257845-9283b7d1b933?q=80",
    "https://images.unsplash.com/photo-1761839256601-e768233e25e7?q=80",
    "https://images.unsplash.com/photo-1761839257664-ecba169506c1?q=80",
  ];

  return (
    <div className="bg-black min-h-screen flex text-white">
      {/* <Sidebar /> */}

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-[245px] px-8 py-10">

        {/* TOP SECTION */}
        <div className="flex gap-14 items-center mb-10">
          {/* Profile Picture */}
          <div className="rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 to-pink-600">
            <img
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${dummyUser.name}`}
              className="w-36 h-36 rounded-full bg-black p-[2px]"
              alt="profile"
            />
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-4 mb-4">
               
              <h2 className="text-2xl font-light">{dummyUser.name}</h2>
               
              <button className="bg-[#262626] px-4 py-1 rounded text-sm">
                Edit profile
               
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mb-3 text-sm">
              <p><span className="font-semibold">{dummyUser.postsCount}</span> posts</p>
              <p><span className="font-semibold">{dummyUser.followersCount}</span> followers</p>
              <p><span className="font-semibold">{dummyUser.followingCount}</span> following</p>
            </div>

            {/* Bio */}
            <p className="text-sm font-semibold">{dummyUser.name}</p>
            <p className="text-gray-300 text-sm">{dummyUser.email}</p>
            <p className="text-gray-400 text-sm mt-1">Building apps | MERN Stack | Teacher 👨‍🏫</p>
          </div>
        </div>

        {/* LINE */}
        <div className="border-t border-[#262626] w-full"></div>

        {/* Tabs */}
        <div className="flex justify-center gap-8 text-xs uppercase tracking-widest text-gray-400 mt-4 mb-4">
          <button className="flex gap-1 items-center text-white border-t border-white pt-2">
            <svg
              aria-label="Posts"
              fill="currentColor"
              height="12"
              viewBox="0 0 24 24"
              width="12"
            >
              <rect fill="none" height="18" width="18" x="3" y="3" stroke="currentColor" strokeWidth="2"></rect>
              <line stroke="currentColor" strokeWidth="2" x1="3" x2="21" y1="9" y2="9"></line>
              <line stroke="currentColor" strokeWidth="2" x1="3" x2="21" y1="15" y2="15"></line>
              <line stroke="currentColor" strokeWidth="2" x1="9" x2="9" y1="3" y2="21"></line>
              <line stroke="currentColor" strokeWidth="2" x1="15" x2="15" y1="3" y2="21"></line>
            </svg>
            Posts
          </button>
        </div>

        {/* POSTS GRID */}
        <div className="grid grid-cols-3 gap-1 md:gap-6 mt-4">
          {dummyPosts.map((img, i) => (
            <div key={i} className="group relative cursor-pointer">
              <img
                src={img}
                className="w-full h-full object-cover aspect-square"
                alt="post"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 transition">
                <span className="flex items-center text-lg gap-2">
                  ❤️ {Math.floor(Math.random() * 200)}
                </span>
                <span className="flex items-center text-lg gap-2">
                  💬 {Math.floor(Math.random() * 50)}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Profile;