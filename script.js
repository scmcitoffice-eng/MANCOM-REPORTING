// ---------- DATA ----------
const departments = [
  {
    tag: "HR", tagClass: "tag-hr", iconClass: "hr",
    title: "HR",
    desc: "Recruitment, employee relations, benefits, training & development",
    icon: `<circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7"/>`
  },
  {
    tag: "PROCUREMENT", tagClass: "tag-proc", iconClass: "proc",
    title: "Procurement",
    desc: "Purchase orders, supplier management, inventory restocking",
    icon: `<path d="M4 4h2l1.6 10.2A2 2 0 0 0 9.6 16h7.8a2 2 0 0 0 2-1.7L21 7H6"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17.5" cy="20" r="1.4"/>`
  },
  {
    tag: "MARKETING", tagClass: "tag-mktg", iconClass: "mktg",
    title: "Marketing",
    desc: "Campaigns, community outreach, brand & social media",
    icon: `<path d="M3 10v4h4l5 4V6l-5 4z"/><path d="M16.5 9a4 4 0 0 1 0 6"/><path d="M19 6.5a7.5 7.5 0 0 1 0 11"/>`
  },
  {
    tag: "NURSING – WARD", tagClass: "tag-nursing", iconClass: "nursing",
    title: "Nursing – Ward",
    desc: "Inpatient ward staffing, census, and unit compliance",
    icon: `<path d="M12 21s-7-4.4-9.3-8.8C1.2 8.8 3 5.5 6.3 5.2c1.9-.2 3.4.9 4.2 2.1.8-1.2 2.3-2.3 4.2-2.1 3.3.3 5.1 3.6 3.6 7C20.7 16.5 12 21 12 21z"/><path d="M9 12h2.2l1-2 1.6 4 1-2H17"/>`
  },
  {
    tag: "NURSING – ICU", tagClass: "tag-nursing", iconClass: "nursing",
    title: "Nursing – ICU",
    desc: "Critical care staffing, monitoring logs, and unit compliance",
    icon: `<path d="M12 21s-7-4.4-9.3-8.8C1.2 8.8 3 5.5 6.3 5.2c1.9-.2 3.4.9 4.2 2.1.8-1.2 2.3-2.3 4.2-2.1 3.3.3 5.1 3.6 3.6 7C20.7 16.5 12 21 12 21z"/><path d="M9 12h2.2l1-2 1.6 4 1-2H17"/>`
  },
  {
    tag: "NURSING – OR", tagClass: "tag-nursing", iconClass: "nursing",
    title: "Nursing – OR",
    desc: "Operating room scheduling, staffing, and case logs",
    icon: `<path d="M12 21s-7-4.4-9.3-8.8C1.2 8.8 3 5.5 6.3 5.2c1.9-.2 3.4.9 4.2 2.1.8-1.2 2.3-2.3 4.2-2.1 3.3.3 5.1 3.6 3.6 7C20.7 16.5 12 21 12 21z"/><path d="M9 12h2.2l1-2 1.6 4 1-2H17"/>`
  },
  {
    tag: "NURSING – ER", tagClass: "tag-nursing", iconClass: "nursing",
    title: "Nursing – ER",
    desc: "Emergency room staffing, triage logs, and unit compliance",
    icon: `<path d="M12 21s-7-4.4-9.3-8.8C1.2 8.8 3 5.5 6.3 5.2c1.9-.2 3.4.9 4.2 2.1.8-1.2 2.3-2.3 4.2-2.1 3.3.3 5.1 3.6 3.6 7C20.7 16.5 12 21 12 21z"/><path d="M9 12h2.2l1-2 1.6 4 1-2H17"/>`
  },
  {
    tag: "NURSING – DIALYSIS", tagClass: "tag-nursing", iconClass: "nursing",
    title: "Nursing – Dialysis",
    desc: "Dialysis unit staffing, machine logs, and unit compliance",
    icon: `<path d="M12 21s-7-4.4-9.3-8.8C1.2 8.8 3 5.5 6.3 5.2c1.9-.2 3.4.9 4.2 2.1.8-1.2 2.3-2.3 4.2-2.1 3.3.3 5.1 3.6 3.6 7C20.7 16.5 12 21 12 21z"/><path d="M9 12h2.2l1-2 1.6 4 1-2H17"/>`
  },
  {
    tag: "LABORATORY", tagClass: "tag-lab", iconClass: "lab",
    title: "Laboratory",
    desc: "Specimen processing, test results, equipment calibration",
    icon: `<path d="M9 2h6M10 2v6.5L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 8.5V2"/><path d="M7.5 15h9"/>`
  },
  {
    tag: "SOCIAL SERVICE", tagClass: "tag-ss", iconClass: "ss",
    title: "Social Service",
    desc: "Patient assistance, charity cases, discharge coordination",
    icon: `<path d="M12 20s-7-4.2-9-8.4C1.3 8 3.4 5 6.8 5c2 0 3.6 1.2 5.2 3 1.6-1.8 3.2-3 5.2-3 3.4 0 5.5 3 3.8 6.6C19 15.8 12 20 12 20z"/>`
  },
  {
    tag: "PHARMACY", tagClass: "tag-pharm", iconClass: "pharm",
    title: "Pharmacy",
    desc: "Medication dispensing, inventory, drug safety compliance",
    icon: `<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>`
  },
  {
    tag: "QA", tagClass: "tag-qa", iconClass: "qa",
    title: "QA",
    desc: "Quality audits, accreditation standards, incident review",
    icon: `<path d="M12 3l7 3v6c0 4.6-3 8.4-7 9-4-.6-7-4.4-7-9V6z"/><path d="M9 12l2 2 4-4"/>`
  },
  {
    tag: "IT", tagClass: "tag-it", iconClass: "it",
    title: "IT",
    desc: "HIMS support, network infrastructure, systems maintenance",
    icon: `<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>`
  },
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
  { dept: "IMRS", tagClass: "tag-imrs", name: "Admissions Summary — June", due: "Jul 24, 2026", status: "pending", dateReported: "", pointPerson: "Angel Fortuno", notes: "" },
  { dept: "OPD", tagClass: "tag-opd", name: "HEPA Filter Inspection Log", due: "Jul 22, 2026", status: "overdue", dateReported: "", pointPerson: "Grace Manlangit", notes: "Awaiting filter delivery" },
  { dept: "Medical Records", tagClass: "tag-mr", name: "Chart Room Rehabilitation Update", due: "Jul 25, 2026", status: "pending", dateReported: "", pointPerson: "Grace Manlangit", notes: "" },
  { dept: "GSS", tagClass: "tag-gss", name: "BFP Compliance Checklist", due: "Jul 23, 2026", status: "overdue", dateReported: "", pointPerson: "Bong Sarmiento", notes: "Pending BFP inspection date" },
  { dept: "Accounting & Finance", tagClass: "tag-af", name: "Costing Review Summary", due: "Jul 28, 2026", status: "pending", dateReported: "", pointPerson: "Rhea Villamor", notes: "" },
  { dept: "IMRS", tagClass: "tag-imrs", name: "Veridata Sync Report", due: "Jul 18, 2026", status: "submitted", dateReported: "Jul 18, 2026", pointPerson: "Angel Fortuno", notes: "Synced successfully" },
  { dept: "OPD", tagClass: "tag-opd", name: "TB Patient HNO Log", due: "Jul 19, 2026", status: "submitted", dateReported: "Jul 19, 2026", pointPerson: "Grace Manlangit", notes: "" }
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
      <div class="dept-actions">
        <a href="#" class="dept-link" data-dept="${d.title}">
          Go to Reports
          <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
        <button type="button" class="dept-add-btn" data-add-report="${d.title}">
          <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          Add Report
        </button>
      </div>
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
let currentReportFilter = null;
function renderReporting(filterDept){
  currentReportFilter = filterDept || null;
  const body = document.getElementById("reportsTableBody");
  const rows = reports
    .map((r, i) => ({ ...r, _index: i }))
    .filter(r => !filterDept || r.dept === filterDept);
  body.innerHTML = rows.map(r => `
    <tr>
      <td><span class="dept-tag ${r.tagClass}">${r.dept}</span></td>
      <td class="cell-main">${r.name}</td>
      <td>${r.due}</td>
      <td>${r.dateReported || "—"}</td>
      <td>${r.pointPerson || "—"}</td>
      <td>${r.notes || "—"}</td>
      <td>${badge(r.status)}</td>
      <td class="cell-action"><button class="link-btn" data-index="${r._index}" data-report="${r.name}">${r.status === "submitted" ? "View" : "Submit"}</button></td>
    </tr>
  `).join("") || `<tr><td colspan="8" class="empty-row">No reports for this department.</td></tr>`;

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
  "View Schedules": "schedule",
  "Meeting Agenda": "meetings",
  "Documents": "documents",
  "Reports Archive": "archive"
};
const modalActionMap = {
  "Submit Report": () => openAddReportModal(),
  "New Meeting": openNewMeetingModal,
  "Upload Document": openUploadDocumentModal,
  "Add User": openAddUserModal
};
function setupQuickActions(){
  document.body.addEventListener("click", e => {
    const btn = e.target.closest("[data-action]");
    if(!btn) return;
    const action = btn.dataset.action;
    if(quickActionMap[action]){
      switchView(quickActionMap[action]);
      showToast(`Opened ${action}`);
    } else if(modalActionMap[action]){
      modalActionMap[action]();
    } else {
      showToast(`${action} — coming soon`);
    }
  });
}

// ---------- MODAL SYSTEM ----------
function openModal(html){
  document.getElementById("modal").innerHTML = html;
  document.getElementById("modalOverlay").classList.add("show");
  const firstField = document.querySelector("#modal input, #modal textarea, #modal select");
  if(firstField) firstField.focus();
}
function closeModal(){
  document.getElementById("modalOverlay").classList.remove("show");
}
function formatFileSize(bytes){
  if(bytes < 1024) return bytes + " B";
  if(bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}
function todayShort(){
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function openNewMeetingModal(){
  openModal(`
    <div class="modal-head">
      <h3>New Meeting</h3>
      <button type="button" class="modal-close" data-modal-close aria-label="Close">&times;</button>
    </div>
    <form id="newMeetingForm" class="modal-form">
      <label class="field"><span>Meeting title</span><input type="text" name="title" required placeholder="e.g. IT / HIMS Sync"></label>
      <label class="field"><span>Time</span><input type="text" name="time" placeholder="e.g. Today · 4:30 PM"></label>
      <label class="field"><span>Attendees</span><input type="text" name="attendees" placeholder="e.g. IT, GSS"></label>
      <label class="field"><span>Agenda items</span><textarea name="agenda" rows="4" placeholder="One item per line"></textarea></label>
      <div class="modal-actions">
        <button type="button" class="ghost-btn" data-modal-close>Cancel</button>
        <button type="submit" class="primary-btn">Create Meeting</button>
      </div>
    </form>
  `);
}

function openUploadDocumentModal(){
  const deptOptions = departments.map(d => d.title);
  openModal(`
    <div class="modal-head">
      <h3>Upload Document</h3>
      <button type="button" class="modal-close" data-modal-close aria-label="Close">&times;</button>
    </div>
    <form id="uploadDocForm" class="modal-form">
      <label class="field"><span>File</span><input type="file" name="file" id="docFileInput" required></label>
      <label class="field">
        <span>Department</span>
        <select name="dept">${deptOptions.map(d => `<option value="${d}">${d}</option>`).join("")}</select>
      </label>
      <div class="modal-actions">
        <button type="button" class="ghost-btn" data-modal-close>Cancel</button>
        <button type="submit" class="primary-btn">Upload</button>
      </div>
    </form>
  `);
}

function openAddUserModal(){
  openModal(`
    <div class="modal-head">
      <h3>Add User</h3>
      <button type="button" class="modal-close" data-modal-close aria-label="Close">&times;</button>
    </div>
    <form id="addUserForm" class="modal-form">
      <label class="field"><span>Full name</span><input type="text" name="name" required placeholder="e.g. Juan Dela Cruz"></label>
      <label class="field"><span>Role</span><input type="text" name="role" placeholder="e.g. Records Clerk"></label>
      <label class="field"><span>Department</span><input type="text" name="dept" placeholder="e.g. Medical Records"></label>
      <div class="modal-actions">
        <button type="button" class="ghost-btn" data-modal-close>Cancel</button>
        <button type="submit" class="primary-btn">Add User</button>
      </div>
    </form>
  `);
}

function openAddReportModal(presetDept){
  const deptTagMap = Object.fromEntries(departments.map(d => [d.title, d.tagClass]));
  const deptOptions = departments.map(d => d.title);
  openModal(`
    <div class="modal-head">
      <h3>Add Report</h3>
      <button type="button" class="modal-close" data-modal-close aria-label="Close">&times;</button>
    </div>
    <form id="addReportForm" class="modal-form">
      <label class="field">
        <span>Department</span>
        <select name="dept" required>
          ${deptOptions.map(d => `<option value="${d}" ${d === presetDept ? "selected" : ""}>${d}</option>`).join("")}
        </select>
      </label>
      <label class="field"><span>Report name</span><input type="text" name="name" required placeholder="e.g. Admissions Summary — July"></label>
      <label class="field"><span>Due date</span><input type="text" name="due" required placeholder="e.g. Jul 30, 2026"></label>
      <label class="field"><span>Date reported</span><input type="text" name="dateReported" placeholder="e.g. Jul 25, 2026 (leave blank if not yet reported)"></label>
      <label class="field"><span>Point person</span><input type="text" name="pointPerson" placeholder="e.g. Juan Dela Cruz"></label>
      <label class="field"><span>Notes</span><textarea name="notes" rows="3" placeholder="Optional notes"></textarea></label>
      <div class="modal-actions">
        <button type="button" class="ghost-btn" data-modal-close>Cancel</button>
        <button type="submit" class="primary-btn">Add Report</button>
      </div>
    </form>
  `);
  // stash the dept->tagClass map on the form for use at submit time
  document.getElementById("addReportForm").dataset.deptTagMap = JSON.stringify(deptTagMap);
}

function openViewReportModal(idx){
  const report = reports[idx];
  if(!report) return;
  openModal(`
    <div class="modal-head">
      <h3>${report.name}</h3>
      <button type="button" class="modal-close" data-modal-close aria-label="Close">&times;</button>
    </div>
    <div class="modal-form">
      <label class="field"><span>Department</span>
        <div><span class="dept-tag ${report.tagClass}">${report.dept}</span></div>
      </label>
      <label class="field"><span>Due date</span><div>${report.due}</div></label>
      <label class="field"><span>Date reported</span><div>${report.dateReported || "—"}</div></label>
      <label class="field"><span>Point person</span><div>${report.pointPerson || "—"}</div></label>
      <label class="field"><span>Notes</span><div>${report.notes || "—"}</div></label>
      <label class="field"><span>Status</span><div>${badge(report.status)}</div></label>
      <div class="modal-actions">
        <button type="button" class="ghost-btn" data-report-delete="${idx}">Delete</button>
        <button type="button" class="ghost-btn" data-report-edit="${idx}">Edit</button>
        <button type="button" class="primary-btn" data-modal-close>Close</button>
      </div>
    </div>
  `);
}

function openEditReportModal(idx){
  const report = reports[idx];
  if(!report) return;
  openModal(`
    <div class="modal-head">
      <h3>Edit Report</h3>
      <button type="button" class="modal-close" data-modal-close aria-label="Close">&times;</button>
    </div>
    <form id="editReportForm" class="modal-form" data-report-index="${idx}">
      <label class="field"><span>Report name</span><input type="text" name="name" required value="${report.name}"></label>
      <label class="field"><span>Due date</span><input type="text" name="due" required value="${report.due}"></label>
      <label class="field"><span>Date reported</span><input type="text" name="dateReported" value="${report.dateReported || ""}" placeholder="e.g. Jul 25, 2026"></label>
      <label class="field"><span>Point person</span><input type="text" name="pointPerson" value="${report.pointPerson || ""}"></label>
      <label class="field"><span>Notes</span><textarea name="notes" rows="3">${report.notes || ""}</textarea></label>
      <div class="modal-actions">
        <button type="button" class="ghost-btn" data-modal-close>Cancel</button>
        <button type="submit" class="primary-btn">Save Changes</button>
      </div>
    </form>
  `);
}

function setupModal(){
  const overlay = document.getElementById("modalOverlay");

  overlay.addEventListener("click", e => {
    const deleteBtn = e.target.closest("[data-report-delete]");
    if(deleteBtn){
      const idx = Number(deleteBtn.dataset.reportDelete);
      const report = reports[idx];
      if(report && confirm(`Delete "${report.name}"? This can't be undone.`)){
        reports.splice(idx, 1);
        renderReporting(currentReportFilter);
        closeModal();
        showToast(`Deleted "${report.name}"`);
      }
      return;
    }

    const editBtn = e.target.closest("[data-report-edit]");
    if(editBtn){
      openEditReportModal(Number(editBtn.dataset.reportEdit));
      return;
    }

    if(e.target === overlay || e.target.closest("[data-modal-close]")) closeModal();
  });

  document.addEventListener("keydown", e => {
    if(e.key === "Escape" && overlay.classList.contains("show")) closeModal();
  });

  overlay.addEventListener("submit", e => {
    e.preventDefault();
    const form = e.target;

    if(form.id === "editReportForm"){
      const idx = Number(form.dataset.reportIndex);
      const report = reports[idx];
      if(!report) return;
      const fd = new FormData(form);
      const name = fd.get("name").trim();
      const due = fd.get("due").trim();
      if(!name || !due) return;
      report.name = name;
      report.due = due;
      report.dateReported = fd.get("dateReported").trim();
      report.pointPerson = fd.get("pointPerson").trim();
      report.notes = fd.get("notes").trim();
      renderReporting(currentReportFilter);
      closeModal();
      showToast(`Updated "${report.name}"`);
      return;
    }

    if(form.id === "addReportForm"){
      const fd = new FormData(form);
      const dept = fd.get("dept");
      const name = fd.get("name").trim();
      const due = fd.get("due").trim();
      if(!dept || !name || !due) return;
      const dateReported = fd.get("dateReported").trim();
      const deptTagMap = JSON.parse(form.dataset.deptTagMap || "{}");
      reports.unshift({
        dept,
        tagClass: deptTagMap[dept] || "tag-imrs",
        name,
        due,
        status: dateReported ? "submitted" : "pending",
        dateReported,
        pointPerson: fd.get("pointPerson").trim(),
        notes: fd.get("notes").trim()
      });
      renderReporting(currentReportFilter);
      closeModal();
      showToast(`Added "${name}" for ${dept}`);
      return;
    }

    if(form.id === "newMeetingForm"){
      const fd = new FormData(form);
      const title = fd.get("title").trim();
      if(!title) return;
      const agenda = fd.get("agenda").split("\n").map(s => s.trim()).filter(Boolean);
      meetings.unshift({
        title,
        time: fd.get("time").trim() || "Time TBD",
        attendees: fd.get("attendees").trim() || "TBD",
        agenda: agenda.length ? agenda : ["No agenda items yet"]
      });
      renderMeetings();
      closeModal();
      showToast(`Meeting "${title}" created`);
    }

    if(form.id === "uploadDocForm"){
      const fileInput = document.getElementById("docFileInput");
      const file = fileInput.files[0];
      if(!file){ showToast("Choose a file first"); return; }
      const dept = new FormData(form).get("dept");
      documents.unshift({
        name: file.name,
        dept,
        uploaded: todayShort(),
        size: formatFileSize(file.size)
      });
      renderDocuments();
      closeModal();
      showToast(`${file.name} uploaded`);
    }

    if(form.id === "addUserForm"){
      const fd = new FormData(form);
      const name = fd.get("name").trim();
      if(!name) return;
      users.unshift({
        name,
        role: fd.get("role").trim() || "Staff",
        dept: fd.get("dept").trim() || "—",
        status: "active"
      });
      renderUsers();
      closeModal();
      showToast(`${name} added`);
    }
  });
}

// ---------- DEPT LINKS ----------
function setupDeptLinks(){
  document.getElementById("deptGrid").addEventListener("click", e => {
    const addBtn = e.target.closest("[data-add-report]");
    if(addBtn){
      openAddReportModal(addBtn.dataset.addReport);
      return;
    }
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
    const idx = Number(btn.dataset.index);
    const report = reports[idx];
    if(!report) return;

    if(btn.textContent.trim() === "Submit"){
      report.status = "submitted";
      report.dateReported = todayShort();
      renderReporting(currentReportFilter);
      showToast(`Submitted "${report.name}"`);
    } else {
      openViewReportModal(idx);
    }
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
  setupModal();
});
