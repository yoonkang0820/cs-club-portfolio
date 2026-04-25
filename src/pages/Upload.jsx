import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../firebase";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "cs_club_upload");
        formData.append("cloud_name", "dejqdn4n0");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dejqdn4n0/image/upload",
          { method: "POST", body: formData }
        );
        const data = await res.json();
        imageUrl = data.secure_url;
      }

      await addDoc(collection(db, "projects"), {
        title,
        description,
        imageUrl,
        author: auth.currentUser.email,
        createdAt: new Date(),
      });

      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      alert("업로드 실패! 다시 시도해주세요.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "60px auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2>작품 업로드</h2>
        <button onClick={handleLogout}
          style={{ padding: "6px 14px", background: "none", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer", color: "#666" }}>
          로그아웃
        </button>
      </div>
      {success && <p style={{ color: "green" }}>업로드 완료! 갤러리로 이동 중...</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="작품 제목" value={title}
          onChange={e => setTitle(e.target.value)} required
          style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }} />
        <textarea placeholder="작품 설명" value={description}
          onChange={e => setDescription(e.target.value)} required rows={4}
          style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }} />
        <input type="file" accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          style={{ display: "block", marginBottom: 12 }} />
        <button type="submit" disabled={loading}
          style={{ width: "100%", padding: 10 }}>
          {loading ? "업로드 중..." : "업로드"}
        </button>
      </form>
      <p><a href="/">갤러리로 돌아가기</a></p>
    </div>
  );
}