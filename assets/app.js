(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  const THEME_KEY = "nak_theme";
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "light" || savedTheme === "dark") document.documentElement.setAttribute("data-theme", savedTheme);
  else document.documentElement.setAttribute("data-theme", "dark");
  const themeBtn = $("#themeToggle");
  if (themeBtn){
    const updateIcon = () => {
      const t = document.documentElement.getAttribute("data-theme");
      themeBtn.setAttribute("aria-label", t === "dark" ? "Chuyển sang sáng" : "Chuyển sang tối");
      themeBtn.innerHTML = t === "dark" ? "🌙" : "☀️";
    };
    updateIcon();
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
      updateIcon();
    });
  }

  const burger = $("#hamburger");
  const menu = $("#menu");
  if (burger && menu){
    burger.addEventListener("click", () => {
      menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", menu.classList.contains("open") ? "true" : "false");
    });
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("open")) return;
      const inside = menu.contains(e.target) || burger.contains(e.target);
      if (!inside) menu.classList.remove("open");
    });
  }

  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$('a[data-page]').forEach(a => {
    const p = (a.getAttribute("data-page") || "").toLowerCase();
    if (p === path) a.classList.add("active");
  });

  const btt = $("#backToTop");
  if (btt){
    const onScroll = () => btt.classList.toggle("show", window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  const progress = $("#progress");
  if (progress){
    const calc = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = (doc.scrollHeight - doc.clientHeight);
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      progress.style.width = Math.max(0, Math.min(100, pct)) + "%";
    };
    window.addEventListener("scroll", calc, { passive: true });
    calc();
  }

  // Inject profile values (assets/profile.js)
  const P = window.PROFILE || {};
  const setText = (key, value) => {
    $$(`[data-profile="${key}"]`).forEach(el => el.textContent = value ?? "");
  };
  if (P.name) setText("name", P.name);
  if (P.birthYear) setText("birthYear", String(P.birthYear));
  if (P.school) setText("school", P.school);
  if (P.major) setText("major", P.major);
  if (P.className) setText("className", P.className);
  if (P.location) setText("location", P.location);
  if (P.email) setText("email", P.email);
  if (P.phone) setText("phone", P.phone);
  if (P.social) setText("social", P.social);
  if (P.tagline) setText("tagline", P.tagline);
  if (P.motto) setText("motto", P.motto);

  // Intro section (about.html)
  if (P.intro){
    setText("introHeadline", P.intro.headline);
    setText("introBio", P.intro.bio);
    setText("introGoal", P.intro.goal);
    setText("introStrength", P.intro.strength);

    const barWrap = document.getElementById("introSkillBars");
    if (barWrap && Array.isArray(P.intro.skillBars)){
      barWrap.innerHTML = P.intro.skillBars.map(s => {
        const lvl = Math.max(0, Math.min(100, Number(s.level) || 0));
        return `
          <div class="skillbar fade-up">
            <div class="skillbar-top">
              <div class="skillbar-name">${s.name || "Kỹ năng"}</div>
              <div class="skillbar-pct">${lvl}%</div>
            </div>
            <div class="skillbar-track"><div class="skillbar-fill" data-target="${lvl}" style="width:0%"></div></div>
          </div>
        `;
      }).join("");
    }
      // animate fills
      requestAnimationFrame(() => {
        barWrap.querySelectorAll(".skillbar-fill[data-target]").forEach(f => {
          const t = Math.max(0, Math.min(100, Number(f.getAttribute("data-target"))||0));
          f.style.width = t + "%";
        });
      });

  }


  const renderPills = (id, arr) => {
    const el = document.getElementById(id);
    if (!el || !Array.isArray(arr)) return;
    el.innerHTML = arr.map(x => `<span class="pill">${x}</span>`).join("");
  };
  renderPills("hobbyPills", P.hobbies);
  renderPills("skillPills", P.skills);

  // Posts filter (posts.html) - preserve if present
  const search = $("#postSearch");
  const chips = $$(".filter-chip");
  const posts = $$(".post[data-title]");
  const applyFilter = () => {
    const q = (search?.value || "").trim().toLowerCase();
    const activeChip = chips.find(c => c.classList.contains("active"));
    const tag = activeChip ? (activeChip.getAttribute("data-tag") || "all") : "all";

    posts.forEach(p => {
      const title = (p.getAttribute("data-title") || "").toLowerCase();
      const t = (p.getAttribute("data-tag") || "").toLowerCase();
      const okQ = !q || title.includes(q);
      const okT = (tag === "all") || (t === tag);
      p.style.display = (okQ && okT) ? "" : "none";
    });
  };
  if (search && posts.length){
    search.addEventListener("input", applyFilter);
    chips.forEach(c => c.addEventListener("click", () => {
      chips.forEach(x => x.classList.remove("active"));
      c.classList.add("active");
      applyFilter();
    }));
    applyFilter();
  }

  // Contact form: save message to localStorage (contact.html) - preserve if present
  const form = $("#contactForm");
  if (form){
    const nameEl = $("#cName");
    const emailEl = $("#cEmail");
    const msgEl = $("#cMsg");
    const status = $("#contactStatus");
    const MSG_KEY = "nak_messages";
    const renderCount = () => {
      const arr = JSON.parse(localStorage.getItem(MSG_KEY) || "[]");
      const badge = $("#savedCount");
      if (badge) badge.textContent = String(arr.length);
    };
    renderCount();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (nameEl?.value || "").trim();
      const email = (emailEl?.value || "").trim();
      const msg = (msgEl?.value || "").trim();
      if (!name || !email || !msg){
        if (status) status.textContent = "Vui lòng điền đầy đủ thông tin.";
        return;
      }
      const entry = { name, email, msg, at: new Date().toISOString() };
      const arr = JSON.parse(localStorage.getItem(MSG_KEY) || "[]");
      arr.unshift(entry);
      localStorage.setItem(MSG_KEY, JSON.stringify(arr.slice(0, 20)));
      if (status) status.textContent = "Đã lưu góp ý (mẫu) vào trình duyệt. Cảm ơn bạn!";
      form.reset();
      renderCount();
    });
    const clearBtn = $("#clearMessages");
    if (clearBtn){
      clearBtn.addEventListener("click", () => {
        localStorage.removeItem(MSG_KEY);
        renderCount();
        if (status) status.textContent = "Đã xoá các góp ý đã lưu (mẫu).";
      });
    }
  }

  // Certificates list render (certificates.html)
  const certWrap = document.getElementById("certList");
  if (certWrap && Array.isArray(P.certificates)){
    const badgeClass = (s) => {
      const v = (s||"").toLowerCase();
      if (v.includes("hoàn")) return "ok";
      if (v.includes("đang")) return "warn";
      return "todo";
    };
    certWrap.innerHTML = P.certificates.map((c) => {
      const proofUrl = (c.proof && String(c.proof).trim()) ? String(c.proof).trim() : "assets/cert-networking-basics.png";
      const isImage = /\.(png|jpe?g|webp|gif|svg)$/i.test(proofUrl);
      const proofImg = isImage ? proofUrl : "assets/cert-networking-basics.png";
      const proofAlt = "Minh chứng - " + (c.title || "Chứng chỉ");
      return `
        <div class="panel fade-up" style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; flex-wrap:wrap;">
            <div>
              <h4 style="margin:0 0 6px;">${c.title || "Chứng chỉ"}</h4>
              <div class="date">${c.issuer || ""} • ${c.date || ""}</div>
            </div>
            <div class="badge2 ${badgeClass(c.status)}">🏅 ${c.status || "TODO"}</div>
          </div>
          <div style="color:var(--muted); font-size:14px;">
            <b>Kỹ năng liên quan:</b> ${c.skills || "TODO"}
          </div>
          ${(c.hours || c.instructor) ? `<div style="color:var(--muted); font-size:13px;">${c.instructor ? `<b>Giảng viên:</b> ${c.instructor}` : ""}${(c.instructor && c.hours) ? " • " : ""}${c.hours ? `<b>Thời lượng:</b> ${c.hours} giờ` : ""}</div>` : ""}
          <div class="cert-proof">
            <a href="${proofUrl}" target="_blank" rel="noopener" title="Mở minh chứng">
              <img src="${proofImg}" alt="${proofAlt}">
            </a>
          </div>
          <div class="row">
            ${(c.verifyUrl && String(c.verifyUrl).trim() && !String(c.verifyUrl).includes("TODO")) ? `<a class="btn" href="${c.verifyUrl}" target="_blank" rel="noopener">✅ Xác nhận</a>` : ""}
            <a class="btn" href="contact.html">✉️ Nhận góp ý</a>
          </div>
        </div>
      `;
    }).join("");
  }


  // Render skill bars (about.html)
  const skillWrap = document.getElementById("skillBars");
  const animateSkillBars = () => {
    if (!skillWrap || !Array.isArray(P.skillBars)) return;
    skillWrap.innerHTML = P.skillBars.map(s => `
      <div class="skillbar fade-up">
        <div class="label">${s.label}</div>
        <div class="track"><div class="fill" style="width:${Math.max(0, Math.min(100, Number(s.value)||0))}%"></div></div>
      </div>
    `).join("");
    // trigger reveal for newly created nodes
    setTimeout(() => {
      skillWrap.querySelectorAll(".fill").forEach(el => {
        const w = el.style.width;
        el.style.width = "0%";
        // next tick
        requestAnimationFrame(() => { el.style.width = w; });
      });
    }, 20);
  };
  animateSkillBars();

  // Reveal animations
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: no-preference)").matches){
    const items = $$(".fade-up");
    if (items.length){
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting){
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      items.forEach(el => io.observe(el));
    }
  } else {
    $$(".fade-up").forEach(el => el.classList.add("in"));
  }

})();
