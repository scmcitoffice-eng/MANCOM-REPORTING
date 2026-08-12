// ---------- FIREBASE ----------
import { db } from "./firebase-init.js";
import {
  ref, onValue, push, set, update, remove, get, child
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const reportsRef = ref(db, "reports");
const meetingsRef = ref(db, "meetings");
const usersRef = ref(db, "users");

// ---------- CURRENT SESSION ----------
// Populated by login.js on successful sign-in (see sessionStorage keys below).
// Falls back to placeholder values only if something bypassed the login flow.
let currentUser = { id: "", name: "Staff", role: "Staff", accountRole: "user" };
try {
  const stored = JSON.parse(sessionStorage.getItem("scmc_current_user") || "null");
  if(stored) currentUser = stored;
} catch(err) {
  console.error("Failed to read stored session user:", err);
}

function initials(name){
  return (name || "").trim().split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";
}

function applyCurrentUserToChrome(){
  document.querySelectorAll(".who-name, .user-name").forEach(el => el.textContent = currentUser.name);
  document.querySelectorAll(".who-role, .user-role").forEach(el => el.textContent = currentUser.role);
  document.querySelectorAll(".avatar, .user-avatar").forEach(el => el.textContent = initials(currentUser.name));
  const settingName = document.getElementById("settingName");
  if(settingName) settingName.value = currentUser.name;

  // Only admin accounts get the Users nav item at all.
  const usersNavItem = document.getElementById("usersNavItem");
  if(usersNavItem) usersNavItem.hidden = currentUser.accountRole !== "admin";
}
// ---------- NOTIFICATIONS ----------
// Bell notifications for: (1) a report being added (by anyone, since
// reports sync live from Realtime Database), and (2) a meeting starting
// within the next hour. State is kept in localStorage so read/unread
// status and "already notified" bookkeeping survive a page reload.
const NOTIF_STORAGE_KEY = "scmc_notifications";
const SEEN_REPORTS_KEY = "scmc_seen_report_ids";
const NOTIFIED_MEETINGS_KEY = "scmc_notified_meeting_ids";
const MEETING_REMINDER_WINDOW_MS = 60 * 60 * 1000; // notify within 1hr of start
const MEETING_REMINDER_GRACE_MS = 5 * 60 * 1000;   // don't notify for meetings that already started >5min ago

function loadJson(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch(err) {
    console.error(`Failed to read ${key} from localStorage:`, err);
    return fallback;
  }
}
function loadIdSet(key){
  return new Set(loadJson(key, []));
}
function saveIdSet(key, set){
  try { localStorage.setItem(key, JSON.stringify([...set])); }
  catch(err) { console.error(`Failed to save ${key} to localStorage:`, err); }
}

let notifications = loadJson(NOTIF_STORAGE_KEY, []);
let seenReportIds = loadIdSet(SEEN_REPORTS_KEY);
let notifiedMeetingIds = loadIdSet(NOTIFIED_MEETINGS_KEY);
let reportsInitialized = false;

function saveNotifications(){
  notifications = notifications.slice(0, 50);
  try { localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications)); }
  catch(err) { console.error("Failed to save notifications to localStorage:", err); }
}

function addNotification({ type, title, message }){
  notifications.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type, title, message,
    time: Date.now(),
    read: false
  });
  saveNotifications();
  renderNotifications();
}

function timeAgo(ts){
  const diffMin = Math.round(Math.max(0, Date.now() - ts) / 60000);
  if(diffMin < 1) return "Just now";
  if(diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if(diffHr < 24) return `${diffHr}h ago`;
  return `${Math.round(diffHr / 24)}d ago`;
}

const notifIcons = {
  report: `<svg viewBox="0 0 24 24" width="15" height="15"><rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>`,
  meeting: `<svg viewBox="0 0 24 24" width="15" height="15"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`
};

function renderNotifications(){
  const unreadCount = notifications.filter(n => !n.read).length;
  const bellBtn = document.getElementById("bellBtn");
  const dot = document.getElementById("bellDot");
  if(bellBtn) bellBtn.classList.toggle("has-unread", unreadCount > 0);
  if(dot) dot.style.display = unreadCount > 0 ? "block" : "none";

  const list = document.getElementById("notifList");
  if(!list) return;
  list.innerHTML = notifications.length
    ? notifications.map(n => `
        <button type="button" class="notif-item ${n.read ? "" : "unread"}" data-notif-id="${n.id}">
          <span class="notif-icon notif-icon-${n.type}">${notifIcons[n.type] || notifIcons.report}</span>
          <span class="notif-body">
            <span class="notif-title">${n.title}</span>
            <span class="notif-message">${n.message}</span>
            <span class="notif-time">${timeAgo(n.time)}</span>
          </span>
        </button>
      `).join("")
    : `<div class="notif-empty">No notifications yet</div>`;
}

function formatMeetingStart(ts){
  return new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

// Scans meetings for any with a `startAt` timestamp that has just entered
// the "starts within the hour" window and fires a one-time reminder.
function checkMeetingReminders(){
  const now = Date.now();
  let changed = false;
  meetings.forEach(m => {
    if(!m.startAt || notifiedMeetingIds.has(m.id)) return;
    const msUntilStart = m.startAt - now;
    if(msUntilStart <= MEETING_REMINDER_WINDOW_MS && msUntilStart > -MEETING_REMINDER_GRACE_MS){
      notifiedMeetingIds.add(m.id);
      changed = true;
      addNotification({
        type: "meeting",
        title: "Meeting starting soon",
        message: `"${m.title}" starts at ${formatMeetingStart(m.startAt)}`
      });
      showToast(`Reminder: "${m.title}" starts in about an hour`);
    }
  });
  if(changed) saveIdSet(NOTIFIED_MEETINGS_KEY, notifiedMeetingIds);
}

function setupNotifications(){
  const bellBtn = document.getElementById("bellBtn");
  const panel = document.getElementById("notifPanel");
  const markAllBtn = document.getElementById("markAllReadBtn");
  if(!bellBtn || !panel) return;

  bellBtn.addEventListener("click", e => {
    e.stopPropagation();
    panel.classList.toggle("show");
  });

  panel.addEventListener("click", e => {
    e.stopPropagation();
    const item = e.target.closest("[data-notif-id]");
    if(!item) return;
    const notif = notifications.find(n => n.id === item.dataset.notifId);
    if(notif && !notif.read){
      notif.read = true;
      saveNotifications();
      renderNotifications();
    }
  });

  markAllBtn.addEventListener("click", e => {
    e.stopPropagation();
    let changed = false;
    notifications.forEach(n => { if(!n.read){ n.read = true; changed = true; } });
    if(changed){ saveNotifications(); renderNotifications(); }
  });

  document.addEventListener("click", () => panel.classList.remove("show"));

  renderNotifications();
}

// Flags that record whether the one-time seed has already run, so that
// deleting every report/meeting/user doesn't make the app think the collection
// was "never seeded" and write the seed data back in on the next reload.
const reportsSeededRef = ref(db, "_meta/reportsSeeded");
const meetingsSeededRef = ref(db, "_meta/meetingsSeeded");
const usersSeededRef = ref(db, "_meta/usersSeeded");

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

// One-time seed data — only written the very first time the app runs
// against a Firebase project (tracked via the reportsSeededRef flag).
// After that, Firebase is the single source of truth and this array is
// unused, even if every report is later deleted.
const seedReports = [
  { dept: "IMRS", tagClass: "tag-imrs", name: "Admissions Summary — June", due: "Jul 24, 2026", status: "pending", dateReported: "", pointPerson: "Angel Fortuno", notes: "" },
  { dept: "OPD", tagClass: "tag-opd", name: "HEPA Filter Inspection Log", due: "Jul 22, 2026", status: "overdue", dateReported: "", pointPerson: "Grace Manlangit", notes: "Awaiting filter delivery" },
  { dept: "Medical Records", tagClass: "tag-mr", name: "Chart Room Rehabilitation Update", due: "Jul 25, 2026", status: "pending", dateReported: "", pointPerson: "Grace Manlangit", notes: "" },
  { dept: "GSS", tagClass: "tag-gss", name: "BFP Compliance Checklist", due: "Jul 23, 2026", status: "overdue", dateReported: "", pointPerson: "Bong Sarmiento", notes: "Pending BFP inspection date" },
  { dept: "Accounting & Finance", tagClass: "tag-af", name: "Costing Review Summary", due: "Jul 28, 2026", status: "pending", dateReported: "", pointPerson: "Rhea Villamor", notes: "" },
  { dept: "IMRS", tagClass: "tag-imrs", name: "Veridata Sync Report", due: "Jul 18, 2026", status: "submitted", dateReported: "Jul 18, 2026", pointPerson: "Angel Fortuno", notes: "Synced successfully" },
  { dept: "OPD", tagClass: "tag-opd", name: "TB Patient HNO Log", due: "Jul 19, 2026", status: "submitted", dateReported: "Jul 19, 2026", pointPerson: "Grace Manlangit", notes: "" }
];

// Live-synced from Firestore. Populated by watchReports() below; do not
// push/splice this directly — write to Firestore and let the listener update it.
let reports = [];

async function seedReportsIfEmpty(){
  const seededSnap = await get(reportsSeededRef);
  if(seededSnap.exists()) return;
  const updates = {};
  seedReports.forEach(r => {
    const newKey = push(reportsRef).key;
    updates[newKey] = { ...r, createdAt: Date.now() };
  });
  await update(reportsRef, updates);
  await set(reportsSeededRef, true);
}

function watchReports(){
  onValue(reportsRef, snap => {
    const val = snap.val() || {};
    reports = Object.entries(val)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // Notify for reports that showed up after the dashboard's initial load
    // (covers reports added by this user or synced in from anyone else).
    if(reportsInitialized){
      let changed = false;
      reports.forEach(r => {
        if(!seenReportIds.has(r.id)){
          seenReportIds.add(r.id);
          changed = true;
          addNotification({
            type: "report",
            title: "New report added",
            message: `${r.name} — ${r.dept}`
          });
        }
      });
      if(changed) saveIdSet(SEEN_REPORTS_KEY, seenReportIds);
    } else {
      reports.forEach(r => seenReportIds.add(r.id));
      saveIdSet(SEEN_REPORTS_KEY, seenReportIds);
      reportsInitialized = true;
    }

    renderReporting(currentReportFilter);
    renderReportSummary();
    renderReportAnalytics();
  }, err => {
    console.error("Failed to load reports from Realtime Database:", err);
    showToast(`Couldn't load reports: ${err.message || err.code || err}`);
  });
}

// One-time seed data — only written the very first time the app runs
// against a Firebase project (tracked via the meetingsSeededRef flag).
// After that, Firebase is the single source of truth and this array is
// unused, even if every meeting is later deleted.
const seedMeetings = [
  { title: "IMRS / OPD Updates", time: "Today · 3:41 PM", attendees: "HA, HD, MD, GSS, Marketing", agenda: ["Review admission numbers", "Discuss OPD signage rollout", "HNO status for TB patients"] },
  { title: "GSS Facilities Sync", time: "Today · 3:53 PM", attendees: "GSS, Engineering", agenda: ["BFP requirements walkthrough", "Dialysis renovation timeline"] },
  { title: "Accounting & Finance Costing Review", time: "Today · 3:57 PM", attendees: "Finance Team", agenda: ["Review updated cost sheets", "Approve pricing committee changes"] },
  { title: "IT / HIMS Check", time: "Today · 4:43 PM", attendees: "IT, Mr. Angel", agenda: ["HIMS charging/discharging check in OPD"] }
];

// Live-synced from Firestore. Populated by watchMeetings() below; do not
// push/splice this directly — write to Firestore and let the listener update it.
let meetings = [];

async function seedMeetingsIfEmpty(){
  const seededSnap = await get(meetingsSeededRef);
  if(seededSnap.exists()) return;
  const updates = {};
  seedMeetings.forEach(m => {
    const newKey = push(meetingsRef).key;
    updates[newKey] = { ...m, createdAt: Date.now() };
  });
  await update(meetingsRef, updates);
  await set(meetingsSeededRef, true);
}

function watchMeetings(){
  onValue(meetingsRef, snap => {
    const val = snap.val() || {};
    meetings = Object.entries(val)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    renderMeetings();
    checkMeetingReminders();
  }, err => {
    console.error("Failed to load meetings from Realtime Database:", err);
    showToast(`Couldn't load meetings: ${err.message || err.code || err}`);
  });
}

// One-time seed data — only written the very first time the app runs
// against a Firebase project (tracked via the usersSeededRef flag).
// After that, Firebase is the single source of truth and this array is
// unused, even if every user is later removed.
const seedUsers = [
  { name: "Lito Cabajar", role: "IT Officer", dept: "IT", username: "l.cabajar", password: "p@ssw0rd", accountRole: "admin", status: "active" },
  { name: "Grace Manlangit", role: "Records Supervisor", dept: "Medical Records", username: "g.manlangit", password: "p@ssw0rd", accountRole: "user", status: "active" },
  { name: "Angel Fortuno", role: "IT Support", dept: "IT", username: "a.fortuno", password: "p@ssw0rd", accountRole: "admin", status: "active" },
  { name: "Rhea Villamor", role: "Finance Officer", dept: "Accounting & Finance", username: "r.villamor", password: "p@ssw0rd", accountRole: "user", status: "active" },
  { name: "Bong Sarmiento", role: "GSS Coordinator", dept: "GSS", username: "b.sarmiento", password: "p@ssw0rd", accountRole: "user", status: "inactive" }
];

// Live-synced from Firebase. Populated by watchUsers() below; do not
// push/splice this directly — write to Firebase and let the listener update it.
let users = [];

async function seedUsersIfEmpty(){
  const seededSnap = await get(usersSeededRef);
  if(seededSnap.exists()) return;
  const updates = {};
  seedUsers.forEach((u, i) => {
    const newKey = push(usersRef).key;
    // Stagger createdAt so the original seed order is preserved once sorted.
    updates[newKey] = { ...u, createdAt: Date.now() - (seedUsers.length - i) };
  });
  await update(usersRef, updates);
  await set(usersSeededRef, true);
}

function watchUsers(){
  onValue(usersRef, snap => {
    const val = snap.val() || {};
    users = Object.entries(val)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    renderUsers();
  }, err => {
    console.error("Failed to load users from Realtime Database:", err);
    showToast(`Couldn't load users: ${err.message || err.code || err}`);
  });
}

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

const documents = [
  { name: "Admissions_Policy_2026.pdf", dept: "IMRS", uploaded: "Jul 15, 2026", size: "1.2 MB" },
  { name: "BFP_Compliance_Checklist.docx", dept: "GSS", uploaded: "Jul 18, 2026", size: "340 KB" },
  { name: "Costing_Sheet_Q3.xlsx", dept: "Accounting & Finance", uploaded: "Jul 19, 2026", size: "2.1 MB" },
  { name: "Chart_Room_Layout.pdf", dept: "Medical Records", uploaded: "Jul 12, 2026", size: "890 KB" },
  { name: "OPD_Signage_Plan.pdf", dept: "OPD", uploaded: "Jul 9, 2026", size: "1.6 MB" }
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

// ---------- REPORT COUNT HELPER ----------
function computeReportCounts(){
  const counts = { overdue: 0, pending: 0, submitted: 0, completed: 0 };
  reports.forEach(r => {
    if(counts[r.status] !== undefined) counts[r.status]++;
  });
  const total = counts.overdue + counts.pending + counts.submitted + counts.completed;
  return { counts, total };
}

// ---------- RENDER REPORT ANALYTICS (hero) ----------
function renderReportAnalytics(){
  const panel = document.getElementById("analyticsPanel");
  if(!panel) return;

  const { counts, total } = computeReportCounts();
  const segments = [
    { key: "overdue",   label: "Overdue",   color: "#c1493c", count: counts.overdue },
    { key: "pending",   label: "Pending",   color: "#b3721a", count: counts.pending },
    { key: "submitted", label: "On Going", color: "#1f8a4d", count: counts.submitted },
    { key: "completed", label: "Completed", color: "#2860c9", count: counts.completed }
  ];

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const arcs = total === 0
    ? `<circle cx="59" cy="59" r="${radius}" fill="none" stroke="#e7ebe9" stroke-width="14"/>`
    : segments.filter(s => s.count > 0).map(s => {
        const frac = s.count / total;
        const dash = frac * circumference;
        const circle = `<circle cx="59" cy="59" r="${radius}" fill="none" stroke="${s.color}" stroke-width="14"
          stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-offset}" stroke-linecap="butt"/>`;
        offset += dash;
        return circle;
      }).join("");

  const onTimeRate = total === 0 ? 0 : Math.round((counts.submitted / total) * 100);
  const completionRate = total === 0 ? 0 : Math.round((counts.completed / total) * 100);

  panel.innerHTML = `
    <div class="analytics-donut">
      <svg viewBox="0 0 118 118" width="118" height="118">${arcs}</svg>
      <div class="analytics-donut-total">
        <span class="num">${total}</span>
        <span class="lbl">Reports</span>
      </div>
    </div>
    <div class="analytics-breakdown">
      ${segments.map(s => `
        <div class="analytics-item">
          <span class="name"><span class="dot" style="background:${s.color}"></span>${s.label}</span>
          <span class="val">${s.count}</span>
        </div>
      `).join("")}
    </div>
    <div class="analytics-rate">
      <div class="rate-item">
        <div class="num">${onTimeRate}%</div>
        <div class="lbl">On Going this week</div>
      </div>
      <div class="rate-item">
        <div class="num rate-completed">${completionRate}%</div>
        <div class="lbl">Completion rate</div>
      </div>
    </div>
  `;
}

// ---------- RENDER REPORT SUMMARY ----------
function renderReportSummary(){
  const statsEl = document.getElementById("reportSummaryStats");
  const listEl = document.getElementById("reportSummaryList");
  if(!statsEl || !listEl) return;

  const { counts } = computeReportCounts();

  statsEl.innerHTML = `
    <div class="rs-stat rs-overdue">
      <span class="rs-count">${counts.overdue}</span>
      <span class="rs-label">Overdue</span>
    </div>
    <div class="rs-stat rs-pending">
      <span class="rs-count">${counts.pending}</span>
      <span class="rs-label">Pending</span>
    </div>
    <div class="rs-stat rs-submitted">
      <span class="rs-count">${counts.submitted}</span>
      <span class="rs-label">On Going</span>
    </div>
    <div class="rs-stat rs-completed">
      <span class="rs-count">${counts.completed}</span>
      <span class="rs-label">Completed</span>
    </div>
  `;

  const statusRank = { overdue: 0, pending: 1, submitted: 2, completed: 3 };
  const upcoming = [...reports]
    .filter(r => r.status !== "submitted" && r.status !== "completed")
    .sort((a, b) => (statusRank[a.status] ?? 4) - (statusRank[b.status] ?? 4))
    .slice(0, 4);

  listEl.innerHTML = upcoming.map(r => `
    <li class="timeline-item ${r.status === 'pending' ? 'upcoming' : ''}">
      <div class="t-time">Due ${r.due}</div>
      <div class="t-row">
        <div>
          <div class="t-title">${r.name}</div>
          <div class="t-desc"><span class="dept-tag ${r.tagClass}">${r.dept}</span></div>
        </div>
        ${badge(r.status)}
      </div>
    </li>
  `).join("") || `<li class="empty-row" style="border-left:2px solid transparent;">No reports pending.</li>`;
}

// ---------- STATUS HELPERS ----------
const statusMeta = {
  pending:   { label: "Pending",   cls: "badge-upcoming" },
  overdue:   { label: "Overdue",   cls: "badge-overdue" },
  submitted: { label: "On Going", cls: "badge-ongoing" },
  approved:  { label: "Approved",  cls: "badge-ongoing" },
  revision:  { label: "Needs Revision", cls: "badge-overdue" },
  processing:{ label: "Processing", cls: "badge-upcoming" },
  ready:     { label: "Ready",     cls: "badge-started" },
  completed: { label: "Completed", cls: "badge-started" },
  active:    { label: "Active",    cls: "badge-ongoing" },
  inactive:  { label: "Inactive",  cls: "badge-overdue" }
};
function badge(status){
  const m = statusMeta[status] || { label: status, cls: "badge-upcoming" };
  return `<span class="badge ${m.cls}">${m.label}</span>`;
}

// ---------- ACCOUNT ROLE HELPER ----------
function roleBadge(accountRole){
  const isAdmin = accountRole === "admin";
  return `<span class="badge ${isAdmin ? "badge-role-admin" : "badge-role-user"}">${isAdmin ? "Admin" : "User"}</span>`;
}

// Builds <option> tags from the same department list that drives the
// Department Reports grid, so Users always chooses from a real department.
function deptOptionsHtml(selected){
  return departments.map(d =>
    `<option value="${d.title}" ${d.title === selected ? "selected" : ""}>${d.title}</option>`
  ).join("");
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
      <td class="cell-notes">${r.notes || "—"}</td>
      <td>${badge(r.status)}</td>
      <td class="cell-action">
        <button class="link-btn" data-action="view" data-index="${r._index}">View</button>
        <button class="link-btn" data-action="edit" data-index="${r._index}">Edit</button>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="8" class="empty-row">No reports for this department.</td></tr>`;

  const filters = document.getElementById("reportFilters");
  const depts = ["All", ...new Set(reports.map(r => r.dept))];
  filters.innerHTML = depts.map(d => `<button class="chip ${(!filterDept && d === "All") || d === filterDept ? "chip-active" : ""}" data-filter="${d}">${d}</button>`).join("");
}

// ---------- EXPORT REPORTS TO EXCEL ----------
function exportReportsToExcel(){
  if(!window.XLSX){
    showToast("Export library failed to load. Check your connection and try again.");
    return;
  }
  const rows = reports
    .filter(r => !currentReportFilter || r.dept === currentReportFilter)
    .map(r => ({
      "Department": r.dept,
      "Report": r.name,
      "Due Date": r.due,
      "Date Reported": r.dateReported || "",
      "Point Person": r.pointPerson || "",
      "Notes": r.notes || "",
      "Status": (r.status || "").charAt(0).toUpperCase() + (r.status || "").slice(1)
    }));

  if(rows.length === 0){
    showToast("No reports to export.");
    return;
  }

  const sheet = window.XLSX.utils.json_to_sheet(rows);
  sheet["!cols"] = [
    { wch: 22 }, // Department
    { wch: 36 }, // Report
    { wch: 14 }, // Due Date
    { wch: 16 }, // Date Reported
    { wch: 20 }, // Point Person
    { wch: 30 }, // Notes
    { wch: 12 }  // Status
  ];

  const workbook = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(workbook, sheet, "Reports");

  const today = new Date().toISOString().slice(0, 10);
  const deptLabel = currentReportFilter ? currentReportFilter.replace(/[^a-z0-9]+/gi, "-") : "All-Departments";
  window.XLSX.writeFile(workbook, `Reports_${deptLabel}_${today}.xlsx`);
  showToast(`Exported ${rows.length} report${rows.length === 1 ? "" : "s"} to Excel`);
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
  grid.innerHTML = meetings.map((m, i) => `
    <article class="meeting-card">
      <div class="meeting-top">
        <h3>${m.title}</h3>
        <span class="meeting-time">${m.time}</span>
      </div>
      ${m.startAt ? `<span class="meeting-reminder">
          <svg viewBox="0 0 24 24" width="12" height="12"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          Reminder set for 1hr before · ${formatMeetingStart(m.startAt)}
        </span>` : ""}
      <p class="meeting-attendees">${m.attendees}</p>
      <ul class="meeting-agenda">
        ${m.agenda.map(a => `<li>${a}</li>`).join("")}
      </ul>
      <div class="meeting-actions">
        <button type="button" class="link-btn" data-meeting-edit="${i}">Edit</button>
        <button type="button" class="link-btn link-btn-danger" data-meeting-delete="${i}">Delete</button>
      </div>
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
  body.innerHTML = users.map(u => `
    <tr>
      <td class="cell-main">${u.name}</td>
      <td>${u.role}</td>
      <td>${u.dept}</td>
      <td>${roleBadge(u.accountRole)}</td>
      <td>${badge(u.status)}${u.mustChangePassword ? ` <span class="badge badge-upcoming">Pending setup</span>` : ""}</td>
      <td class="cell-action">
        <button class="link-btn" data-user-edit="${u.id}">Edit</button>
        <button class="link-btn" data-user-toggle="${u.id}">${u.status === "active" ? "Deactivate" : "Activate"}</button>
        <button class="link-btn link-btn-danger" data-user-delete="${u.id}">Delete</button>
      </td>
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
  users: renderUsers
};

function switchView(viewId, opts){
  const views = document.querySelectorAll(".view");
  views.forEach(v => v.classList.toggle("active", v.id === `view-${viewId}`));

  const items = document.querySelectorAll(".nav-item");
  items.forEach(i => i.classList.toggle("active", i.dataset.view === viewId));

  if(viewInit[viewId]) viewInit[viewId]();
  if(opts && opts.dept && viewId === "reporting") renderReporting(opts.dept);

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
      if(view === "users"){
        // Belt-and-suspenders: the nav item is hidden for non-admins already,
        // but re-check here in case accountRole changed after page load.
        if(currentUser.accountRole !== "admin"){
          showToast("Only admins can access Users.");
          return;
        }
        openConfirmPasswordModal({
          title: "Confirm Access",
          message: "Enter your account password to open Users.",
          onSuccess: () => switchView("users")
        });
        return;
      }
      switchView(view);
    });
  });
}

// ---------- REAUTH FOR SENSITIVE VIEWS ----------
// Re-checks the signed-in user's password against Firebase before letting
// them through to a sensitive area (currently: Users). Fetches the user's
// record fresh each time rather than trusting anything cached client-side.
let pendingPasswordConfirm = null;

function openConfirmPasswordModal({ title, message, onSuccess }){
  pendingPasswordConfirm = { onSuccess };
  openModal(`
    <div class="modal-head">
      <h3>${title}</h3>
      <button type="button" class="modal-close" data-modal-close aria-label="Close">&times;</button>
    </div>
    <form id="confirmPasswordForm" class="modal-form">
      <p class="confirm-hint">${message}</p>
      <div class="confirm-error" id="confirmPasswordError" hidden></div>
      <label class="field">
        <span>Password</span>
        <input type="password" name="password" required autocomplete="current-password" autofocus>
      </label>
      <div class="modal-actions">
        <button type="button" class="ghost-btn" data-modal-close>Cancel</button>
        <button type="submit" class="primary-btn">Confirm</button>
      </div>
    </form>
  `);
}

// ---------- QUICK ACTIONS ----------
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
    if(modalActionMap[action]){
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
  pendingPasswordConfirm = null;
}
function formatFileSize(bytes){
  if(bytes < 1024) return bytes + " B";
  if(bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}
function todayShort(){
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
// Formats an epoch-ms timestamp for a <input type="datetime-local"> value.
function toDatetimeLocalValue(ts){
  if(!ts) return "";
  const d = new Date(ts);
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
      <label class="field">
        <span>Starts at (for the 1-hour reminder)</span>
        <input type="datetime-local" name="startAt">
      </label>
      <label class="field"><span>Attendees</span><input type="text" name="attendees" placeholder="e.g. IT, GSS"></label>
      <label class="field"><span>Agenda items</span><textarea name="agenda" rows="4" placeholder="One item per line"></textarea></label>
      <div class="modal-actions">
        <button type="button" class="ghost-btn" data-modal-close>Cancel</button>
        <button type="submit" class="primary-btn">Create Meeting</button>
      </div>
    </form>
  `);
}

function openEditMeetingModal(idx){
  const meeting = meetings[idx];
  if(!meeting) return;
  openModal(`
    <div class="modal-head">
      <h3>Edit Meeting</h3>
      <button type="button" class="modal-close" data-modal-close aria-label="Close">&times;</button>
    </div>
    <form id="editMeetingForm" class="modal-form" data-meeting-index="${idx}">
      <label class="field"><span>Meeting title</span><input type="text" name="title" required value="${meeting.title}"></label>
      <label class="field"><span>Time</span><input type="text" name="time" value="${meeting.time}" placeholder="e.g. Today · 4:30 PM"></label>
      <label class="field">
        <span>Starts at (for the 1-hour reminder)</span>
        <input type="datetime-local" name="startAt" value="${toDatetimeLocalValue(meeting.startAt)}">
      </label>
      <label class="field"><span>Attendees</span><input type="text" name="attendees" value="${meeting.attendees}"></label>
      <label class="field"><span>Agenda items</span><textarea name="agenda" rows="4" placeholder="One item per line">${meeting.agenda.join("\n")}</textarea></label>
      <div class="modal-actions">
        <button type="button" class="ghost-btn" data-modal-close>Cancel</button>
        <button type="submit" class="primary-btn">Save Changes</button>
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
      <label class="field">
        <span>Department</span>
        <select name="dept" required>
          <option value="" selected disabled>Select department</option>
          ${deptOptionsHtml()}
        </select>
      </label>
      <label class="field"><span>Username</span><input type="text" name="username" required placeholder="e.g. j.delacruz" autocomplete="off"></label>
      <label class="field"><span>Password</span><input type="text" name="password" required placeholder="e.g. p@ssw0rd" autocomplete="off"></label>
      <label class="field">
        <span>Account role</span>
        <select name="accountRole">
          <option value="user" selected>User</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <div class="modal-actions">
        <button type="button" class="ghost-btn" data-modal-close>Cancel</button>
        <button type="submit" class="primary-btn">Add User</button>
      </div>
    </form>
  `);
}

function openEditUserModal(id){
  const user = users.find(u => u.id === id);
  if(!user) return;
  openModal(`
    <div class="modal-head">
      <h3>Edit User</h3>
      <button type="button" class="modal-close" data-modal-close aria-label="Close">&times;</button>
    </div>
    <form id="editUserForm" class="modal-form" data-user-id="${user.id}">
      <label class="field"><span>Full name</span><input type="text" name="name" required value="${user.name}"></label>
      <label class="field"><span>Role</span><input type="text" name="role" value="${user.role}" placeholder="e.g. Records Clerk"></label>
      <label class="field">
        <span>Department</span>
        <select name="dept" required>
          <option value="" ${!user.dept ? "selected" : ""} disabled>Select department</option>
          ${deptOptionsHtml(user.dept)}
        </select>
      </label>
      <label class="field"><span>Username</span><input type="text" name="username" required value="${user.username || ""}" autocomplete="off"></label>
      <label class="field"><span>Password</span><input type="text" name="password" value="${user.password || ""}" placeholder="e.g. p@ssw0rd" autocomplete="off"></label>
      <label class="field">
        <span>Account role</span>
        <select name="accountRole">
          <option value="user" ${user.accountRole === "user" ? "selected" : ""}>User</option>
          <option value="admin" ${user.accountRole === "admin" ? "selected" : ""}>Admin</option>
        </select>
      </label>
      <label class="field">
        <span>Status</span>
        <select name="status">
          <option value="active" ${user.status === "active" ? "selected" : ""}>Active</option>
          <option value="inactive" ${user.status === "inactive" ? "selected" : ""}>Inactive</option>
        </select>
      </label>
      <div class="modal-actions">
        <button type="button" class="ghost-btn" data-modal-close>Cancel</button>
        <button type="submit" class="primary-btn">Save Changes</button>
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
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "overdue", label: "Overdue" },
    { value: "submitted", label: "On Going" },
    { value: "completed", label: "Completed" }
  ];
  openModal(`
    <div class="modal-head">
      <h3>Edit Report</h3>
      <button type="button" class="modal-close" data-modal-close aria-label="Close">&times;</button>
    </div>
    <form id="editReportForm" class="modal-form" data-report-index="${idx}">
      <label class="field"><span>Report name</span><input type="text" name="name" required value="${report.name}"></label>
      <label class="field"><span>Due date</span><input type="text" name="due" required value="${report.due}"></label>
      <label class="field">
        <span>Status</span>
        <select name="status">
          ${statusOptions.map(s => `<option value="${s.value}" ${s.value === report.status ? "selected" : ""}>${s.label}</option>`).join("")}
        </select>
      </label>
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
        remove(child(reportsRef, report.id))
          .then(() => {
            closeModal();
            showToast(`Deleted "${report.name}"`);
          })
          .catch(err => {
            console.error("Failed to delete report:", err);
            showToast(`Couldn't delete report: ${err.message || err.code || err}`);
          });
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

    if(form.id === "confirmPasswordForm"){
      const fd = new FormData(form);
      const enteredPassword = fd.get("password");
      const errorBox = document.getElementById("confirmPasswordError");
      const submitBtn = form.querySelector("button[type=submit]");
      const confirmAction = pendingPasswordConfirm;

      if(!confirmAction){ closeModal(); return; }
      if(errorBox) errorBox.hidden = true;
      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = "Checking…"; }

      // Fetch the current user's record fresh from Firebase rather than
      // trusting anything cached in memory or sessionStorage.
      get(child(usersRef, currentUser.id))
        .then(snap => {
          const record = snap.val();
          if(record && record.password === enteredPassword){
            const onSuccess = confirmAction.onSuccess;
            pendingPasswordConfirm = null;
            closeModal();
            if(onSuccess) onSuccess();
          } else {
            if(errorBox){
              errorBox.textContent = "Incorrect password.";
              errorBox.hidden = false;
            }
            if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = "Confirm"; }
            form.querySelector('input[name="password"]').value = "";
            form.querySelector('input[name="password"]').focus();
          }
        })
        .catch(err => {
          console.error("Failed to verify password:", err);
          if(errorBox){
            errorBox.textContent = `Couldn't verify password: ${err.message || err.code || err}`;
            errorBox.hidden = false;
          }
          if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = "Confirm"; }
        });
      return;
    }

    if(form.id === "editReportForm"){
      const idx = Number(form.dataset.reportIndex);
      const report = reports[idx];
      if(!report) return;
      const fd = new FormData(form);
      const name = fd.get("name").trim();
      const due = fd.get("due").trim();
      if(!name || !due) return;
      const updates = {
        name,
        due,
        status: fd.get("status"),
        dateReported: fd.get("dateReported").trim(),
        pointPerson: fd.get("pointPerson").trim(),
        notes: fd.get("notes").trim()
      };
      update(child(reportsRef, report.id), updates)
        .then(() => {
          closeModal();
          showToast(`Updated "${name}"`);
        })
        .catch(err => {
          console.error("Failed to update report:", err);
          showToast(`Couldn't save changes: ${err.message || err.code || err}`);
        });
      return;
    }

    if(form.id === "editMeetingForm"){
      const idx = Number(form.dataset.meetingIndex);
      const meeting = meetings[idx];
      if(!meeting) return;
      const fd = new FormData(form);
      const title = fd.get("title").trim();
      if(!title) return;
      const agenda = fd.get("agenda").split("\n").map(s => s.trim()).filter(Boolean);
      const startAtRaw = fd.get("startAt");
      const startAt = startAtRaw ? new Date(startAtRaw).getTime() : null;
      const updates = {
        title,
        time: fd.get("time").trim() || "Time TBD",
        startAt,
        attendees: fd.get("attendees").trim() || "TBD",
        agenda: agenda.length ? agenda : ["No agenda items yet"]
      };
      // If the start time changed, clear any prior "reminder already sent"
      // flag so the new time can trigger its own 1-hour-before reminder.
      if(meeting.startAt !== startAt && notifiedMeetingIds.has(meeting.id)){
        notifiedMeetingIds.delete(meeting.id);
        saveIdSet(NOTIFIED_MEETINGS_KEY, notifiedMeetingIds);
      }
      update(child(meetingsRef, meeting.id), updates)
        .then(() => {
          closeModal();
          showToast(`Meeting "${title}" updated`);
        })
        .catch(err => {
          console.error("Failed to update meeting:", err);
          showToast(`Couldn't save changes: ${err.message || err.code || err}`);
        });
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
      set(push(reportsRef), {
        dept,
        tagClass: deptTagMap[dept] || "tag-imrs",
        name,
        due,
        status: dateReported ? "submitted" : "pending",
        dateReported,
        pointPerson: fd.get("pointPerson").trim(),
        notes: fd.get("notes").trim(),
        createdAt: Date.now()
      })
        .then(() => {
          closeModal();
          showToast(`Added "${name}" for ${dept}`);
        })
        .catch(err => {
          console.error("Failed to add report:", err);
          showToast(`Couldn't add report: ${err.message || err.code || err}`);
        });
      return;
    }

    if(form.id === "newMeetingForm"){
      const fd = new FormData(form);
      const title = fd.get("title").trim();
      if(!title) return;
      const agenda = fd.get("agenda").split("\n").map(s => s.trim()).filter(Boolean);
      const startAtRaw = fd.get("startAt");
      set(push(meetingsRef), {
        title,
        time: fd.get("time").trim() || "Time TBD",
        startAt: startAtRaw ? new Date(startAtRaw).getTime() : null,
        attendees: fd.get("attendees").trim() || "TBD",
        agenda: agenda.length ? agenda : ["No agenda items yet"],
        createdAt: Date.now()
      })
        .then(() => {
          closeModal();
          showToast(`Meeting "${title}" created`);
        })
        .catch(err => {
          console.error("Failed to create meeting:", err);
          showToast(`Couldn't create meeting: ${err.message || err.code || err}`);
        });
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
      const username = fd.get("username").trim();
      const password = fd.get("password");
      if(!name || !username || !password) return;
      set(push(usersRef), {
        name,
        role: fd.get("role").trim() || "Staff",
        dept: fd.get("dept").trim() || "—",
        username,
        password,
        accountRole: fd.get("accountRole") === "admin" ? "admin" : "user",
        status: "active",
        mustChangePassword: true,
        createdAt: Date.now()
      })
        .then(() => {
          closeModal();
          showToast(`${name} added — they'll be asked to set a new password on first login`);
        })
        .catch(err => {
          console.error("Failed to add user:", err);
          showToast(`Couldn't add user: ${err.message || err.code || err}`);
        });
    }

    if(form.id === "editUserForm"){
      const id = form.dataset.userId;
      const user = users.find(u => u.id === id);
      if(!user) return;
      const fd = new FormData(form);
      const name = fd.get("name").trim();
      const username = fd.get("username").trim();
      if(!name || !username) return;
      const enteredPassword = fd.get("password");
      // If an admin sets a new password here, treat it like a temporary
      // password: the user must change it on their next login. Leaving the
      // field as-is (unchanged) doesn't touch the existing flag.
      const passwordChanged = enteredPassword && enteredPassword !== user.password;
      const updates = {
        name,
        role: fd.get("role").trim() || "Staff",
        dept: fd.get("dept").trim() || "—",
        username,
        password: enteredPassword || user.password || "",
        accountRole: fd.get("accountRole") === "admin" ? "admin" : "user",
        status: fd.get("status") === "inactive" ? "inactive" : "active",
        mustChangePassword: passwordChanged ? true : (user.mustChangePassword || false)
      };
      update(child(usersRef, user.id), updates)
        .then(() => {
          closeModal();
          showToast(passwordChanged ? `${name} updated — they'll be asked to set a new password on next login` : `${name} updated`);
        })
        .catch(err => {
          console.error("Failed to update user:", err);
          showToast(`Couldn't save changes: ${err.message || err.code || err}`);
        });
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

// ---------- REPORTING FILTERS ----------
function setupFilterChips(){
  document.getElementById("reportFilters").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if(!chip) return;
    renderReporting(chip.dataset.filter === "All" ? null : chip.dataset.filter);
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

    if(btn.dataset.action === "edit"){
      openEditReportModal(idx);
    } else {
      openViewReportModal(idx);
    }
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
    const editBtn = e.target.closest("[data-user-edit]");
    if(editBtn){
      openEditUserModal(editBtn.dataset.userEdit);
      return;
    }
    const deleteBtn = e.target.closest("[data-user-delete]");
    if(deleteBtn){
      const id = deleteBtn.dataset.userDelete;
      const user = users.find(u => u.id === id);
      if(!user) return;
      if(id === currentUser.id){
        showToast("You can't delete the account you're currently signed in with.");
        return;
      }
      if(confirm(`Delete "${user.name}"? This removes their login access and can't be undone.`)){
        remove(child(usersRef, id))
          .then(() => showToast(`Deleted ${user.name}`))
          .catch(err => {
            console.error("Failed to delete user:", err);
            showToast(`Couldn't delete user: ${err.message || err.code || err}`);
          });
      }
      return;
    }

    const btn = e.target.closest("[data-user-toggle]");
    if(!btn) return;
    const id = btn.dataset.userToggle;
    const user = users.find(u => u.id === id);
    if(!user) return;
    const newStatus = user.status === "active" ? "inactive" : "active";
    update(child(usersRef, id), { status: newStatus })
      .then(() => showToast(`${user.name} is now ${newStatus}`))
      .catch(err => {
        console.error("Failed to update user status:", err);
        showToast(`Couldn't update status: ${err.message || err.code || err}`);
      });
  });
}

// ---------- MEETINGS EDIT/DELETE ----------
function setupMeetingsGrid(){
  document.getElementById("meetingGrid").addEventListener("click", e => {
    const editBtn = e.target.closest("[data-meeting-edit]");
    if(editBtn){
      openEditMeetingModal(Number(editBtn.dataset.meetingEdit));
      return;
    }
    const deleteBtn = e.target.closest("[data-meeting-delete]");
    if(deleteBtn){
      const idx = Number(deleteBtn.dataset.meetingDelete);
      const meeting = meetings[idx];
      if(meeting && confirm(`Delete "${meeting.title}"? This can't be undone.`)){
        remove(child(meetingsRef, meeting.id))
          .then(() => showToast(`Deleted "${meeting.title}"`))
          .catch(err => {
            console.error("Failed to delete meeting:", err);
            showToast(`Couldn't delete meeting: ${err.message || err.code || err}`);
          });
      }
    }
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
    showToast("Profile saved");
  });
  document.querySelectorAll(".toggle-row input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", () => showToast(cb.checked ? "Notification enabled" : "Notification disabled"));
  });
}

// ---------- MISC BUTTONS ----------
function setupMisc(){
  document.getElementById("viewAllReports").addEventListener("click", () => switchView("reporting"));
  document.getElementById("exportReportsBtn").addEventListener("click", exportReportsToExcel);
  document.getElementById("logoutBtn").addEventListener("click", () => {
    showToast("Logging out…");
    sessionStorage.removeItem("scmc_auth");
    sessionStorage.removeItem("scmc_user");
    sessionStorage.removeItem("scmc_current_user");
    setTimeout(() => { window.location.replace("login.html"); }, 400);
  });
}

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", async () => {
  applyCurrentUserToChrome();
  renderDepartments();
  renderReportAnalytics();
  setupNav();
  setupQuickActions();
  setupDeptLinks();
  setupFilterChips();
  setupReportsTable();
  setupRecordsSearch();
  setupGssList();
  setupUsersTable();
  setupMeetingsGrid();
  setupDayTabs();
  setupSettings();
  setupMisc();
  setupNotifications();
  setupModal();

  renderReporting(currentReportFilter);
  renderReportSummary();
  try {
    await seedReportsIfEmpty();
  } catch(err) {
    console.error("Failed to seed reports:", err);
    showToast(`Couldn't seed reports: ${err.message || err.code || err}`);
  }
  watchReports();

  try {
    await seedMeetingsIfEmpty();
  } catch(err) {
    console.error("Failed to seed meetings:", err);
    showToast(`Couldn't seed meetings: ${err.message || err.code || err}`);
  }
  watchMeetings();
  // Re-scan meeting start times every minute so the "1 hour before" reminder
  // fires even if no meeting data changes in the meantime.
  setInterval(checkMeetingReminders, 60 * 1000);

  try {
    await seedUsersIfEmpty();
  } catch(err) {
    console.error("Failed to seed users:", err);
    showToast(`Couldn't seed users: ${err.message || err.code || err}`);
  }
  watchUsers();
});
