"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { SECTIONS, EMOJIS, SHOW_DATES } from "../lib/sections";

const CONCERT_NAME = "JuniorMark SunnyMoon Concert";
const VENUE = "Bitec Live";

export default function Page() {
  const [date, setDate] = useState(SHOW_DATES[0]);
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [showList, setShowList] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  async function loadEntries() {
    setLoading(true);
    try {
      const res = await fetch(`/api/register?date=${encodeURIComponent(date)}`);
      const data = await res.json();
      setEntries(data.entries || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
    const interval = setInterval(loadEntries, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const totalCount = useMemo(
    () => Object.values(entries).reduce((sum, arr) => sum + arr.length, 0),
    [entries]
  );

  return (
    <div style={{ color: "#fff", minHeight: "100vh", paddingBottom: 60 }}>
      <Header
        date={date}
        setDate={setDate}
        totalCount={totalCount}
        onShowList={() => setShowList(true)}
      />

      <SeatMap
        entries={entries}
        loading={loading}
        onSectionClick={(id) => setActiveSection(id)}
      />

      {activeSection && (
        <RegisterModal
          sectionId={activeSection}
          date={date}
          onClose={() => setActiveSection(null)}
          onRegistered={(newEntries) => {
            setEntries(newEntries);
            setActiveSection(null);
          }}
        />
      )}

      {showList && (
        <ListPanel entries={entries} onClose={() => setShowList(false)} />
      )}

      {showAdmin && (
        <AdminPanel
          date={date}
          entries={entries}
          onClose={() => setShowAdmin(false)}
          onChanged={setEntries}
        />
      )}

      <button onClick={() => setShowAdmin(true)} style={adminButtonStyle}>
        ⚙️ Admin
      </button>
    </div>
  );
}

function Header({ date, setDate, totalCount, onShowList }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 12px 10px" }}>
      <h1 style={{ fontSize: "clamp(18px, 4vw, 28px)", margin: "0 0 4px" }}>
        {CONCERT_NAME}
      </h1>
      <div style={{ opacity: 0.7, fontSize: 14, marginBottom: 14 }}>{VENUE}</div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {SHOW_DATES.map((d) => (
          <button
            key={d}
            onClick={() => setDate(d)}
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              border: "1px solid #444",
              background: d === date ? "#f5c542" : "#1a1c22",
              color: d === date ? "#0b0c10" : "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
        <div style={{ fontSize: 15, opacity: 0.85 }}>
          Seated: <strong>{totalCount}</strong> people
        </div>
        <button onClick={onShowList} style={pillButtonStyle}>
          💖 List
        </button>
      </div>
    </div>
  );
}

function SeatMap({ entries, loading, onSectionClick }) {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} style={{ position: "relative", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
      {loading && (
        <div style={{ textAlign: "center", padding: 20, opacity: 0.6 }}>
          ⏳ Loading seat map...
        </div>
      )}
      <div style={{ position: "relative", width: "100%" }}>
        <img src="/seatmap.jpg" alt="Seat Map" style={{ width: "100%", display: "block", borderRadius: 8 }} />
        {SECTIONS.map((s) => {
          const list = entries[s.id] || [];
          return (
            <div
              key={s.id}
              onClick={() => onSectionClick(s.id)}
              title={`Section ${s.id} — ${list.length} registered`}
              style={{
                position: "absolute",
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.width}%`,
                height: `${s.height}%`,
                cursor: "pointer",
                border: "2px solid rgba(255,255,255,0.0)",
                transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "2px solid #f5c542";
                e.currentTarget.style.background = "rgba(245,197,66,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = "2px solid rgba(255,255,255,0.0)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <SectionPins list={list} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionPins({ list }) {
  if (list.length === 0) return null;
  const shown = list.slice(-6);
  return (
    <div style={{ position: "absolute", bottom: 2, left: 2, display: "flex", flexWrap: "wrap", gap: 1, maxWidth: "100%", pointerEvents: "none" }}>
      {shown.map((e) => (
        <div
          key={e.id}
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            overflow: "hidden",
            background: "#222",
            border: "1px solid rgba(255,255,255,0.6)",
            fontSize: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {e.photo ? (
            <img src={e.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span>{e.emoji || "💖"}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function RegisterModal({ sectionId, date, onClose, onRegistered }) {
  const [username, setUsername] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0].icon);
  const [photo, setPhoto] = useState(null);
  const [mode, setMode] = useState("emoji");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    resizeImage(file, 80, 80).then((dataUrl) => {
      setPhoto(dataUrl);
      setMode("photo");
    });
  }

  async function handleSubmit() {
    setError("");
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          sectionId,
          username,
          emoji: mode === "emoji" ? selectedEmoji : null,
          photo: mode === "photo" ? photo : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }
      onRegistered(data.entries);
    } catch (e) {
      setError("Network error. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <ModalShell onClose={onClose}>
      <h3 style={{ marginTop: 0 }}>Register Seat — {sectionId}</h3>

      <input
        type="text"
        placeholder="Your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        maxLength={30}
        style={inputStyle}
      />

      <div style={{ margin: "14px 0 6px", fontSize: 13, opacity: 0.8 }}>
        Choose an emoji (used if no photo is uploaded):
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {EMOJIS.map((em) => (
          <button
            key={em.id}
            onClick={() => {
              setSelectedEmoji(em.icon);
              setMode("emoji");
            }}
            title={em.label}
            style={{
              fontSize: 22,
              padding: "6px 10px",
              borderRadius: 8,
              border: mode === "emoji" && selectedEmoji === em.icon ? "2px solid #f5c542" : "1px solid #444",
              background: "#1a1c22",
              cursor: "pointer",
            }}
          >
            {em.icon}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>Or upload a photo:</div>
      <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ marginBottom: 12 }} />
      {photo && mode === "photo" && (
        <div style={{ marginBottom: 12 }}>
          <img src={photo} alt="preview" style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }} />
        </div>
      )}

      {error && <div style={{ color: "#ff6b6b", marginBottom: 10, fontSize: 13 }}>{error}</div>}

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={secondaryButtonStyle}>Cancel</button>
        <button onClick={handleSubmit} disabled={submitting} style={primaryButtonStyle}>
          {submitting ? "Saving..." : "Confirm Registration"}
        </button>
      </div>
    </ModalShell>
  );
}

function ListPanel({ entries, onClose }) {
  const rows = [];
  Object.entries(entries).forEach(([sectionId, list]) => {
    list.forEach((e) => rows.push({ sectionId, ...e }));
  });
  rows.sort((a, b) => b.createdAt - a.createdAt);

  return (
    <ModalShell onClose={onClose} wide>
      <h3 style={{ marginTop: 0 }}>💖 Registered List ({rows.length})</h3>
      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {rows.length === 0 && <div style={{ opacity: 0.6 }}>No one has registered yet.</div>}
        {rows.map((r) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #2a2c33" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {r.photo ? (
                <img src={r.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span>{r.emoji || "💖"}</span>
              )}
            </div>
            <div style={{ flex: 1 }}>{r.username}</div>
            <div style={{ opacity: 0.7, fontSize: 13 }}>{r.sectionId}</div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

function AdminPanel({ date, entries, onClose, onChanged }) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  const rows = [];
  Object.entries(entries).forEach(([sectionId, list]) => {
    list.forEach((e) => rows.push({ sectionId, ...e }));
  });

  async function handleDelete(sectionId, entryId) {
    try {
      const res = await fetch("/api/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, sectionId, entryId, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }
      onChanged(data.entries);
    } catch (e) {
      setError("Network error");
    }
  }

  if (!authed) {
    return (
      <ModalShell onClose={onClose}>
        <h3 style={{ marginTop: 0 }}>Admin Login</h3>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        {error && <div style={{ color: "#ff6b6b", margin: "8px 0", fontSize: 13 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={onClose} style={secondaryButtonStyle}>Cancel</button>
          <button
            onClick={() => {
              if (!password) {
                setError("Enter password");
                return;
              }
              setAuthed(true);
              setError("");
            }}
            style={primaryButtonStyle}
          >
            Continue
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose} wide>
      <h3 style={{ marginTop: 0 }}>Admin — Manage Entries ({rows.length})</h3>
      {error && <div style={{ color: "#ff6b6b", marginBottom: 10, fontSize: 13 }}>{error}</div>}
      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {rows.map((r) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #2a2c33" }}>
            <div style={{ flex: 1 }}>{r.username} <span style={{ opacity: 0.6, fontSize: 12 }}>({r.sectionId})</span></div>
            <button onClick={() => handleDelete(r.sectionId, r.id)} style={{ ...secondaryButtonStyle, padding: "4px 10px", fontSize: 12 }}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

function ModalShell({ children, onClose, wide }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#15171c", borderRadius: 12, padding: 22, width: "100%", maxWidth: wide ? 480 : 380, border: "1px solid #2a2c33" }}
      >
        {children}
      </div>
    </div>
  );
}

function resizeImage(file, maxW, maxH) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = maxW;
        canvas.height = maxH;
        const ctx = canvas.getContext("2d");
        const scale = Math.max(maxW / img.width, maxH / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (maxW - w) / 2, (maxH - h) / 2, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #444",
  background: "#1a1c22",
  color: "#fff",
  fontSize: 14,
};

const primaryButtonStyle = {
  padding: "9px 18px",
  borderRadius: 8,
  border: "none",
  background: "#f5c542",
  color: "#0b0c10",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "9px 18px",
  borderRadius: 8,
  border: "1px solid #444",
  background: "transparent",
  color: "#fff",
  cursor: "pointer",
};

const pillButtonStyle = {
  padding: "6px 14px",
  borderRadius: 16,
  border: "1px solid #444",
  background: "#1a1c22",
  color: "#fff",
  cursor: "pointer",
  fontSize: 13,
};

const adminButtonStyle = {
  position: "fixed",
  bottom: 14,
  right: 14,
  padding: "8px 14px",
  borderRadius: 20,
  border: "1px solid #444",
  background: "#1a1c22",
  color: "#fff",
  cursor: "pointer",
  fontSize: 12,
  opacity: 0.7,
};
