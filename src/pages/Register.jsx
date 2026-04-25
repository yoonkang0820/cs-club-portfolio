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
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 24 }}>
      <h2>클럽 멤버 회원가입</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input placeholder="이메일" value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }} />
        <input type="password" placeholder="비밀번호 (6자 이상)" value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }} />
        <button type="submit" style={{ width: "100%", padding: 10 }}>회원가입</button>
      </form>
      <p>이미 계정이 있으신가요? <a href="/login">로그인</a></p>
    </div>
  );
}