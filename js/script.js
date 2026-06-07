/* ============================================================
   script.js — Easy Coding Space
   ১. Header nav active
   ২. Hamburger menu (mobile)
   ৩. Sidebar slide drawer (mobile)
   ৪. Section show/hide
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ---- ১. HEADER NAV ACTIVE ---- */
  (function () {
    var cur = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-list a, .nav-drawer a").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var page = href.split("/").pop();
      if (href === "#" || href === "./" || href === "") page = "index.html";
      if (page && page === cur) a.classList.add("nav-active");
    });
  })();


  /* ---- ২. HAMBURGER ---- */
  var hamburger = document.querySelector(".hamburger");
  var navDrawer = document.querySelector(".nav-drawer");

  if (hamburger && navDrawer) {
    hamburger.addEventListener("click", function () {
      var open = navDrawer.classList.toggle("open");
      hamburger.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", String(open));
    });
    navDrawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navDrawer.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* ---- ৩. SIDEBAR DRAWER (mobile) ---- */
  var aside = document.querySelector("aside");
  var togBtn = document.querySelector(".sidebar-toggle");
  var overlay = document.querySelector(".sidebar-overlay");

  function openSidebar() {
    if (!aside) return;
    aside.classList.add("sidebar-open");
    if (overlay) overlay.classList.add("active");
  }
  function closeSidebar() {
    if (!aside) return;
    aside.classList.remove("sidebar-open");
    if (overlay) overlay.classList.remove("active");
  }

  if (togBtn) togBtn.addEventListener("click", function () {
    aside && aside.classList.contains("sidebar-open") ? closeSidebar() : openSidebar();
  });
  if (overlay) overlay.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeSidebar();
      if (navDrawer) { navDrawer.classList.remove("open"); if (hamburger) hamburger.classList.remove("open"); }
    }
  });


  /* ---- ৪. SECTION SHOW / HIDE ---- */
  var sections = Array.from(document.querySelectorAll("section.ec-section"));
  var links = Array.from(document.querySelectorAll("aside a[href^='#']"));

  /* index.html এ section.ec-section নেই — এখানেই থামো */
  if (!sections.length) return;

  /* প্রথমে সব section hide করো */
  sections.forEach(function (s) { s.style.display = "none"; });

  /* valid id set */
  var validIds = {};
  sections.forEach(function (s) { validIds[s.id] = true; });

  function show(id) {
    /* invalid হলে প্রথম section */
    if (!id || !validIds[id]) id = sections[0].id;

    /* সব hide */
    sections.forEach(function (s) { s.style.display = "none"; });

    /* এটা দেখাও */
    var el = document.getElementById(id);
    if (el) el.style.display = "";

    /* sidebar active highlight */
    links.forEach(function (a) {
      var lid = a.getAttribute("href").slice(1);
      a.classList.toggle("active", lid === id);
      if (lid === id && aside && window.innerWidth > 768) {
        var t = a.offsetTop, b = t + a.offsetHeight;
        var st = aside.scrollTop, sb = st + aside.clientHeight;
        if (t < st + 16) aside.scrollTop = t - 16;
        else if (b > sb - 16) aside.scrollTop = b - aside.clientHeight + 16;
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    closeSidebar();
  }

  /* sidebar link click */
  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var id = this.getAttribute("href").slice(1);
      if (history.pushState) history.pushState(null, "", "#" + id);
      show(id);
    });
  });

  /* browser back/forward */
  window.addEventListener("popstate", function () {
    show(window.location.hash.replace("#", ""));
  });

  /* পেজ লোডে সঠিক section দেখাও */
  show(window.location.hash.replace("#", ""));

});
/* ===== Brevo Subscribe ===== */
function sibSubmit() {
  const email = document.getElementById('sib-email').value.trim();
  const msg = document.getElementById('sib-msg');

  if (!email) {
    msg.style.color = '#ff6b6b';
    msg.textContent = 'ইমেইল লিখুন।';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    msg.style.color = '#ff6b6b';
    msg.textContent = 'সঠিক ইমেইল দিন।';
    return;
  }

  const btn = document.querySelector('.subscribe-btn');
  btn.textContent = 'অপেক্ষা করুন...';
  btn.disabled = true;

  const formData = new FormData();
  formData.append('EMAIL', email);
  formData.append('OPT_IN', 'true');

  fetch('https://975c7de4.sibforms.com/serve/MUIFAD5rCKWi61hFY_-oiY9m5dUxQfK-cZ-c9Q-eeMrUBFw4vOVtemyGFMo2Cmevdhm-j4woyFEbWc338RJh_A87Z0iUatpRVdW7k0vg3oKBbfPXiJdfSpyJpmcRh13jpgHvcdxx_u9rguQRfDMcDn0Uea2eQA58zYASxWpZedsskvh6idZZwv9bxCSXIrQbrLiR8jxzCoo-llxpOQ==', {
    method: 'POST',
    body: formData,
    mode: 'no-cors'
  })
    .then(() => {
      msg.style.color = '#4ade80';
      msg.textContent = 'আলহামদুলিল্লাহ! সফলভাবে সাবস্ক্রাইব হয়েছে।';
      document.getElementById('sib-email').value = '';
      btn.textContent = 'সাবস্ক্রাইব করুন';
      btn.disabled = false;
    })
    .catch(() => {
      msg.style.color = '#ff6b6b';
      msg.textContent = 'কোনো সমস্যা হয়েছে, আবার চেষ্টা করুন।';
      btn.textContent = 'সাবস্ক্রাইব করুন';
      btn.disabled = false;
    });
}

/* ===== Code-box Touch Scroll Fix ===== */
(function () {
  var codeBlocks = document.querySelectorAll('.code-block');
  codeBlocks.forEach(function (el) {
    var startX, startY, startScrollLeft;

    el.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startScrollLeft = el.scrollLeft;
    }, { passive: true });

    el.addEventListener('touchmove', function (e) {
      var dx = Math.abs(e.touches[0].clientX - startX);
      var dy = Math.abs(e.touches[0].clientY - startY);

      /* horizontal scroll বেশি হলে code scroll করো */
      if (dx > dy && dx > 8) {
        el.scrollLeft = startScrollLeft - (e.touches[0].clientX - startX);
        e.stopPropagation();
      }
      /* vertical scroll বেশি হলে page scroll হতে দাও */
    }, { passive: true });
  });
})();

/* ===== Quiz ===== */
document.querySelectorAll('.eq-item').forEach(function(item) {
  var correct = parseInt(item.dataset.correct);
  var opts = item.querySelectorAll('.eq-opt');
  var fb = item.querySelector('.eq-fb');
  var done = false;
  opts.forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (done) return;
      done = true;
      opts.forEach(function(b) { b.disabled = true; });
      if (parseInt(btn.dataset.idx) === correct) {
        btn.classList.add('correct');
        fb.style.color = '#a6e3a1';
        fb.textContent = '✅ সঠিক! চমৎকার!';
      } else {
        btn.classList.add('wrong');
        opts[correct].classList.add('correct');
        fb.style.color = '#f38ba8';
        fb.textContent = '❌ ভুল — সঠিক উত্তর সবুজে দেখানো হয়েছে।';
      }
    });
  });
});

/* ===== Project Live Editor — Real-time ===== */
(function () {

  function decode(s) {
    return s
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  function tabSupport(ta) {
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var s = this.selectionStart;
        this.value = this.value.substring(0, s) + '  ' + this.value.substring(this.selectionEnd);
        this.selectionStart = this.selectionEnd = s + 2;
      }
    });
  }

  document.querySelectorAll('.ep-wrap').forEach(function (wrap) {
    var btn   = wrap.querySelector('.ep-run');
    var frame = wrap.querySelector('.ep-frame');
    if (!btn || !frame) return;

    var editor = wrap.querySelector('.ep-editor');

    /* ────────────────────────────────────────
       CSS editor: ep-editor-css
       দুটো textarea: .ep-html-code + .ep-css-code
    ──────────────────────────────────────── */
    if (editor && editor.classList.contains('ep-editor-css')) {
      var taHtml = wrap.querySelector('.ep-html-code');
      var taCss  = wrap.querySelector('.ep-css-code');
      if (!taHtml || !taCss) return;

      function runCss() {
        var html = decode(taHtml.value);
        var css  = decode(taCss.value);
        html = html.replace(/<link[^>]+stylesheet[^>]*>/gi, '');
        html = html.replace('</head>', '<style>' + css + '</style></head>');
        frame.srcdoc = html;
      }

      /* Real-time: CSS textarea-তে input হলে সাথে সাথে update */
      taCss.addEventListener('input', runCss);
      taHtml.addEventListener('input', runCss);
      btn.addEventListener('click', runCss);
      tabSupport(taHtml);
      tabSupport(taCss);
      runCss();
      return;
    }

    /* ────────────────────────────────────────
       JS editor: ep-editor-js
       দুটো textarea: .ep-html-code + .ep-js-code
    ──────────────────────────────────────── */
    if (editor && editor.classList.contains('ep-editor-js')) {
      var taHtmlJs = wrap.querySelector('.ep-html-code');
      var taJs     = wrap.querySelector('.ep-js-code');
      if (!taHtmlJs || !taJs) return;

      function runJs() {
        var html = decode(taHtmlJs.value);
        var code = decode(taJs.value);
        html = html.replace('</body>', '<script>' + code + '<\/script></body>');
        frame.srcdoc = html;
      }

      /* JS-এ শুধু ▶ বাটনে run — real-time JS চালানো unsafe */
      btn.addEventListener('click', runJs);
      taHtmlJs.addEventListener('input', function() {
        /* HTML পরিবর্তনে auto-update */
        runJs();
      });
      tabSupport(taHtmlJs);
      tabSupport(taJs);
      runJs();
      return;
    }

    /* ────────────────────────────────────────
       HTML editor: single textarea
    ──────────────────────────────────────── */
    var ta = wrap.querySelector('.ep-textarea');
    if (!ta) return;

    function runHtml() {
      var code = decode(ta.value);
      if (/<!DOCTYPE/i.test(code) || /<html/i.test(code)) {
        frame.srcdoc = code;
      } else {
        frame.srcdoc = '<!DOCTYPE html><html><head><meta charset="UTF-8">'
          + '<style>body{font-family:sans-serif;padding:14px;font-size:15px;line-height:1.7}</style>'
          + '</head><body>' + code + '</body></html>';
      }
    }

    ta.addEventListener('input', runHtml);
    btn.addEventListener('click', runHtml);
    tabSupport(ta);
    runHtml();
  });

})();
