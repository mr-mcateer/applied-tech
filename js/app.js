// Applied Tech v2 — shared rendering helpers.
// Public surface on window.APP is kept STABLE from v1 so sibling builders
// don't have to coordinate. New helpers added; none renamed or removed.

(function () {
  const D = window.DATA;

  // ---------- lookups ----------
  function courseBySlug(slug) { return D.courses.find(c => c.slug === slug); }
  function pathway(id) { return D.pathways[id]; }
  function teacher(id) { return D.teachers[id]; }
  function careerBySlug(slug) { return (D.careers || []).find(c => c.slug === slug); }

  // ---------- formatters ----------
  function fmtCredit(credit) {
    const parts = [];
    if (!credit) return "";
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

  // ---------- chips / badges (v2 classes) ----------
  function siteChip(site) {
    const label = siteLabel(site);
    return `<span class="chip chip--${site}">${label}</span>`;
  }
  function creditChips(credit) {
    const bits = [];
    if (!credit) return "";
    if (credit.science) bits.push(`<span class="chip chip--science">Science credit</span>`);
    if (credit.math)    bits.push(`<span class="chip chip--math">Math credit</span>`);
    return bits.join(" ");
  }
  function statusChip(status) {
    if (status === "draft") return `<span class="chip chip--draft">Draft</span>`;
    return "";
  }
  function pathwayChip(pathwayId) {
    const p = D.pathways[pathwayId];
    if (!p) return "";
    return `<span class="chip chip--pathway p-${pathwayId}">${escapeHtml(p.title)}</span>`;
  }

  // ---------- v1 compatibility shims (old names — kept so existing HTML works
  // until siblings rewrite their pages) ----------
  function siteBadge(site)        { return siteChip(site); }
  function creditBadges(credit)   { return creditChips(credit); }
  function statusBadge(status)    { return statusChip(status); }

  // ---------- components ----------
  // Full-fill pathway tile. Used on the pathway map (index.html),
  // on pathway detail, and in course grids.
  function courseTile(course, opts = {}) {
    if (!course) return "";
    const cls = ["tile"];
    if (opts.dim) cls.push("tile--dim");
    if (opts.neutral) cls.push("tile--neutral");
    const pathwayAttr = course.pathway ? ` data-pathway="${escapeAttr(course.pathway)}"` : "";
    const overline = opts.overline !== undefined
      ? opts.overline
      : (course.pathway && D.pathways[course.pathway] ? D.pathways[course.pathway].title : "");
    const metaBits = [];
    metaBits.push(siteLabel(course.site));
    metaBits.push(fmtGrade(course.grade));
    const creditText = fmtCredit(course.credit);
    if (creditText) metaBits.push(creditText);
    const description = course.description
      ? `<p class="tile__desc">${escapeHtml(firstSentence(course.description))}</p>`
      : "";
    return `
      <a class="${cls.join(" ")}"${pathwayAttr} href="pages/course.html?slug=${encodeURIComponent(course.slug)}">
        ${overline ? `<p class="tile__overline">${escapeHtml(overline)}</p>` : ""}
        <h3 class="tile__title">${escapeHtml(course.title)}</h3>
        ${description}
        <div class="tile__meta">${metaBits.filter(Boolean).map(escapeHtml).join(" · ")}</div>
      </a>
    `;
  }

  function teacherAvatar(t) {
    if (!t) return "";
    return `<span class="teacher-avatar" title="${escapeAttr(t.name)}">${escapeHtml(t.initials)}</span>`;
  }

  // ---------- sort / grouping ----------
  function coursesInPathway(pathwayId) {
    const p = D.pathways[pathwayId];
    if (p && p.courses && p.courses.length) {
      return p.courses.map(courseBySlug).filter(Boolean);
    }
    return D.courses.filter(c => c.pathway === pathwayId);
  }

  // ---------- nav active state ----------
  function markActiveNav() {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".site-header__nav a, .nav a").forEach(a => {
      const href = (a.getAttribute("href") || "").split("/").pop();
      if (href === path) {
        a.setAttribute("aria-current", "page");
        a.classList.add("active");
      }
    });
  }

  // Mobile nav toggle (progressive enhancement — nav works without JS,
  // this just opens/closes on tap at mobile widths).
  function bindNavToggle() {
    const toggle = document.querySelector(".site-header__toggle");
    const nav = document.querySelector(".site-header__nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("site-header__nav--open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // ---------- query string ----------
  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  // ---------- helpers ----------
  function escapeHtml(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function escapeAttr(s) { return escapeHtml(s); }

  function firstSentence(text) {
    if (!text) return "";
    const m = String(text).match(/^[^.!?]+[.!?]/);
    return (m ? m[0] : text).trim();
  }

  // ---------- Export ----------
  // Stable v1 surface + v2 additions. Nothing removed.
  window.APP = {
    D,
    // lookups
    courseBySlug, pathway, teacher, careerBySlug,
    // formatters
    fmtCredit, fmtGrade, siteLabel,
    // badges (v1 names — still work)
    siteBadge, creditBadges, statusBadge,
    // chips (v2 names)
    siteChip, creditChips, statusChip, pathwayChip,
    // components
    courseTile, teacherAvatar,
    // structure
    coursesInPathway,
    // nav + routing
    markActiveNav, qs,
    // utilities
    escapeHtml, escapeAttr, firstSentence,
  };

  document.addEventListener("DOMContentLoaded", () => {
    markActiveNav();
    bindNavToggle();
  });
})();
