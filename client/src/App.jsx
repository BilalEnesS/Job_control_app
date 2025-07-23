import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./App.css";

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => {
        if (!res.ok) throw new Error("Başvurular alınamadı");
        return res.json();
      })
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Başvurularım</h1>
        {loading && <p>Yükleniyor...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="cards">
          {applications.map((app, i) => (
            <div className="card" key={i}>
              <div className="card-content">
                <h2>{app.company_name}</h2>
                <p className="position">{app.position_title}</p>
                <p className="date">Başvuru Tarihi: {new Date(app.applied_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
