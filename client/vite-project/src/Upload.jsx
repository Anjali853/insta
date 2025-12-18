import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pozvjfqfuddrbonopenm.supabase.co";
const supabasekey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvenZqZnFmdWRkcmJvbm9wZW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2OTgyOTIsImV4cCI6MjA3OTI3NDI5Mn0.dvm7dcV-d6DUm7Q0CnLD51EK9uUgTAv0RaEz8_oLTec";

const supabase = createClient(supabaseUrl, supabasekey);

const Upload = () => {
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImg(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token || !img) {
      alert("Login / Image missing");
      return;
    }

    try {
      
      const path = `insta_images/${Date.now()}_${img.name}`;

await supabase.storage.from("insta").upload(path, img);

const imgUrl =
  `${supabaseUrl}/storage/v1/object/public/insta/${path}`;

await axios.post(
  "https://insta-1-v1mq.onrender.com/upload",
  { imgUrl },
  { headers: { Authorization: token } }
);


      alert("Post uploaded ✅");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {preview && <img src={preview} alt="preview" width="200" />}

        <button disabled={loading}>
          {loading ? "Uploading..." : "Post"}
        </button>
      </form>
    </div>
  );
};


export default Upload;