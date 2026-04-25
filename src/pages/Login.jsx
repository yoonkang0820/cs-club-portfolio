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
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 24 }}>
      <h2>클럽 멤버 로그인</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input placeholder="이메일" value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }} />
        <input type="password" placeholder="비밀번호" value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }} />
        <button type="submit" style={{ width: "100%", padding: 10 }}>로그인</button>
      </form>
      <p>계정이 없으신가요? <a href="/register">회원가입</a></p>
    </div>
  );
}