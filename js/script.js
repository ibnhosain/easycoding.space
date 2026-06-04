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
  var navDrawer  = document.querySelector(".nav-drawer");

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
  var aside   = document.querySelector("aside");
  var togBtn  = document.querySelector(".sidebar-toggle");
  var overlay = document.querySelector(".sidebar-overlay");

  function openSidebar() {
    if (!aside) return;
    aside.classList.add("sidebar-open");
    if (overlay) overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeSidebar() {
    if (!aside) return;
    aside.classList.remove("sidebar-open");
    if (overlay) overlay.classList.remove("active");
    document.body.style.overflow = "";
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
  var links    = Array.from(document.querySelectorAll("aside a[href^='#']"));

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
