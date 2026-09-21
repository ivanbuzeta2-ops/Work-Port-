# Ivan Buzeta — Portfolio Website

A static, no-build portfolio site (HTML, CSS, JavaScript). There is nothing to install: open `index.html` in a browser to preview it, and upload the whole folder to any static host to publish it.

## Design concept

The site is styled like an estimator's drawing sheet, with a few details borrowed from the job:

- **Takeoff hero.** The eaves, rakes, and ridge lines draw themselves in takeoff colors. Hover a legend row to isolate that layer.
- **Dimension lines** under every section heading, with slashed ends like a plan dimension.
- **Tape measure** on the right edge (screens 1500 px and wider) that slides as you scroll and names the current section.
- **Software toolbox**: a dock of tool tiles that opens an app-style window for each tool.
- **Drawing viewer**: click a work sample thumbnail to flip through its pages without leaving the site.
- **Career staircase**: three career goals that step up from left to right.

 The hero is a takeoff drawing whose eaves, rakes, and ridge lines draw themselves in the same green, cyan, and yellow used on marked-up plans, with a title block that holds the profile photo. The quantities in the legend come from Sample Estimated Plan 01. Everything else stays quiet: cool paper background, ink-navy type, one blueprint blue, and the Archivo typeface. The Work Samples section switches to a dark blueprint background so the plans stand out.

## Folder structure

```
portfolio/
├── index.html                      All page content (text sections)
├── css/style.css                   All styling. Colors are tokens at the top of the file
├── js/
│   ├── content.js                  EDIT THIS: certifications and work samples (data)
│   └── script.js                   Behavior: menu, filters, active nav link
├── assets/
│   ├── images/
│   │   ├── profile.jpg             Your portrait (hero and About section)
│   │   ├── cv-preview.jpg          Preview image shown in the CV section
│   │   ├── favicon.svg
│   │   ├── logos/                  Tool logos (PlanSwift and Bluebeam are still placeholders)
│   │   └── samples/                Thumbnails for the cards; pages/ holds the viewer images
│   └── documents/
│       ├── My_CV.pdf               YOUR CV (already added)
│       ├── estimated-plans/
│       │   ├── Sample_Plan_01.pdf … Sample_Plan_04.pdf
│       │   └── All_Sample_Estimated_Plans.zip
│       ├── roofr/
│       │   ├── Roofr_Roof_Measurements.pdf
│       │   └── Roofr_Material_Order.pdf
│       └── certificates/           Certificate PDFs
└── README.md
```

## Where your files go

**CV** — `assets/documents/My_CV.pdf`. Both "Download CV" buttons point here. To update your CV, overwrite this file and keep the same name. The preview image in the CV section is `assets/images/cv-preview.jpg`; to refresh it from a new CV on a computer with Poppler installed:

```
pdftoppm -jpeg -r 110 -f 1 -l 1 -singlefile assets/documents/My_CV.pdf assets/images/cv-preview
```

Or take a screenshot of page 1 and save it over `cv-preview.jpg`.

**Sample estimated plans** — `assets/documents/estimated-plans/`. The four plans you provided are already there as `Sample_Plan_01.pdf` to `Sample_Plan_04.pdf`.

**Certificates** — `assets/documents/certificates/`.

## Replacing placeholders

Placeholders are shown with a yellow dashed outline on the page so they are easy to spot. Search `index.html` for `data-placeholder` to find them all.

| Placeholder | Where | What to do |
|---|---|---|
| `[YOUR EMAIL]` | Contact section | Replace the whole `<span class="placeholder" …>` with `<a href="mailto:you@example.com">you@example.com</a>`. |
| `[YOUR CITY, COUNTRY]` | Contact section | Replace the `<span>` with plain text. |
| `[YOUR OTHER PROFILE URL]` | Contact section | Replace with a link, or delete that whole `<li>`. |
| `[ADD A PROJECT OR OUTCOME…]` | Software section, one per tool | In `js/content.js`, fill in `example: ""` for each tool with one real project or result. |
| PlanSwift and Bluebeam logos | `assets/images/logos/` | See "Tool logos" below. |
| `[YOUR ACADEMIC ACHIEVEMENTS…]` | Education section | Replace it with honors, thesis, or coursework, or delete the `tl-extra` block. |

## Tool logos

STACK, Roofr, AccuLynx, Xactimate, and AutoCAD use the official logos you supplied (trimmed and resized). **PlanSwift and Bluebeam Revu are still neutral placeholder badges** because no logo files were provided for them. To finish:

1. Download each logo from the vendor's brand or press page and follow their usage guidelines.
2. Save it over `assets/images/logos/planswift.svg` and `bluebeam.svg`. If your file is a PNG, save it as `planswift.png` and update the `logo:` path for that tool in `js/content.js`.
3. Use a version made for a light background, wide rather than tall. The tile shows it at about 46 px high.

## Career interests and the software levels

- The career goals (Commercial Roofing Estimator, Lead Estimator, Xactimate Estimator) are in `index.html`, in the block with `id="career"`. Each card has a short "What I build on" line taken from your CV. Edit the wording there.
- The tool levels are in `js/content.js` under `tools` (`level:`). PlanSwift, Bluebeam Revu, and STACK say "Proficient", Roofr says "Basic working knowledge", and Xactimate says "Familiar", matching your CV. If Roofr is a stronger skill than that, change its `level` and the matching chip in the Technical skills section.

## Adding or changing certificates and work samples

Open `js/content.js`. Each certification and each sample is one block; copy a block, change the values, and save. No other file needs to change.

- **Add a certificate file**: put the PDF in `assets/documents/certificates/`, then set `file: "assets/documents/certificates/Your_File.pdf"` on that certification. The "View certificate" button appears automatically.
- **Add your PRC license number**: set `credentialId` on the CELE entry.
- **Roofr documents**: the two Roofr files are in the second sample group (`group: "roofr"`). Give a new sample `group: "roofr"` to list it there; samples without a group go in the main "Sample estimated plans" grid.
- **Add a work sample**: put the PDF in `assets/documents/estimated-plans/`, add a preview image to `assets/images/samples/`, and copy a block in `samples`.
- **Viewer pages for a sample**: the viewer shows images from `assets/images/samples/pages/` (`sample-01-p-1.jpg`, `sample-01-p-2.jpg`, and so on). To regenerate them from a PDF: `pdftoppm -jpeg -jpegopt quality=76 -scale-to-x 1400 -scale-to-y -1 Sample_Plan_01.pdf sample-01-p`. Then set `preview: { prefix, count }` on that sample. Remove `preview` to hide the viewer for a sample.
- **Refresh the ZIP** after changing any sample PDF: select the PDFs and create a new `All_Sample_Estimated_Plans.zip` in the same folder (or run `zip -j All_Sample_Estimated_Plans.zip Sample_Plan_0*.pdf` from that folder).

## Content notes

- All experience, education, skills, and certificate details come from your CV and uploaded certificates. Nothing was added beyond them.
- **AccuLynx and AutoCAD** were added to the toolbox because you supplied their logos. AccuLynx is labeled "Familiar" (your CV says you are familiar with various CRM software) and AutoCAD "Hands-on" (your CV says you produced roofing layouts in AutoCAD). Change the `level` in `js/content.js` if either is wrong.
- **The Roofr PDFs are published as they are.** They show a street name (no house number) and a neighborhood aerial photo, and the material order is a browser printout that includes a Roofr support banner and a team ID in the page footer. If you prefer, re-export cleaner copies and overwrite the files in `assets/documents/roofr/`, then regenerate the viewer pages.
- The figures in the "Roofing estimates prepared" table (400 / 300 / 100 / 50, three per day, over 33,814.90 m²) are the ones stated on your CV.
- The two Exam English results are labeled "Self-assessment" because the certificates say they are not official examination results.
- Skill tags say "Basic working knowledge", "Familiar", or "Coursework" where that is the honest level. Roofr is shown as "Basic working knowledge" because your CV's skills list says so, while the CV summary calls you proficient in it. Change the tag in `index.html` if you prefer.
- There is no programming category because the CV lists none. Add one in the Technical skills section if it applies.

## Preview locally

Double-click `index.html`. For the most accurate behavior you can also run a tiny local server from this folder:

```
python3 -m http.server 8000
```

then open http://localhost:8000.

## Deploy (free options)

**Netlify Drop (fastest)**
1. Go to https://app.netlify.com/drop.
2. Drag the whole `portfolio` folder onto the page.
3. You get a live link immediately. Rename it under Site settings, or connect your own domain.

**GitHub Pages**
1. Create a repository on GitHub (for example `portfolio`) and upload all files, keeping the folder structure.
2. Open Settings, then Pages. Under Build and deployment choose "Deploy from a branch", branch `main`, folder `/ (root)`.
3. After a minute your site is at `https://YOUR-USERNAME.github.io/portfolio/`.

**Cloudflare Pages / Vercel** — create a project from the repository, set the framework to "None", and leave the build command empty and the output directory as the repository root.

Every path in the site is relative, so it works from a domain root or a subfolder.

## Accessibility and performance

- Skip link, semantic landmarks, keyboard-operable menu (Escape closes it), visible focus rings, and `aria-current` on the active nav link.
- Text contrast meets WCAG AA. Motion is limited to the hero takeoff drawing and simple hover states, and it is switched off for visitors who set "reduce motion". The tool dock is a proper tab list (arrow keys, Home, End), and the viewer is a native dialog (Escape closes, arrow keys change pages).
- External links open in a new tab with `rel="noopener noreferrer"`.
- Images are small JPEGs, lazy-loaded below the fold. PDFs load only when clicked.
- The only external request is Google Fonts (Archivo). If it is blocked, the site falls back to the system font.
