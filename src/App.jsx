import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0D0F14",
  surface: "#151820",
  card: "#1C2030",
  border: "#252A3A",
  accent: "#5B6EF5",
  accentLight: "#7B8EFF",
  green: "#2DD4A0",
  amber: "#F5A623",
  red: "#F56060",
  purple: "#A78BFA",
  textPrimary: "#F0F2FF",
  textSecondary: "#8B92A8",
  textMuted: "#4E566A",
};

const initialData = {
  clients: [
    { id: 1, name: "Acme Corp", email: "contact@acme.com", status: "Active", value: 2400, notes: "Logo redesign + branding" },
    { id: 2, name: "Nova Studio", email: "hi@nova.io", status: "Active", value: 1800, notes: "Monthly retainer" },
    { id: 3, name: "BlueWave Inc", email: "pm@bluewave.com", status: "Lead", value: 3500, notes: "Awaiting proposal" },
  ],
  projects: [
    { id: 1, name: "Brand Identity", clientId: 1, status: "In Progress", due: "2026-05-20", budget: 2400, progress: 65 },
    { id: 2, name: "Website Redesign", clientId: 2, status: "In Progress", due: "2026-06-01", budget: 1800, progress: 30 },
    { id: 3, name: "Marketing Campaign", clientId: 3, status: "Planning", due: "2026-06-15", budget: 3500, progress: 10 },
  ],
  finance: [
    { id: 1, date: "2026-04-01", type: "Income", amount: 1200, category: "Design", client: "Acme Corp", note: "First milestone" },
    { id: 2, date: "2026-04-05", type: "Expense", amount: 49, category: "Software", client: "", note: "Figma subscription" },
    { id: 3, date: "2026-04-10", type: "Income", amount: 900, category: "Consulting", client: "Nova Studio", note: "April retainer" },
  ],
};

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "clients", label: "Clients", icon: "◎" },
  { id: "projects", label: "Projects", icon: "◈" },
  { id: "finance", label: "Finance", icon: "◇" },
];

const STATUS_COLORS = {
  "Active": COLORS.green,
  "In Progress": COLORS.accent,
  "Planning": COLORS.amber,
  "Lead": COLORS.purple,
  "Inactive": COLORS.textMuted,
  "Done": COLORS.green,
  "Income": COLORS.green,
  "Expense": COLORS.red,
};

function Badge({ label }) {
  const color = STATUS_COLORS[label] || COLORS.textMuted;
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
      background: color + "22", color, border: `1px solid ${color}44`
    }}>{label}</span>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: COLORS.card, border: `1px solid ${COLORS.border}`,
      borderRadius: 14, padding: "20px 24px", flex: 1, minWidth: 140
    }}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || COLORS.textPrimary, fontFamily: "monospace", letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ value, color }) {
  return (
    <div style={{ background: COLORS.border, borderRadius: 4, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color || COLORS.accent, borderRadius: 4, transition: "width 0.6s ease" }} />
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20
    }}>
      <div style={{
        background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 18, padding: 32, width: "100%", maxWidth: 480
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, color: COLORS.textPrimary, fontSize: 18, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.textMuted, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 14px", background: COLORS.bg,
  border: `1px solid ${COLORS.border}`, borderRadius: 10,
  color: COLORS.textPrimary, fontSize: 14, outline: "none",
  boxSizing: "border-box", marginBottom: 14, fontFamily: "inherit"
};

const btnPrimary = {
  background: COLORS.accent, color: "#fff", border: "none",
  borderRadius: 10, padding: "11px 24px", fontSize: 14, fontWeight: 600,
  cursor: "pointer", width: "100%", marginTop: 4
};

const btnSecondary = {
  background: "transparent", color: COLORS.textSecondary, border: `1px solid ${COLORS.border}`,
  borderRadius: 10, padding: "11px 24px", fontSize: 14, fontWeight: 600,
  cursor: "pointer", width: "100%", marginTop: 4
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ data }) {
  const income = data.finance.filter(f => f.type === "Income").reduce((s, f) => s + f.amount, 0);
  const expenses = data.finance.filter(f => f.type === "Expense").reduce((s, f) => s + f.amount, 0);
  const activeClients = data.clients.filter(c => c.status === "Active").length;
  const activeProjects = data.projects.filter(p => p.status === "In Progress").length;

  const recentTransactions = [...data.finance].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: COLORS.textPrimary }}>Good morning 👋</h1>
        <p style={{ margin: "6px 0 0", color: COLORS.textSecondary, fontSize: 15 }}>Here's your business at a glance.</p>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        <StatCard label="Monthly Revenue" value={`$${income.toLocaleString()}`} sub="April 2026" color={COLORS.green} />
        <StatCard label="Expenses" value={`$${expenses.toLocaleString()}`} sub="This month" color={COLORS.red} />
        <StatCard label="Net Profit" value={`$${(income - expenses).toLocaleString()}`} sub={`${Math.round(((income - expenses) / income) * 100)}% margin`} color={COLORS.accentLight} />
        <StatCard label="Active Clients" value={activeClients} sub={`${activeProjects} projects running`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: COLORS.textPrimary }}>Active Projects</h3>
          {data.projects.filter(p => p.status !== "Done").map(p => {
            const client = data.clients.find(c => c.id === p.clientId);
            return (
              <div key={p.id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: COLORS.textPrimary, fontWeight: 500 }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} color={p.progress > 50 ? COLORS.green : COLORS.accent} />
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{client?.name} · Due {p.due}</div>
              </div>
            );
          })}
        </div>

        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: COLORS.textPrimary }}>Recent Transactions</h3>
          {recentTransactions.map(t => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, color: COLORS.textPrimary, fontWeight: 500 }}>{t.note}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>{t.date} · {t.category}</div>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: t.type === "Income" ? COLORS.green : COLORS.red, fontFamily: "monospace" }}>
                {t.type === "Income" ? "+" : "-"}${t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CLIENTS ──────────────────────────────────────────────────────────────────
function Clients({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", status: "Lead", value: "", notes: "" });

  const openAddModal = () => {
    setEditingClient(null);
    setForm({ name: "", email: "", status: "Lead", value: "", notes: "" });
    setShowModal(true);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setForm({
      name: client.name,
      email: client.email,
      status: client.status,
      value: client.value.toString(),
      notes: client.notes || ""
    });
    setShowModal(true);
  };

  const save = () => {
    if (!form.name) return;

    if (editingClient) {
      // Update existing client
      setData(d => ({
        ...d,
        clients: d.clients.map(c =>
          c.id === editingClient.id
            ? { ...c, ...form, value: +form.value || 0 }
            : c
        )
      }));
    } else {
      // Add new client
      setData(d => ({
        ...d,
        clients: [...d.clients, { ...form, id: Date.now(), value: +form.value || 0 }]
      }));
    }

    setShowModal(false);
    setEditingClient(null);
    setForm({ name: "", email: "", status: "Lead", value: "", notes: "" });
  };

  const remove = (id) => {
    if (window.confirm("Delete this client?")) {
      setData(d => ({ ...d, clients: d.clients.filter(c => c.id !== id) }));
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: COLORS.textPrimary }}>Clients</h1>
          <p style={{ margin: "4px 0 0", color: COLORS.textSecondary, fontSize: 14 }}>
            {data.clients.length} total · {data.clients.filter(c => c.status === "Active").length} active
          </p>
        </div>
        <button onClick={openAddModal} style={{ ...btnPrimary, width: "auto", padding: "10px 20px" }}>+ Add Client</button>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {data.clients.map(c => (
          <div key={c.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.accent + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: COLORS.accentLight, flexShrink: 0 }}>
              {c.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>{c.email}</div>
              {c.notes && <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>{c.notes}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary, fontFamily: "monospace", marginBottom: 6 }}>${c.value.toLocaleString()}</div>
              <Badge label={c.status} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openEditModal(c)} style={{ background: "none", border: "none", color: COLORS.accentLight, cursor: "pointer", fontSize: 16, padding: 4 }}>✏️</button>
              <button onClick={() => remove(c.id)} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 16, padding: 4 }}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title={editingClient ? "Edit Client" : "Add New Client"} onClose={() => { setShowModal(false); setEditingClient(null); }}>
          <input style={inputStyle} placeholder="Client name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input style={inputStyle} placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <select style={inputStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option>Lead</option><option>Active</option><option>Inactive</option>
          </select>
          <input style={inputStyle} placeholder="Monthly value ($)" type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
          <input style={inputStyle} placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <button style={btnPrimary} onClick={save}>
            {editingClient ? "Save Changes" : "Save Client"}
          </button>
        </Modal>
      )}
    </div>
  );
}

// ─── PROJECTS & FINANCE (similar pattern) ─────────────────────────────────────

function Projects({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ name: "", clientId: "", status: "Planning", due: "", budget: "", progress: 0 });

  const openAddModal = () => {
    setEditingProject(null);
    setForm({ name: "", clientId: "", status: "Planning", due: "", budget: "", progress: 0 });
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setForm({
      name: project.name,
      clientId: project.clientId.toString(),
      status: project.status,
      due: project.due,
      budget: project.budget.toString(),
      progress: project.progress
    });
    setShowModal(true);
  };

  const save = () => {
    if (!form.name) return;

    const projectData = {
      ...form,
      clientId: +form.clientId,
      budget: +form.budget || 0,
      progress: +form.progress || 0
    };

    if (editingProject) {
      setData(d => ({
        ...d,
        projects: d.projects.map(p => p.id === editingProject.id ? { ...p, ...projectData } : p)
      }));
    } else {
      setData(d => ({
        ...d,
        projects: [...d.projects, { ...projectData, id: Date.now() }]
      }));
    }

    setShowModal(false);
    setEditingProject(null);
    setForm({ name: "", clientId: "", status: "Planning", due: "", budget: "", progress: 0 });
  };

  const remove = (id) => {
    if (window.confirm("Delete this project?")) {
      setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }));
    }
  };

  const statuses = ["Planning", "In Progress", "Done"];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: COLORS.textPrimary }}>Projects</h1>
          <p style={{ margin: "4px 0 0", color: COLORS.textSecondary, fontSize: 14 }}>{data.projects.length} total</p>
        </div>
        <button onClick={openAddModal} style={{ ...btnPrimary, width: "auto", padding: "10px 20px" }}>+ Add Project</button>
      </div>

      {statuses.map(status => {
        const ps = data.projects.filter(p => p.status === status);
        if (!ps.length) return null;
        return (
          <div key={status} style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: STATUS_COLORS[status] || COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{status}</span>
              <span style={{ fontSize: 12, color: COLORS.textMuted, background: COLORS.border, padding: "1px 8px", borderRadius: 10 }}>{ps.length}</span>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {ps.map(p => {
                const client = data.clients.find(c => c.id === p.clientId);
                return (
                  <div key={p.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 4 }}>{p.name}</div>
                        <div style={{ fontSize: 13, color: COLORS.textMuted }}>{client?.name || "No client"} · Due {p.due || "—"}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.amber, fontFamily: "monospace" }}>${p.budget.toLocaleString()}</span>
                        <button onClick={() => openEditModal(p)} style={{ background: "none", border: "none", color: COLORS.accentLight, cursor: "pointer", fontSize: 16 }}>✏️</button>
                        <button onClick={() => remove(p.id)} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 16 }}>🗑</button>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <ProgressBar value={p.progress} color={p.status === "Done" ? COLORS.green : COLORS.accent} />
                      </div>
                      <span style={{ fontSize: 12, color: COLORS.textMuted, minWidth: 32 }}>{p.progress}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {showModal && (
        <Modal title={editingProject ? "Edit Project" : "Add New Project"} onClose={() => { setShowModal(false); setEditingProject(null); }}>
          <input style={inputStyle} placeholder="Project name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <select style={inputStyle} value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}>
            <option value="">Select client</option>
            {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select style={inputStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option>Planning</option><option>In Progress</option><option>Done</option>
          </select>
          <input style={inputStyle} type="date" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))} />
          <input style={inputStyle} placeholder="Budget ($)" type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Progress: {form.progress}%</label>
            <input type="range" min="0" max="100" value={form.progress} onChange={e => setForm(f => ({ ...f, progress: e.target.value }))} style={{ width: "100%" }} />
          </div>
          <button style={btnPrimary} onClick={save}>
            {editingProject ? "Save Changes" : "Save Project"}
          </button>
        </Modal>
      )}
    </div>
  );
}

// ─── FINANCE ──────────────────────────────────────────────────────────────────
function Finance({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [form, setForm] = useState({ date: "", type: "Income", amount: "", category: "", client: "", note: "" });

  const income = data.finance.filter(f => f.type === "Income").reduce((s, f) => s + f.amount, 0);
  const expenses = data.finance.filter(f => f.type === "Expense").reduce((s, f) => s + f.amount, 0);

  const openAddModal = () => {
    setEditingEntry(null);
    setForm({ date: "", type: "Income", amount: "", category: "", client: "", note: "" });
    setShowModal(true);
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setForm({
      date: entry.date,
      type: entry.type,
      amount: entry.amount.toString(),
      category: entry.category || "",
      client: entry.client || "",
      note: entry.note || ""
    });
    setShowModal(true);
  };

  const save = () => {
    if (!form.amount) return;

    const entryData = { ...form, amount: +form.amount };

    if (editingEntry) {
      setData(d => ({
        ...d,
        finance: d.finance.map(f => f.id === editingEntry.id ? { ...f, ...entryData } : f)
      }));
    } else {
      setData(d => ({
        ...d,
        finance: [...d.finance, { ...entryData, id: Date.now() }]
      }));
    }

    setShowModal(false);
    setEditingEntry(null);
    setForm({ date: "", type: "Income", amount: "", category: "", client: "", note: "" });
  };

  const remove = (id) => {
    if (window.confirm("Delete this transaction?")) {
      setData(d => ({ ...d, finance: d.finance.filter(f => f.id !== id) }));
    }
  };

  const sorted = [...data.finance].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: COLORS.textPrimary }}>Finance</h1>
          <p style={{ margin: "4px 0 0", color: COLORS.textSecondary, fontSize: 14 }}>Track income and expenses</p>
        </div>
        <button onClick={openAddModal} style={{ ...btnPrimary, width: "auto", padding: "10px 20px" }}>+ Add Entry</button>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        <StatCard label="Total Income" value={`$${income.toLocaleString()}`} color={COLORS.green} />
        <StatCard label="Total Expenses" value={`$${expenses.toLocaleString()}`} color={COLORS.red} />
        <StatCard label="Net Profit" value={`$${(income - expenses).toLocaleString()}`} sub={income > 0 ? `${Math.round(((income - expenses) / income) * 100)}% margin` : ""} color={COLORS.accentLight} />
      </div>

      {/* ... keep your bar chart ... */}

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14, fontWeight: 600, color: COLORS.textSecondary }}>All Transactions</div>
        {sorted.map((t, i) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 24px", borderBottom: i < sorted.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.type === "Income" ? COLORS.green : COLORS.red, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: COLORS.textPrimary, fontWeight: 500 }}>{t.note || t.category}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>{t.date} · {t.category}{t.client ? ` · ${t.client}` : ""}</div>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: t.type === "Income" ? COLORS.green : COLORS.red, fontFamily: "monospace", marginRight: 8 }}>
              {t.type === "Income" ? "+" : "-"}${t.amount.toLocaleString()}
            </span>
            <Badge label={t.type} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openEditModal(t)} style={{ background: "none", border: "none", color: COLORS.accentLight, cursor: "pointer", fontSize: 16 }}>✏️</button>
              <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 16 }}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title={editingEntry ? "Edit Transaction" : "Add Transaction"} onClose={() => { setShowModal(false); setEditingEntry(null); }}>
          <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            <option>Income</option><option>Expense</option>
          </select>
          <input style={inputStyle} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <input style={inputStyle} placeholder="Amount ($) *" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          <input style={inputStyle} placeholder="Category (Design, Software...)" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
          <input style={inputStyle} placeholder="Client (optional)" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} />
          <input style={inputStyle} placeholder="Note" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          <button style={btnPrimary} onClick={save}>
            {editingEntry ? "Save Changes" : "Save Transaction"}
          </button>
        </Modal>
      )}
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function FreelanceOS() {
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState(initialData);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pages = {
    dashboard: <Dashboard data={data} />,
    clients: <Clients data={data} setData={setData} />,
    projects: <Projects data={data} setData={setData} />,
    finance: <Finance data={data} setData={setData} />
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: COLORS.textPrimary }}>
      {/* Sidebar - unchanged */}
      <div style={{ width: sidebarOpen ? 220 : 64, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", transition: "width 0.25s ease", flexShrink: 0 }}>
        <div style={{ padding: sidebarOpen ? "24px 20px 20px" : "24px 12px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.textPrimary, letterSpacing: "-0.02em" }}>SoloFlow</div>
              <div style={{ fontSize: 11, color: COLORS.accent, marginTop: 2 }}>● Online</div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(s => !s)} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 16, padding: 4 }}>☰</button>
        </div>
        <nav style={{ padding: "16px 10px", flex: 1 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%",
              padding: "11px 12px", borderRadius: 10, border: "none", cursor: "pointer",
              background: page === n.id ? COLORS.accent + "22" : "none",
              color: page === n.id ? COLORS.accentLight : COLORS.textSecondary,
              fontSize: 14, fontWeight: page === n.id ? 600 : 400,
              marginBottom: 4, textAlign: "left", transition: "all 0.15s",
              fontFamily: "inherit",
              borderLeft: page === n.id ? `2px solid ${COLORS.accent}` : "2px solid transparent",
            }}>
              <span style={{ fontSize: 16, minWidth: 20, textAlign: "center" }}>{n.icon}</span>
              {sidebarOpen && <span>{n.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
        {pages[page]}
      </div>
    </div>
  );
}