# Applied Tech Pathways — CVHS & CHS

A static reference site for the Applied Tech program of study at CVHS and CHS. Built for counselors, teachers, students, and families.

**Zero build step.** Open `index.html` in a browser and it works. All content is in `js/data.js` — edit one file to change any course, teacher, or pathway on the site.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Counselor-first pathway map (whiteboard layout with filters) |
| `explore.html` | Student-facing "what are you into?" pathway explorer |
| `courses.html` | Sortable, filterable, printable reference table |
| `teachers.html` | Teacher index with course/prep counts |
| `about.html` | How to read the map, credit types, editing instructions |
| `pages/course.html?slug=...` | Individual course detail |
| `pages/pathway.html?id=...` | Individual pathway detail |
| `pages/teacher.html?id=...` | Individual teacher detail |

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
  suggestedPrereqs: [],                // soft hints — matches whiteboard arrows
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
Keyed by id (`cs`, `engineering`, etc.). Include a color (for the map), description, and the ordered list of courses.

## Pipeline constraint

Only the freshman row (Computer Skills, Woods 1, Metals 1) has locked prerequisites. The arrows on the whiteboard between post-freshman courses (CS ladder, Autos ladder, ID ladder) are **suggestions**, not required ordering. The data model reflects this with `prerequisites` (hard) vs `suggestedPrereqs` (soft). Do not promote suggestions to prerequisites without committee sign-off.

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

## Deploying to GitHub Pages

1. Create a repo on the `mr-mcateer` GitHub account (e.g. `applied-tech`).
2. Push this folder's contents to `main`.
3. In GitHub Settings → Pages, select **Branch: main / (root)** and save.
4. Site is live at `https://mr-mcateer.github.io/<repo-name>/`.

## Source documents

Course descriptions and proficiencies are drawn from, in order of authority:

1. **CVHS-Course-Handbook-24-25.pdf** — official handbook for currently offered courses (Metals 1, Metals 2, Carpentry 1, Architecture & Microcontrollers).
2. **Engineering Pathway and Course Descriptions - FILLED.docx** — committee's internal descriptions for IDEA, STEAM, DREAM 1/2, PST, Woods, Metals, Carpentry.
3. **CSD Industrial Ed for 2027 and Beyond.pptx** — learning targets for courses not yet in the handbook (Autos, Industrial Design, CS, Vehicular/Drone).
4. **Drafted** — for undocumented courses (Computer Skills, Real World Math, Industrial Design II). Marked `status: "draft"` with a visible banner on the course page.

Every course carries a `source` field in `data.js` for provenance.

## Not yet in v1

- Authentication / private views
- Live enrollment data from `26-27 CV Course Requests.xlsx` (future: import script to seed `sections` counts per teacher)
- Industry certification mapping (tracked separately in `PLAN - Unified Engineering POS 2027+.md`)
- Full proficiency-to-standard crosswalk (Oregon CTE TSA, Perkins V) — also in the sibling plan
