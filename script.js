/* ==========================================================================
   Portfolio behavior
   - Mobile menu, sticky header state, active-link highlighting
   - Renders certification + sample cards from js/content.js
   - Certification filters
   ========================================================================== */
(function () {
  "use strict";

  var data = window.SITE_CONTENT || { certifications: [], samples: [] };

  /* ---------- tiny DOM helper ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      var val = attrs[key];
      if (val === null || val === undefined || val === false) return;
      if (key === "class") node.className = val;
      else if (key === "text") node.textContent = val;
      else node.setAttribute(key, val === true ? "" : val);
    });
    (children || []).forEach(function (child) {
      if (child) node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function icon(name) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  function srOnly(text) { return el("span", { class: "sr-only", text: text }); }

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- header: shadow line after scrolling ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
    window.matchMedia("(min-width: 941px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- tape-measure pointer follows scroll progress ---------- */
  var tapePointer = document.getElementById("tape-pointer");
  var tapeTicking = false;
  function updateTape() {
    tapeTicking = false;
    if (!tapePointer) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    tapePointer.style.top = (pct * 100).toFixed(2) + "%";
  }
  window.addEventListener("scroll", function () {
    if (!tapeTicking) { tapeTicking = true; window.requestAnimationFrame(updateTape); }
  }, { passive: true });
  window.addEventListener("resize", updateTape);
  updateTape();

  /* ---------- active link while scrolling ---------- */
  var spyMap = { tools: "skills", strengths: "skills", career: "about", "estimated-plans": "portfolio" };
  var links = {};
  document.querySelectorAll("[data-spy]").forEach(function (a) { links[a.getAttribute("data-spy")] = a; });

  var tapeLabel = document.getElementById("tape-label");
  function setActive(id) {
    var key = spyMap[id] || id;
    if (tapeLabel && links[key]) tapeLabel.textContent = links[key].textContent;
    Object.keys(links).forEach(function (k) {
      if (k === key) links[k].setAttribute("aria-current", "true");
      else links[k].removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    document.querySelectorAll("main > section[id]").forEach(function (s) { observer.observe(s); });
  }

  /* ---------- sample estimated plans ---------- */
  var sampleGrid = document.getElementById("sample-grid");
  var roofrGrid = document.getElementById("sample-grid-roofr");
  if (sampleGrid && data.samples && data.samples.length) {
    sampleGrid.textContent = "";
    if (roofrGrid) roofrGrid.textContent = "";
    data.samples.forEach(function (s, i) {
      var titleId = "sample-title-" + (i + 1);
      var meta = [];
      meta.push(el("span", {}, [icon("file"), s.type || "PDF"]));
      if (s.pages) meta.push(el("span", { text: s.pages + " pages" }));
      if (s.size) meta.push(el("span", { text: s.size }));

      var card = el("article", { class: "sample", "aria-labelledby": titleId }, [
        s.image
          ? el("button", { class: "sample-thumb", type: "button", "data-sample": String(i),
              "aria-label": "Preview pages of " + s.title }, [
              el("img", { src: s.image, alt: s.imageAlt || "", width: 960, height: 640, loading: i < 2 ? "eager" : "lazy" }),
              s.preview ? el("span", { class: "thumb-tag", "aria-hidden": "true" }, [icon("eye"), "Flip through " + s.preview.count + " pages"]) : null
            ])
          : null,
        el("div", { class: "sample-body" }, [
          el("h3", { id: titleId, text: s.title }),
          el("p", { class: "sample-desc", text: s.description }),
          el("ul", { class: "tags", "aria-label": "Skills demonstrated" },
            (s.skills || []).map(function (t) { return el("li", { text: t }); })),
          el("p", { class: "file-info" }, meta),
          el("div", { class: "sample-actions" }, [
            el("a", { class: "btn btn-primary on-dark", href: s.file, target: "_blank", rel: "noopener" }, [
              icon("eye"), "View Sample", srOnly(": " + s.title + " (opens in a new tab)")
            ]),
            el("a", { class: "btn btn-secondary on-dark", href: s.file, download: s.downloadName || true }, [
              icon("download"), "Download", srOnly(": " + s.title)
            ])
          ])
        ])
      ]);
      ((s.group === "roofr" && roofrGrid) ? roofrGrid : sampleGrid).appendChild(card);
    });

    var roofrHead = document.getElementById("roofr-samples");
    if (roofrHead && !data.samples.some(function (x) { return x.group === "roofr"; })) roofrHead.hidden = true;

    [sampleGrid, roofrGrid].forEach(function (grid) {
      if (!grid) return;
      grid.addEventListener("click", function (e) {
        var btn = e.target.closest("button.sample-thumb");
        if (btn) openViewer(data.samples[Number(btn.getAttribute("data-sample"))], btn);
      });
    });
  }

  /* ---------- drawing viewer ---------- */
  var viewer = document.getElementById("viewer");
  var vImg = document.getElementById("viewer-img");
  var vTitle = document.getElementById("viewer-title");
  var vCount = document.getElementById("viewer-count");
  var vPrev = document.getElementById("viewer-prev");
  var vNext = document.getElementById("viewer-next");
  var vOpen = document.getElementById("viewer-open");
  var vDownload = document.getElementById("viewer-download");
  var vSample = null, vPage = 1, vOpener = null;

  function showPage(n) {
    if (!vSample || !vSample.preview) return;
    var total = vSample.preview.count;
    vPage = Math.min(total, Math.max(1, n));
    vImg.src = vSample.preview.prefix + vPage + ".jpg";
    vImg.alt = vSample.title + ", page " + vPage + " of " + total;
    vCount.textContent = "Page " + vPage + " of " + total;
    vPrev.disabled = vPage === 1;
    vNext.disabled = vPage === total;
    // warm the cache for the next page
    if (vPage < total) { var pre = new Image(); pre.src = vSample.preview.prefix + (vPage + 1) + ".jpg"; }
  }

  function openViewer(sample, opener) {
    if (!viewer || !sample || !sample.preview) return;
    vSample = sample; vOpener = opener;
    vTitle.textContent = sample.title;
    vOpen.href = sample.file;
    vDownload.href = sample.file;
    vDownload.setAttribute("download", sample.downloadName || "");
    showPage(1);
    if (typeof viewer.showModal === "function") viewer.showModal();
    else viewer.setAttribute("open", "");
  }

  if (viewer) {
    vPrev.addEventListener("click", function () { showPage(vPage - 1); });
    vNext.addEventListener("click", function () { showPage(vPage + 1); });
    document.getElementById("viewer-close").addEventListener("click", function () { viewer.close(); });
    viewer.addEventListener("click", function (e) { if (e.target === viewer) viewer.close(); });
    viewer.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { showPage(vPage + 1); e.preventDefault(); }
      if (e.key === "ArrowLeft") { showPage(vPage - 1); e.preventDefault(); }
    });
    viewer.addEventListener("close", function () {
      vImg.removeAttribute("src");
      if (vOpener) vOpener.focus();
    });
  }

  /* ---------- software toolbox ---------- */
  var dock = document.getElementById("tool-dock");
  var panel = document.getElementById("tool-panel");

  function renderTool(t, tabEl) {
    panel.textContent = "";
    panel.hidden = false;
    panel.setAttribute("aria-labelledby", tabEl.id);

    var evidence = (t.evidence || []).map(function (ev) {
      var attrs = { href: ev.href };
      if (ev.external) { attrs.target = "_blank"; attrs.rel = "noopener"; }
      return el("li", {}, [el("a", attrs, [ev.label, ev.external ? srOnly(" (opens in a new tab)") : null])]);
    });

    panel.appendChild(el("div", { class: "appwin-bar" }, [
      el("span", { class: "appwin-dots", "aria-hidden": "true" }, [el("i"), el("i"), el("i")]),
      el("p", { class: "appwin-title", text: t.name }),
      el("span", { class: "appwin-level", text: t.level })
    ]));
    panel.appendChild(el("div", { class: "appwin-body" }, [
      el("div", {}, [
        el("h3", { text: t.name }),
        el("p", { class: "appwin-kind", text: t.kind }),
        el("p", { class: "appwin-summary", text: t.summary }),
        el("h4", { text: "How it fits into my work" }),
        el("ul", { class: "tick-list" }, (t.uses || []).map(function (u) { return el("li", { text: u }); }))
      ]),
      el("div", { class: "appwin-side" }, [
        el("h4", { text: "Proof and context" }),
        el("ul", { class: "evidence" }, evidence),
        el("h4", { text: "Example" }),
        t.example
          ? el("p", { text: t.example })
          : el("p", { class: "placeholder", "data-placeholder": "" }, ["[ADD A PROJECT OR OUTCOME WHERE YOU USED " + t.name.toUpperCase() + "]"])
      ])
    ]));
  }

  if (dock && panel && data.tools && data.tools.length) {
    dock.textContent = "";
    var tabs = [];

    function selectTool(i, focus) {
      tabs.forEach(function (tab, n) {
        var on = n === i;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
      });
      renderTool(data.tools[i], tabs[i]);
      if (focus) tabs[i].focus();
    }

    data.tools.forEach(function (t, i) {
      var tab = el("button", {
        class: "dock-tile" + (t.goal ? " is-goal" : ""), type: "button", role: "tab",
        id: "tool-tab-" + t.id, "aria-controls": "tool-panel", "aria-selected": "false", tabindex: "-1"
      }, [
        el("span", { class: "dock-logo" }, [el("img", { src: t.logo, alt: t.name + " logo", height: 48, loading: "lazy" })]),
        el("span", { class: "dock-name", text: t.name }),
        el("span", { class: "dock-level", text: t.level })
      ]);
      tab.addEventListener("click", function () { selectTool(i, false); });
      tab.addEventListener("keydown", function (e) {
        var n = tabs.length, next = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = n - 1;
        if (next !== null) { e.preventDefault(); selectTool(next, true); }
      });
      tabs.push(tab);
      dock.appendChild(tab);
    });
    selectTool(0, false);
  }

  /* ---------- certifications ---------- */
  var certGrid = document.getElementById("cert-grid");
  var certFilters = document.getElementById("cert-filters");
  var certStatus = document.getElementById("cert-status");
  var activeFilter = "all";

  function certFiles(c) {
    if (c.files && c.files.length) return c.files;
    if (c.file) return [{ label: "View certificate", href: c.file }];
    return [];
  }

  function buildCert(c) {
    var facts = (c.facts || []).map(function (f) { return el("li", { text: f }); });
    var files = certFiles(c).map(function (f) {
      return el("a", { class: "link-btn", href: f.href, target: "_blank", rel: "noopener" }, [
        icon("file"), f.label, srOnly(" for " + c.title + " (PDF, opens in a new tab)")
      ]);
    });

    var ids = c.credentialIds && c.credentialIds.length
      ? c.credentialIds
      : (c.credentialId ? [{ label: "", id: c.credentialId }] : []);

    return el("article", { class: "cert cert--" + (c.kind || "course"), "data-cat": c.category || "" }, [
      el("div", { class: "cert-top" }, [
        el("span", { class: "cert-issuer", text: c.issuer }),
        el("span", { class: "cert-date", text: c.date })
      ]),
      el("h3", { text: c.title }),
      c.badge ? el("span", { class: "cert-badge", text: c.badge }) : null,
      facts.length ? el("ul", { class: "cert-facts" }, facts) : null,
      ids.length
        ? el("details", {}, [
            el("summary", { text: ids.length > 1 ? "Credential IDs" : "Credential ID" }),
            el("div", {}, ids.map(function (x) {
              return el("div", {}, [
                x.label ? el("span", { class: "id-label", text: x.label + ":" }) : null,
                el("code", { text: x.id })
              ]);
            }))
          ])
        : null,
      files.length ? el("div", { class: "cert-actions" }, files) : null
    ]);
  }

  function renderCerts() {
    if (!certGrid) return;
    certGrid.textContent = "";
    var shown = 0;
    (data.certifications || []).forEach(function (c) {
      if (activeFilter === "all" || c.category === activeFilter) {
        certGrid.appendChild(buildCert(c));
        shown++;
      }
    });
    if (certStatus) certStatus.textContent = "Showing " + shown + " " + (shown === 1 ? "certification" : "certifications") + ".";
  }

  function setFilter(id) {
    activeFilter = id;
    if (certFilters) {
      certFilters.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === id));
      });
    }
    renderCerts();
  }

  if (certGrid && data.certifications && data.certifications.length) {
    if (certFilters && data.certificationCategories) {
      data.certificationCategories.forEach(function (cat) {
        var count = cat.id === "all"
          ? data.certifications.length
          : data.certifications.filter(function (c) { return c.category === cat.id; }).length;
        if (!count) return;
        var btn = el("button", { class: "filter-btn", type: "button", "data-filter": cat.id, "aria-pressed": String(cat.id === "all") },
          [cat.label + " (" + count + ")"]);
        btn.addEventListener("click", function () { setFilter(cat.id); });
        certFilters.appendChild(btn);
      });
    }
    renderCerts();
  }

  /* "See the results" link in the strengths section jumps to the English certificates */
  document.querySelectorAll("[data-filter-link]").forEach(function (a) {
    a.addEventListener("click", function () { setFilter(a.getAttribute("data-filter-link")); });
  });
})();
