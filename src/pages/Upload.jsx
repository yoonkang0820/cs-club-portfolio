import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebase";
import schoolLogo from "../assets/school-logo.png";
import csLogo from "../assets/cs-logo.png";

const db = getFirestore(app);
const auth = getAuth(app);

export default function Gallery() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm("정말 삭제할까요?")) return;
    await deleteDoc(doc(db, "projects", projectId));
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selected?.id === projectId) setSelected(null);
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={schoolLogo} alt="Seoul Scholars" style={{ height: 60 }} />
          <img src={csLogo} alt="CS Club" style={{ height: 60 }} />
          <div>
            <p style={{ color: "#7ee787", fontFamily: "monospace", fontSize: 13, marginBottom: 4 }}>// welcome to</p>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>SSI Computer Science Club</h1>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {currentUser && <a href="/upload" style={{ padding: "8px 18px", background: "#7ee787", color: "#0d0d0d", borderRadius: 6, fontSize: 13, fontWeight: 600 }}>+ 업로드</a>}
          <a href={currentUser ? "/upload" : "/login"}
            style={{ padding: "8px 18px", border: "1px solid #333", borderRadius: 6, color: "#aaa", fontSize: 13 }}>
            {currentUser ? "내 작품 올리기" : "멤버 로그인"}
          </a>
        </div>
      </div>

      {projects.length === 0 ? (
        <div style={{ textAlign: "center", color: "#444", marginTop: 80, fontFamily: "monospace" }}>
          $ 아직 업로드된 작품이 없습니다.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {projects.map(project => (
            <div key={project.id} onClick={() => setSelected(project)}
              style={{ background: "#161616", border: "1px solid #222", borderRadius: 10, overflow: "hidden", cursor: "pointer", transition: "border 0.2s", position: "relative" }}
              onMouseEnter={e => e.currentTarget.style.border = "1px solid #7ee787"}
              onMouseLeave={e => e.currentTarget.style.border = "1px solid #222"}>
              {project.outputImageUrl && (
                <img src={project.outputImageUrl} alt={project.title}
                  style={{ width: "100%", height: 180, objectFit: "cover" }} />
              )}
              <div style={{ padding: 16 }}>
                <h3 style={{ color: "#fff", marginBottom: 8, fontSize: 16 }}>{project.title}</h3>
                <p style={{ color: "#888", fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>{project.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ color: "#7ee787", fontSize: 12, fontFamily: "monospace" }}>@{project.author}</p>
                  {currentUser?.email === project.author && (
                    <button onClick={(e) => handleDelete(e, project.id)}
                      style={{ background: "none", border: "1px solid #333", borderRadius: 4, color: "#ff6b6b", fontSize: 11, padding: "3px 8px", cursor: "pointer" }}>
                      삭제
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#161616", border: "1px solid #333", borderRadius: 12, padding: 32, maxWidth: 720, width: "90%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ color: "#fff", fontSize: 20 }}>{selected.title}</h2>
              <button onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#666" }}>✕</button>
            </div>
            <p style={{ color: "#888", marginBottom: 8, lineHeight: 1.6 }}>{selected.description}</p>
            <p style={{ color: "#7ee787", fontSize: 12, fontFamily: "monospace", marginBottom: 24 }}>@{selected.author}</p>

            {selected.outputImageUrl && (
              <>
                <h4 style={{ color: "#aaa", marginBottom: 10, fontSize: 13, fontFamily: "monospace" }}>// output</h4>
                <img src={selected.outputImageUrl} alt="output"
                  style={{ width: "100%", borderRadius: 8, marginBottom: 24, border: "1px solid #333" }} />
              </>
            )}

            {selected.code && (
              <>
                <h4 style={{ color: "#aaa", marginBottom: 10, fontSize: 13, fontFamily: "monospace" }}>// code</h4>
                <pre style={{ background: "#0d0d0d", color: "#d4d4d4", padding: 20, borderRadius: 8, overflowX: "auto", fontSize: 13, lineHeight: 1.7, border: "1px solid #222" }}>
                  {selected.code}
                </pre>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}