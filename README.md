# Applied Tech Pathways — CVHS & CHS

A static reference site for the Applied Tech program of study at Crescent Valley (CVHS) and Corvallis High (CHS). Built for counselors, teachers, students/families, and district CTE oversight.

**Live:** https://promptaisolutions.com/applied-tech/

**Zero build step.** Open `index.html` in a browser and it works. All content lives in `js/data.js` — edit one file to change any course, teacher, or pathway on the site.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage: editorial hero → pathway map → four stakeholder doors |
| `explore.html` | Student-facing: "What do you like to make?" interest tiles + FAQ |
| `courses.html` | Sortable, filterable, printable reference table |
| `counselors.html` | Quick-answer tiles + worked example for advising |
| `teachers.html` | Teacher index + edit-proposal hub |
| `for-district.html` | Dual credit, proficiency approach, WBL, LBCC articulation |
| `about.html` | How to read the site, credit types, editing instructions |
| `pages/course.html?slug=...` | Individual course detail |
| `pages/pathway.html?id=...` | Individual pathway detail |
| `pages/teacher.html?id=...` | Individual teacher detail |
| `pos-plan.pdf` | Canonical Program-of-Study plan (generated from `../PLAN - Unified Engineering POS 2027+.md`) |

## Editing content

All content lives in **`js/data.js`**. Three collections:

### Courses
```js
{
  slug: "intro-to-engineering",        // URL slug
  title: "Intro to Engineering",
  pathway: "engineering",              // must match a key in pathways
  site: "cvhs",                        // cvhs | chs | either
  grade: [10, 11, 12],                 // array of grade levels
  yearLong: true,
  credit: { cte: 1.0 },                // add science: 0.5 or math: 0.5 for dual
  prerequisites: [],                   // HARD prereqs (only freshman row uses these)
  suggestedPrereqs: [],                // soft hints (only inside ladder pathways)
  leadsTo: ["architecture"],           // suggested next courses
  teachers: ["ak", "sr", "am"],        // teacher ids
  status: "review",                    // draft | review | approved
  source: "filled-docx",               // where the description came from
  proficiencies: [                     // 4–6 measurable skills
    "Applies the engineering design process across a multi-week project...",
  ],
  description: `Long-form prose paragraph...`,
}
```

### Teachers
Keyed by initials (`ak`, `am`, `rm`, `sr`, `jj`). See existing entries.

### Pathways
Keyed by id (`cs`, `engineering`, etc.). Each pathway declares:

```js
{
  id: "cs",
  title: "Computer Science",
  color: "#3b82f6",                  // used for full-fill pathway tiles
  site: "chs",                       // cvhs | chs | split
  type: "ladder",                    // ladder | collection — see below
  description: "...",
  entry: ["computer-skills"],        // freshman feeders
  courses: ["intro-to-cs", "advanced-cs", "capstone-cs"],
}
```

## Ladders vs. collections

The most important structural distinction in the site:

- **Ladder pathways (3):** CS, Autos, Industrial Design. Each course builds on the previous. The homepage map shows a dashed "typically after" connector between stacked tiles; the pathway detail page uses "Year N of the sequence" framing.
- **Collection pathways (6):** Engineering, Architecture, Woods & Carpentry, Metals, Vehicular / Drone, Real World Math. Courses are peers — take any of them in any order. No connectors between tiles; pathway detail uses "Courses in this area" framing.

Flip a pathway's type by changing `type: "ladder"` / `type: "collection"` in `js/data.js` — the UI branches automatically.

## Prerequisite rule

Only the freshman row (Computer Skills, Woods 1, Metals 1) has locked prerequisites. Every other course has `prerequisites: []`. Soft hints go in `suggestedPrereqs`, visible only on ladder-internal transitions. Do not promote suggestions to prerequisites without committee sign-off.

## Previewing locally

```
open index.html
```

Or serve the folder:
```
cd applied-tech-site
python3 -m http.server 8000
# visit http://localhost:8000
```

## Deployment

The repo lives at https://github.com/mr-mcateer/applied-tech with GitHub Pages serving `main` at the root. The custom domain `promptaisolutions.com` is configured on the account, so pushes to `main` publish at `promptaisolutions.com/applied-tech/` within ~2 minutes.

## Source documents (provenance)

Course descriptions and proficiencies were drafted from, in order of authority:

1. **CVHS-Course-Handbook-24-25.pdf** — official handbook for currently offered courses (Metals 1, Metals 2, Carpentry, Architecture).
2. **Engineering Pathway and Course Descriptions - FILLED.docx** — heritage descriptions for the engineering and shop lanes (the site renames the historical IDEA / STEAM / DREAM courses to Intro to Engineering / Engineering Science / Industrial Design I & II).
3. **CSD Industrial Ed for 2027 and Beyond.pptx** — learning targets for Autos, CS, Vehicular/Drone, Industrial Design.
4. **Drafted** — for courses with no prior description (Computer Skills, Real World Math, Industrial Design II). Marked `status: "draft"` with a visible banner on the course page.

Every course carries a `source` field in `data.js` for traceability.

## Not in scope for v2

- Authentication / private views.
- Live enrollment data from `../26-27 CV Course Requests.xlsx` (future: a one-time import script to seed `sections` counts).
- Industry-certification seat funding (Perkins Reserve ask; tracked in the sibling POS plan).
- LBCC College Now articulation beyond historical IDEA credit (tracked in `for-district.html` and the POS plan).
