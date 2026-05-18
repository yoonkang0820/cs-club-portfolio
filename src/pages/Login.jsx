import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/upload");
    } catch (err) {
      setError("이메일 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: 40, background: "#161616", border: "1px solid #222", borderRadius: 12 }}>
        <p style={{ color: "#7ee787", fontFamily: "monospace", fontSize: 13, marginBottom: 8 }}>// cs club</p>
        <h2 style={{ color: "#fff", marginBottom: 24, fontSize: 22 }}>멤버 로그인</h2>
        {error && <p style={{ color: "#ff6b6b", marginBottom: 16, fontSize: 13 }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <label style={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}>email</label>
          <input placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ marginBottom: 16, marginTop: 4 }} />
          <label style={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}>password</label>
          <input type="password" placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ marginBottom: 24, marginTop: 4 }} />
          <button type="submit">로그인</button>
        </form>
        <p style={{ marginTop: 20, fontSize: 13, color: "#666", textAlign: "center" }}>
          계정이 없으신가요? <a href="/register">회원가입</a>
        </p>
      </div>
    </div>
  );
}