import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, orderBy, query } from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app);

export default function Gallery() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProjects();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "60px auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1>CS Club 포트폴리오</h1>
        <a href="/login" style={{ padding: "8px 16px", border: "1px solid #333", borderRadius: 6, textDecoration: "none", color: "#333" }}>멤버 로그인</a>
      </div>

      {projects.length === 0 ? (
        <div style={{ textAlign: "center", color: "#aaa", marginTop: 60 }}>
          아직 업로드된 작품이 없습니다.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
          {projects.map(project => (
            <div key={project.id} style={{ border: "1px solid #eee", borderRadius: 10, overflow: "hidden" }}>
              {project.imageUrl && (
                <img src={project.imageUrl} alt={project.title}
                  style={{ width: "100%", height: 180, objectFit: "cover" }} />
              )}
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: "0 0 8px" }}>{project.title}</h3>
                <p style={{ color: "#666", fontSize: 14, margin: "0 0 8px" }}>{project.description}</p>
                <p style={{ color: "#aaa", fontSize: 12, margin: 0 }}>by {project.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}