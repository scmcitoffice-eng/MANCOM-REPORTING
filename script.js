// ---------- DATA ----------
const departments = [
  {
    tag: "IMRS", tagClass: "tag-imrs", iconClass: "imrs",
    title: "IMRS",
    desc: "Admissions, ambulance, storage, Veridata, Hospital Notification",
    icon: `<path d="M8 3h8v4H8z"/><path d="M6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z"/><path d="M9 12h6M9 15.5h6"/>`
  },
  {
    tag: "OPD", tagClass: "tag-opd", iconClass: "opd",
    title: "OPD",
    desc: "Signage, Hepa filters, checklist, HNO for patients with TB",
    icon: `<path d="M6 3v6a3 3 0 0 0 6 0V3M9 9v3a4 4 0 0 0 8 0v-2"/><circle cx="19" cy="16" r="2"/>`
  },
  {
    tag: "MEDICAL RECORDS", tagClass: "tag-mr", iconClass: "mr",
    title: "Medical Records",
    desc: "Chart room rehabilitation, WOODEN BARRIER follow-up",
    icon: `<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`
  },
  {
    tag: "GSS", tagClass: "tag-gss", iconClass: "gss",
    title: "GSS",
    desc: "BFP requirements, Renovation Dialysis, Pump room inspection",
    icon: `<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.2"/><path d="M15.5 14.3c2.4.3 4.3 2.3 4.3 5"/>`
  },
  {
    tag: "ACCOUNTING & FINANCE", tagClass: "tag-af", iconClass: "af",
    title: "Accounting & Finance",
    desc: "Costing review, Pricing Committee, Bullseye POS",
    icon: `<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9h18M8 13h3M8 17h8"/>`
  }
];

const schedule = [
  {
    time: "3:41 PM", title: "IMRS / OPD Updates",
    desc: "HA, HD, MD, GSS, Marketing",
    status: "ongoing", label: "On-going"
  },
  {
    time: "3:53 PM", title: "For Information:",
    desc: "DDH Rizal Cancer Registry Data Collection · 8:00 AM – 2:00 PM",
    status: "ongoing", label: "On-going"
  },
  {
    time: "3:53 – 3:57 PM", title: "GSS",
    desc: "BFP Requirements, Renovation Dialysis",
    status: "started", label: "Started"
  },
  {
    time: "3:57 PM", title: "Accounting & Finance",
    desc: "Costing Review with Team",
    status: "upcoming", label: "Upcoming"
  },
  {
    time: "4:43 PM", title: "Check the HIMS in OPD (charging and discharging)",
    desc: "c/o IT & Mr. Angel",
    status: "upcoming", label: "Upcoming"
  }
];

const reports = [
  { dept: "IMRS", tagClass: "tag-imrs", name: "Admissions Summary — June", due: "Jul 24, 2026", status: "pending" },
  { dept: "OPD", tagClass: "tag-opd", name: "HEPA Filter Inspection Log", due: "Jul 22, 2026", status: "overdue" },
  { dept: "Medical Records", tagClass: "tag-mr", name: "Chart Room Rehabilitation Update", due: "Jul 25, 2026", status: "pending" },
  { dept: "GSS", tagClass: "tag-gss", name: "BFP Compliance Checklist", due: "Jul 23, 2026", status: "overdue" },
  { dept: "Accounting & Finance", tagClass: "tag-af", name: "Costing Review Summary", due: "Jul 28, 2026", status: "pending" },
  { dept: "IMRS", tagClass: "tag-imrs", name: "Veridata Sync Report", due: "Jul 18, 2026", status: "submitted" },
  { dept: "OPD", tagClass: "tag-opd", name: "TB Patient HNO Log", due: "Jul 19, 2026", status: "submitted" }
];

const archiveReports = [
  { dept: "IMRS", tagClass: "tag-imrs", name: "Admissions Summary — May", submitted: "Jun 3, 2026", status: "approved" },
  { dept: "GSS", tagClass: "tag-gss", name: "Dialysis Renovation Progress", submitted: "Jun 10, 2026", status: "approved" },
  { dept: "Accounting & Finance", tagClass: "tag-af", name: "Bullseye POS Reconciliation", submitted: "Jun 14, 2026", status: "approved" },
  { dept: "Medical Records", tagClass: "tag-mr", name: "Wooden Barrier Follow-up", submitted: "Jun 20, 2026", status: "revision" },
  { dept: "OPD", tagClass: "tag-opd", name: "Signage Replacement Report", submitted: "Jun 27, 2026", status: "approved" }
];

const records = [
  { chart: "CR-10432", patient: "R. Domingo", request: "Discharge summary copy", requested: "Jul 21, 2026", status: "processing" },
  { chart: "CR-10388", patient: "M. Villareal", request: "Full chart retrieval", requested: "Jul 20, 2026", status: "ready" },
  { chart: "CR-10501", patient: "A. Santos", request: "Lab results reprint", requested: "Jul 21, 2026", status: "processing" },
  { chart: "CR-10276", patient: "J. Bautista", request: "Insurance chart copy", requested: "Jul 19, 2026", status: "ready" },
  { chart: "CR-10459", patient: "K. Reyes", request: "Chart room transfer", requested: "Jul 18, 2026", status: "completed" }
];

const gssTasks = [
  { title: "BFP Fire Safety Requirements", desc: "Submit updated fire safety documents for annual permit.", done: false },
  { title: "Dialysis Room Renovation", desc: "Coordinate contractor walkthrough for pump room inspection.", done: false },
  { title: "Pump Room Inspection", desc: "Quarterly inspection of water pump systems.", done: true },
  { title: "HEPA Filter Replacement — OPD", desc: "Replace filters in outpatient waiting areas.", done: true },
  { title: "Signage Audit", desc: "Verify wayfinding signage across all floors.", done: false }
];

const financeStats = [
  { label: "Monthly Revenue", value: 4820000, sub: "June 2026", cls: "icon-people" },
  { label: "Pending Invoices", value: 37, sub: "This Week", cls: "icon-clock" },
  { label: "Costing Reviews", value: 5, sub: "In Progress", cls: "icon-doc" }
];

const financeTransactions = [
  { date: "Jul 20, 2026", desc: "Bullseye POS — OPD Settlement", cat: "Revenue", amount: "+₱182,400" },
  { date: "Jul 19, 2026", desc: "Pricing Committee — Lab Panel Update", cat: "Adjustment", amount: "—" },
  { date: "Jul 18, 2026", desc: "Vendor Payment — GSS Supplies", cat: "Expense", amount: "-₱54,200" },
  { date: "Jul 17, 2026", desc: "Bullseye POS — IMRS Settlement", cat: "Revenue", amount: "+₱96,750" },
  { date: "Jul 15, 2026", desc: "Equipment Costing Review", cat: "Expense", amount: "-₱128,900" }
];

const meetings = [
  { title: "IMRS / OPD Updates", time: "Today · 3:41 PM", attendees: "HA, HD, MD, GSS, Marketing", agenda: ["Review admission numbers", "Discuss OPD signage rollout", "HNO status for TB patients"] },
  { title: "GSS Facilities Sync", time: "Today · 3:53 PM", attendees: "GSS, Engineering", agenda: ["BFP requirements walkthrough", "Dialysis renovation timeline"] },
  { title: "Accounting & Finance Costing Review", time: "Today · 3:57 PM", attendees: "Finance Team", agenda: ["Review updated cost sheets", "Approve pricing committee changes"] },
  { title: "IT / HIMS Check", time: "Today · 4:43 PM", attendees: "IT, Mr. Angel", agenda: ["HIMS charging/discharging check in OPD"] }
];

const documents = [
  { name: "Admissions_Policy_2026.pdf", dept: "IMRS", uploaded: "Jul 15, 2026", size: "1.2 MB" },
  { name: "BFP_Compliance_Checklist.docx", dept: "GSS", uploaded: "Jul 18, 2026", size: "340 KB" },
  { name: "Costing_Sheet_Q3.xlsx", dept: "Accounting & Finance", uploaded: "Jul 19, 2026", size: "2.1 MB" },
  { name: "Chart_Room_Layout.pdf", dept: "Medical Records", uploaded: "Jul 12, 2026", size: "890 KB" },
  { name: "OPD_Signage_Plan.pdf", dept: "OPD", uploaded: "Jul 9, 2026", size: "1.6 MB" }
];

const users = [
  { name: "Lito Cabajar", role: "IT Officer", dept: "IT", status: "active" },
  { name: "Grace Manlangit", role: "Records Supervisor", dept: "Medical Records", status: "active" },
  { name: "Angel Fortuno", role: "IT Support", dept: "IT", status: "active" },
  { name: "Rhea Villamor", role: "Finance Officer", dept: "Accounting & Finance", status: "active" },
  { name: "Bong Sarmiento", role: "GSS Coordinator", dept: "GSS", status: "inactive" }
];

// ---------- RENDER DEPARTMENTS ----------
function renderDepartments(){
  const grid = document.getElementById("deptGrid");
  grid.innerHTML = departments.map(d => `
    <article class="dept-card">
      <span class="dept-tag ${d.tagClass}">${d.tag}</span>
      <div class="dept-icon ${d.iconClass}">
        <svg viewBox="0 0 24 24" width="22" height="22">${d.icon}</svg>
      </div>
      <h3>${d.title}</h3>
      <p>${d.desc}</p>
      <a href="#" class="dept-link" data-dept="${d.title}">
        Go to Reports
        <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </article>
  `).join("");
}

// ---------- RENDER SCHEDULE ----------
function renderSchedule(){
  const list = document.getElementById("timeline");
  list.innerHTML = schedule.map(s => `
    <li class="timeline-item ${s.status === 'upcoming' ? 'upcoming' : ''}">
      <div class="t-time">${s.time}</div>
      <div class="t-row">
        <div>
          <div class="t-title">${s.title}</div>
          <div class="t-desc">${s.desc}</div>
        </div>
        <span class="badge badge-${s.status}">${s.label}</span>
      </div>
    </li>
  `).join("");
}

// ---------- STATUS HELPERS ----------
const statusMeta = {
  pending:   { label: "Pending",   cls: "badge-upcoming" },
  overdue:   { label: "Overdue",   cls: "badge-overdue" },
  submitted: { label: "Submitted", cls: "badge-ongoing" },
  approved:  { label: "Approved",  cls: "badge-ongoing" },
  revision:  { label: "Needs Revision", cls: "badge-overdue" },
  processing:{ label: "Processing", cls: "badge-upcoming" },
  ready:     { label: "Ready",     cls: "badge-started" },
  completed: { label: "Completed", cls: "badge-ongoing" },
  active:    { label: "Active",    cls: "badge-ongoing" },
  inactive:  { label: "Inactive",  cls: "badge-overdue" }
};
function badge(status){
  const m = statusMeta[status] || { label: status, cls: "badge-upcoming" };
  return `<span class="badge ${m.cls}">${m.label}</span>`;
}

// ---------- RENDER REPORTING ----------
function renderReporting(filterDept){
  const body = document.getElementById("reportsTableBody");
  const rows = reports.filter(r => !filterDept || r.dept === filterDept);
  body.innerHTML = rows.map(r => `
    <tr>
      <td><span class="dept-tag ${r.tagClass}">${r.dept}</span></td>
      <td class="cell-main">${r.name}</td>
      <td>${r.due}</td>
      <td>${badge(r.status)}</td>
      <td class="cell-action"><button class="link-btn" data-report="${r.name}">${r.status === "submitted" ? "View" : "Submit"}</button></td>
    </tr>
  `).join("") || `<tr><td colspan="5" class="empty-row">No reports for this department.</td></tr>`;

  const filters = document.getElementById("reportFilters");
  const depts = ["All", ...new Set(reports.map(r => r.dept))];
  filters.innerHTML = depts.map(d => `<button class="chip ${(!filterDept && d === "All") || d === filterDept ? "chip-active" : ""}" data-filter="${d}">${d}</button>`).join("");
}

// ---------- RENDER ARCHIVE ----------
function renderArchive(filterDept){
  const body = document.getElementById("archiveTableBody");
  const rows = archiveReports.filter(r => !filterDept || r.dept === filterDept);
  body.innerHTML = rows.map(r => `
    <tr>
      <td><span class="dept-tag ${r.tagClass}">${r.dept}</span></td>
      <td class="cell-main">${r.name}</td>
      <td>${r.submitted}</td>
      <td>${badge(r.status)}</td>
      <td class="cell-action"><button class="link-btn">Download</button></td>
    </tr>
  `).join("") || `<tr><td colspan="5" class="empty-row">No archived reports for this department.</td></tr>`;

  const filters = document.getElementById("archiveFilters");
  const depts = ["All", ...new Set(archiveReports.map(r => r.dept))];
  filters.innerHTML = depts.map(d => `<button class="chip ${(!filterDept && d === "All") || d === filterDept ? "chip-active" : ""}" data-filter="${d}">${d}</button>`).join("");
}

// ---------- RENDER RECORDS ----------
function renderRecords(query){
  const body = document.getElementById("recordsTableBody");
  const q = (query || "").toLowerCase();
  const rows = records.filter(r => !q || r.patient.toLowerCase().includes(q) || r.chart.toLowerCase().includes(q));
  body.innerHTML = rows.map(r => `
    <tr>
      <td class="cell-main">${r.chart}</td>
      <td>${r.patient}</td>
      <td>${r.request}</td>
      <td>${r.requested}</td>
      <td>${badge(r.status)}</td>
    </tr>
  `).join("") || `<tr><td colspan="5" class="empty-row">No matching records.</td></tr>`;
}

// ---------- RENDER GSS ----------
function renderGss(){
  const list = document.getElementById("gssList");
  list.innerHTML = gssTasks.map((t, i) => `
    <label class="check-item ${t.done ? "done" : ""}">
      <input type="checkbox" data-gss="${i}" ${t.done ? "checked" : ""}>
      <span class="check-box"></span>
      <span class="check-body">
        <span class="check-title">${t.title}</span>
        <span class="check-desc">${t.desc}</span>
      </span>
    </label>
  `).join("");
}

// ---------- RENDER FINANCE ----------
function renderFinance(){
  const stats = document.getElementById("financeStats");
  stats.innerHTML = financeStats.map(s => `
    <div class="stat-card">
      <div class="stat-icon ${s.cls}">
        <svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="9"/></svg>
      </div>
      <div class="stat-body">
        <span class="stat-label">${s.label}</span>
        <span class="stat-value">${typeof s.value === "number" && s.value > 1000 ? "₱" + s.value.toLocaleString() : s.value}</span>
        <span class="stat-sub">${s.sub}</span>
      </div>
    </div>
  `).join("");

  const body = document.getElementById("financeTableBody");
  body.innerHTML = financeTransactions.map(t => `
    <tr>
      <td>${t.date}</td>
      <td class="cell-main">${t.desc}</td>
      <td>${t.cat}</td>
      <td class="${t.amount.startsWith("+") ? "amt-pos" : t.amount.startsWith("-") ? "amt-neg" : ""}">${t.amount}</td>
    </tr>
  `).join("");
}

// ---------- RENDER MEETINGS ----------
function renderMeetings(){
  const grid = document.getElementById("meetingGrid");
  grid.innerHTML = meetings.map(m => `
    <article class="meeting-card">
      <div class="meeting-top">
        <h3>${m.title}</h3>
        <span class="meeting-time">${m.time}</span>
      </div>
      <p class="meeting-attendees">${m.attendees}</p>
      <ul class="meeting-agenda">
        ${m.agenda.map(a => `<li>${a}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

// ---------- RENDER DOCUMENTS ----------
function renderDocuments(){
  const body = document.getElementById("documentsTableBody");
  body.innerHTML = documents.map(d => `
    <tr>
      <td class="cell-main">${d.name}</td>
      <td>${d.dept}</td>
      <td>${d.uploaded}</td>
      <td>${d.size}</td>
      <td class="cell-action"><button class="link-btn">Download</button></td>
    </tr>
  `).join("");
}

// ---------- RENDER USERS ----------
function renderUsers(){
  const body = document.getElementById("usersTableBody");
  body.innerHTML = users.map((u, i) => `
    <tr>
      <td class="cell-main">${u.name}</td>
      <td>${u.role}</td>
      <td>${u.dept}</td>
      <td>${badge(u.status)}</td>
      <td class="cell-action"><button class="link-btn" data-user-toggle="${i}">${u.status === "active" ? "Deactivate" : "Activate"}</button></td>
    </tr>
  `).join("");
}

// ---------- RENDER FULL SCHEDULE ----------
const weekSchedule = {
  Mon: schedule,
  Tue: [
    { time: "9:00 AM", title: "Department Head Huddle", desc: "IMRS, OPD, GSS leads", status: "ongoing", label: "On-going" },
    { time: "1:00 PM", title: "Medical Records Audit", desc: "Chart room rehabilitation walkthrough", status: "upcoming", label: "Upcoming" }
  ],
  Wed: [
    { time: "10:30 AM", title: "Pricing Committee", desc: "Review Bullseye POS pricing updates", status: "upcoming", label: "Upcoming" }
  ],
  Thu: [
    { time: "8:00 AM", title: "DDH Rizal Cancer Registry Data Collection", desc: "8:00 AM – 2:00 PM", status: "upcoming", label: "Upcoming" }
  ],
  Fri: [
    { time: "2:00 PM", title: "Weekly Wrap-up", desc: "All department leads", status: "upcoming", label: "Upcoming" }
  ]
};
function renderFullSchedule(day){
  const tabs = document.getElementById("dayTabs");
  tabs.innerHTML = Object.keys(weekSchedule).map(d => `<button class="chip ${d === day ? "chip-active" : ""}" data-day="${d}">${d}</button>`).join("");

  const list = document.getElementById("fullTimeline");
  const items = weekSchedule[day] || [];
  list.innerHTML = items.map(s => `
    <li class="timeline-item ${s.status === 'upcoming' ? 'upcoming' : ''}">
      <div class="t-time">${s.time}</div>
      <div class="t-row">
        <div>
          <div class="t-title">${s.title}</div>
          <div class="t-desc">${s.desc}</div>
        </div>
        <span class="badge badge-${s.status}">${s.label}</span>
      </div>
    </li>
  `).join("") || `<li class="empty-row" style="border-left:2px solid transparent;">No scheduled items.</li>`;
}

// ---------- ANIMATED COUNTERS ----------
function animateCounters(){
  document.querySelectorAll(".stat-value").forEach(el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 800;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if(progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// ---------- TOAST ----------
function showToast(message){
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---------- VIEW SWITCHING ----------
const viewInit = {
  reporting: () => renderReporting(),
  records: () => renderRecords(),
  gss: renderGss,
  finance: renderFinance,
  schedule: () => renderFullSchedule("Mon"),
  meetings: renderMeetings,
  documents: renderDocuments,
  users: renderUsers,
  archive: () => renderArchive()
};

function switchView(viewId, opts){
  const views = document.querySelectorAll(".view");
  views.forEach(v => v.classList.toggle("active", v.id === `view-${viewId}`));

  const items = document.querySelectorAll(".nav-item");
  items.forEach(i => i.classList.toggle("active", i.dataset.view === viewId));

  if(viewInit[viewId]) viewInit[viewId]();
  if(opts && opts.dept && viewId === "reporting") renderReporting(opts.dept);
  if(opts && opts.dept && viewId === "archive") renderArchive(opts.dept);

  document.querySelector(".main").scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- NAV SWITCHING ----------
function setupNav(){
  const items = document.querySelectorAll(".nav-item");
  items.forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      const view = item.dataset.view;
      if(view === "settings"){
        switchView("settings");
        return;
      }
      switchView(view);
    });
  });
}

// ---------- QUICK ACTIONS ----------
const quickActionMap = {
  "Submit Report": "reporting",
  "View Schedules": "schedule",
  "Meeting Agenda": "meetings",
  "Documents": "documents",
  "Reports Archive": "archive"
};
function setupQuickActions(){
  document.body.addEventListener("click", e => {
    const btn = e.target.closest("[data-action]");
    if(!btn) return;
    const action = btn.dataset.action;
    if(quickActionMap[action]){
      switchView(quickActionMap[action]);
      showToast(`Opened ${action}`);
    } else {
      showToast(`${action} — coming soon`);
    }
  });
}

// ---------- DEPT LINKS ----------
function setupDeptLinks(){
  document.getElementById("deptGrid").addEventListener("click", e => {
    const link = e.target.closest(".dept-link");
    if(!link) return;
    e.preventDefault();
    switchView("reporting", { dept: link.dataset.dept });
    showToast(`Showing ${link.dataset.dept} reports`);
  });
}

// ---------- REPORTING / ARCHIVE FILTERS ----------
function setupFilterChips(){
  document.getElementById("reportFilters").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if(!chip) return;
    renderReporting(chip.dataset.filter === "All" ? null : chip.dataset.filter);
  });
  document.getElementById("archiveFilters").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if(!chip) return;
    renderArchive(chip.dataset.filter === "All" ? null : chip.dataset.filter);
  });
}

// ---------- REPORT SUBMIT / VIEW ----------
function setupReportsTable(){
  document.getElementById("reportsTableBody").addEventListener("click", e => {
    const btn = e.target.closest(".link-btn");
    if(!btn) return;
    showToast(btn.textContent === "Submit" ? `Submitted "${btn.dataset.report}"` : `Viewing "${btn.dataset.report}"`);
  });
  document.getElementById("archiveTableBody").addEventListener("click", e => {
    const btn = e.target.closest(".link-btn");
    if(!btn) return;
    showToast("Downloading report…");
  });
  document.getElementById("documentsTableBody").addEventListener("click", e => {
    const btn = e.target.closest(".link-btn");
    if(!btn) return;
    showToast("Downloading document…");
  });
}

// ---------- RECORDS SEARCH ----------
function setupRecordsSearch(){
  document.getElementById("recordsSearch").addEventListener("input", e => {
    renderRecords(e.target.value);
  });
}

// ---------- GSS CHECKLIST ----------
function setupGssList(){
  document.getElementById("gssList").addEventListener("change", e => {
    const input = e.target.closest("[data-gss]");
    if(!input) return;
    const idx = Number(input.dataset.gss);
    gssTasks[idx].done = input.checked;
    renderGss();
    showToast(gssTasks[idx].done ? `Marked "${gssTasks[idx].title}" complete` : `Reopened "${gssTasks[idx].title}"`);
  });
}

// ---------- USERS TOGGLE ----------
function setupUsersTable(){
  document.getElementById("usersTableBody").addEventListener("click", e => {
    const btn = e.target.closest("[data-user-toggle]");
    if(!btn) return;
    const idx = Number(btn.dataset.userToggle);
    users[idx].status = users[idx].status === "active" ? "inactive" : "active";
    renderUsers();
    showToast(`${users[idx].name} is now ${users[idx].status}`);
  });
}

// ---------- FULL SCHEDULE DAY TABS ----------
function setupDayTabs(){
  document.getElementById("dayTabs").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if(!chip) return;
    renderFullSchedule(chip.dataset.day);
  });
}

// ---------- SETTINGS ----------
function setupSettings(){
  document.getElementById("saveProfileBtn").addEventListener("click", () => {
    const name = document.getElementById("settingName").value.trim() || "Lito Cabajar";
    document.querySelectorAll(".who-name, .user-name").forEach(el => el.textContent = name);
    setGreeting();
    showToast("Profile saved");
  });
  document.querySelectorAll(".toggle-row input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", () => showToast(cb.checked ? "Notification enabled" : "Notification disabled"));
  });
}

// ---------- MISC BUTTONS ----------
function setupMisc(){
  document.getElementById("bellBtn").addEventListener("click", () => showToast("No new notifications"));
  document.getElementById("viewFullSchedule").addEventListener("click", () => switchView("schedule"));
  document.getElementById("logoutBtn").addEventListener("click", () => showToast("Logging out…"));
}

// ---------- INIT ----------
function setGreeting(){
  const hour = new Date().getHours();
  let part = "morning";
  if(hour >= 12 && hour < 18) part = "afternoon";
  else if(hour >= 18) part = "evening";
  const name = (document.getElementById("settingName") && document.getElementById("settingName").value.trim()) || "Lito";
  const first = name.split(" ")[0];
  document.getElementById("greeting").textContent = `Good ${part}, ${first}!`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderDepartments();
  renderSchedule();
  animateCounters();
  setGreeting();
  setupNav();
  setupQuickActions();
  setupDeptLinks();
  setupFilterChips();
  setupReportsTable();
  setupRecordsSearch();
  setupGssList();
  setupUsersTable();
  setupDayTabs();
  setupSettings();
  setupMisc();
});
