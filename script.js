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

// ---------- GREETING BASED ON TIME OF DAY ----------
function setGreeting(){
  const hour = new Date().getHours();
  let part = "morning";
  if(hour >= 12 && hour < 18) part = "afternoon";
  else if(hour >= 18) part = "evening";
  document.getElementById("greeting").textContent = `Good ${part}, Lito!`;
}

// ---------- TOAST ----------
function showToast(message){
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---------- NAV SWITCHING ----------
function setupNav(){
  const items = document.querySelectorAll(".nav-item");
  items.forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      items.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const label = item.textContent.trim();
      showToast(`${label} — coming soon`);
    });
  });
}

// ---------- QUICK ACTIONS ----------
function setupQuickActions(){
  document.querySelectorAll(".qa-btn").forEach(btn => {
    btn.addEventListener("click", () => showToast(`${btn.dataset.action} — coming soon`));
  });
}

// ---------- DEPT LINKS ----------
function setupDeptLinks(){
  document.getElementById("deptGrid").addEventListener("click", e => {
    const link = e.target.closest(".dept-link");
    if(!link) return;
    e.preventDefault();
    showToast(`Opening ${link.dataset.dept} reports…`);
  });
}

// ---------- MISC BUTTONS ----------
function setupMisc(){
  document.getElementById("bellBtn").addEventListener("click", () => showToast("No new notifications"));
  document.getElementById("viewFullSchedule").addEventListener("click", () => showToast("Opening full schedule…"));
  document.getElementById("logoutBtn").addEventListener("click", () => showToast("Logging out…"));
}

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  renderDepartments();
  renderSchedule();
  animateCounters();
  setGreeting();
  setupNav();
  setupQuickActions();
  setupDeptLinks();
  setupMisc();
});
