// Shared rendering helpers used across every page.

(function () {
  const D = window.DATA;

  // ---------- lookups ----------
  function courseBySlug(slug) { return D.courses.find(c => c.slug === slug); }
  function pathway(id) { return D.pathways[id]; }
  function teacher(id) { return D.teachers[id]; }

  // ---------- formatters ----------
  function fmtCredit(credit) {
    const parts = [];
    if (credit.cte) parts.push(`${credit.cte} CTE`);
    if (credit.science) parts.push(`${credit.science} Science`);
    if (credit.math) parts.push(`${credit.math} Math`);
    if (credit.applied_art) parts.push(`${credit.applied_art} Applied Art`);
    return parts.join(" + ");
  }

  function fmtGrade(grade) {
    if (!grade || !grade.length) return "—";
    if (grade.length === 1) return `${grade[0]}th`;
    return `${grade[0]}–${grade[grade.length - 1]}th`;
  }

  function siteLabel(site) {
    return { cvhs: "CVHS", chs: "CHS", either: "Either", split: "Split" }[site] || site;
  }

  // ---------- badges ----------
  function siteBadge(site) {
    return `<span class="badge badge-site-${site}">${siteLabel(site)}</span>`;
  }
  function creditBadges(credit) {
    const bits = [];
    if (credit.science) bits.push(`<span class="badge badge-credit-science">Science credit</span>`);
    if (credit.math) bits.push(`<span class="badge badge-credit-math">Math credit</span>`);
    return bits.join(" ");
  }
  function statusBadge(status) {
    if (status === "draft") return `<span class="badge badge-status-draft">Draft</span>`;
    return "";
  }

  // ---------- components ----------
  function courseTile(course, opts = {}) {
    const creditBit = creditBadges(course.credit);
    const siteBit = course.site !== "either" ? siteBadge(course.site) : "";
    return `
      <a class="course-tile${opts.dim ? " dim" : ""}" data-pathway="${course.pathway}" href="pages/course.html?slug=${course.slug}">
        <div class="course-tile-title">${course.title}</div>
        <div class="course-tile-meta">
          ${siteBit}
          ${creditBit}
          ${statusBadge(course.status)}
        </div>
      </a>
    `;
  }

  function teacherAvatar(t) {
    return `<span class="teacher-avatar" title="${t.name}">${t.initials}</span>`;
  }

  // ---------- nav active state ----------
  function markActiveNav() {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a").forEach(a => {
      const href = a.getAttribute("href").split("/").pop();
      if (href === path) a.classList.add("active");
    });
  }

  // ---------- query string ----------
  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  // ---------- sort courses by whiteboard order within a pathway ----------
  function coursesInPathway(pathwayId) {
    const p = D.pathways[pathwayId];
    if (p && p.courses && p.courses.length) {
      return p.courses.map(courseBySlug).filter(Boolean);
    }
    return D.courses.filter(c => c.pathway === pathwayId);
  }

  // Export
  window.APP = {
    D,
    courseBySlug,
    pathway,
    teacher,
    fmtCredit,
    fmtGrade,
    siteLabel,
    siteBadge,
    creditBadges,
    statusBadge,
    courseTile,
    teacherAvatar,
    markActiveNav,
    qs,
    coursesInPathway,
  };

  document.addEventListener("DOMContentLoaded", markActiveNav);
})();
