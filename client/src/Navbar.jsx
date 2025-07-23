import { useEffect, useState } from "react";
import "./Navbar.css";

function formatTimeLeft(ms) {
  if (!ms || ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const min = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const sec = String(totalSeconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

export default function Navbar() {
  const [lastScan, setLastScan] = useState(null);
  const [nextScan, setNextScan] = useState(null);
  const [interval, setIntervalMin] = useState(15);
  const [timeLeft, setTimeLeft] = useState(0);

  // API'den tarama zamanlarını çek
  useEffect(() => {
    const fetchStatus = () => {
      fetch("/api/scan-status")
        .then((res) => res.json())
        .then((data) => {
          setLastScan(data.lastScanTime ? new Date(data.lastScanTime) : null);
          setNextScan(data.nextScanTime ? new Date(data.nextScanTime) : null);
          setIntervalMin(data.intervalMinutes || 15);
        });
    };
    fetchStatus();
    const intervalId = setInterval(fetchStatus, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // Sayaç
  useEffect(() => {
    if (!nextScan) {
      setTimeLeft(0);
      return;
    }
    setTimeLeft(nextScan - new Date());
    const timer = setInterval(() => {
      setTimeLeft(nextScan - new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [nextScan]);

  return (
    <nav className="navbar">
      <div className="navbar-title">Başvurularım</div>
      <div className="navbar-status">
        <span className="scan-label">Son tarama:</span>
        <span className="scan-time">{lastScan ? lastScan.toLocaleTimeString() : "-"}</span>
        <span className="scan-label">| Sonraki tarama:</span>
        <span className="scan-time">{nextScan ? nextScan.toLocaleTimeString() : "-"}</span>
        <span className="scan-label">| Kalan:</span>
        <span className="scan-timer">{formatTimeLeft(timeLeft)}</span>
      </div>
    </nav>
  );
} 