import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../firebase";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);
const db = getFirestore(app);

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "cs_club_upload");
  formData.append("cloud_name", "dejqdn4n0");
  const res = await fetch("https://api.cloudinary.com/v1_1/dejqdn4n0/image/upload", {
    method: "POST", body: formData
  });
  const data = await res.json();
  return data.secure_url;
}

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [outputImage, setOutputImage] = useState(null);
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
      let outputImageUrl = "";
      if (outputImage) outputImageUrl = await uploadImage(outputImage);

      await addDoc(collection(db, "projects"), {
        title,
        description,
        code,
        outputImageUrl,
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
    <div style={{ minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <p style={{ color: "#7ee787", fontFamily: "monospace", fontSize: 13, marginBottom: 4 }}>// cs club</p>
            <h2 style={{ color: "#fff", fontSize: 22 }}>작품 업로드</h2>
          </div>
          <button onClick={handleLogout}
            style={{ padding: "6px 14px", background: "none", border: "1px solid #333", borderRadius: 6, cursor: "pointer", color: "#666", fontSize: 13 }}>
            로그아웃
          </button>
        </div>

        {success && <p style={{ color: "#7ee787", marginBottom: 16, fontFamily: "monospace" }}>✓ 업로드 완료! 갤러리로 이동 중...</p>}

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}>title</label>
          <input placeholder="작품 제목" value={title}
            onChange={e => setTitle(e.target.value)} required
            style={{ marginBottom: 20, marginTop: 4 }} />

          <label style={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}>description</label>
          <textarea placeholder="어떤 프로그램인지, 어떻게 만들었는지 설명해주세요"
            value={description} onChange={e => setDescription(e.target.value)} required rows={3}
            style={{ marginBottom: 20, marginTop: 4 }} />

          <label style={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}>code</label>
          <textarea placeholder="// 여기에 코드를 붙여넣어주세요"
            value={code} onChange={e => setCode(e.target.value)} rows={10}
            style={{ marginBottom: 20, marginTop: 4, fontFamily: "monospace", fontSize: 13, background: "#0d0d0d", color: "#d4d4d4" }} />

          <label style={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}>output image</label>
          <input type="file" accept="image/*"
            onChange={e => setOutputImage(e.target.files[0])}
            style={{ marginBottom: 24, marginTop: 4, background: "none", border: "1px solid #333", color: "#888" }} />

          <button type="submit" disabled={loading}>
            {loading ? "업로드 중..." : "업로드"}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 13, textAlign: "center" }}>
          <a href="/">갤러리로 돌아가기</a>
        </p>
      </div>
    </div>
  );
}