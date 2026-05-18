import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/upload");
    } catch (err) {
      setError("회원가입 실패. 이메일 형식 확인 또는 비밀번호 6자 이상!");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: 40, background: "#161616", border: "1px solid #222", borderRadius: 12 }}>
        <p style={{ color: "#7ee787", fontFamily: "monospace", fontSize: 13, marginBottom: 8 }}>// cs club</p>
        <h2 style={{ color: "#fff", marginBottom: 24, fontSize: 22 }}>멤버 회원가입</h2>
        {error && <p style={{ color: "#ff6b6b", marginBottom: 16, fontSize: 13 }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <label style={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}>email</label>
          <input placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ marginBottom: 16, marginTop: 4 }} />
          <label style={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}>password</label>
          <input type="password" placeholder="6자 이상" value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ marginBottom: 24, marginTop: 4 }} />
          <button type="submit">회원가입</button>
        </form>
        <p style={{ marginTop: 20, fontSize: 13, color: "#666", textAlign: "center" }}>
          이미 계정이 있으신가요? <a href="/login">로그인</a>
        </p>
      </div>
    </div>
  );
}