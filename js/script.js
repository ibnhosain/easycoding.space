/* ============================================================
   script.js — DevShikhi
   ১. Header nav active (current page detection)
   ২. Hamburger menu (mobile nav)
   ৩. Sidebar slide drawer (mobile)
   ৪. Active sidebar highlight (scroll-based)
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ================================================================
     ১. HEADER NAV ACTIVE — বর্তমান পেইজ অনুযায়ী nav link active
     
     কীভাবে কাজ করে:
       window.location.pathname → "/css.html"
       .split("/").pop()        → "css.html"
       
       প্রতিটি nav link-এর href থেকেও filename বের করা হয়:
       "./css.html" → "css.html"
       
       দুটো মিললে "nav-active" class যোগ হয়।
       index.html-এ filename খালি থাকলে "index.html" ধরা হয়।
  ================================================================ */
  (function setHeaderNavActive() {
    /* বর্তমান পেইজের filename */
    var currentPage = window.location.pathname.split("/").pop() || "index.html";

    /* header nav + mobile drawer — উভয়ের লিংক চেক করা */
    var navLinks = document.querySelectorAll(".nav-list a, .nav-drawer a");

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";

      /* href থেকে filename বের করা */
      /* "./css.html" → "css.html" | "css.html" → "css.html" | "#" → "#" */
      var linkPage = href.split("/").pop();

      /* Home লিংক: href="#" বা "index.html" উভয়ের জন্য */
      if (href === "#" || href === "./" || href === "") {
        linkPage = "index.html";
      }

      if (linkPage && linkPage === currentPage) {
        link.classList.add("nav-active");
      }
    });
  })();


  /* ================================================================
     ২. HAMBURGER — Mobile Nav Toggle
  ================================================================ */
  var hamburger = document.querySelector(".hamburger");
  var navDrawer = document.querySelector(".nav-drawer");

  if (hamburger && navDrawer) {
    hamburger.addEventListener("click", function () {
      var isOpen = navDrawer.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    navDrawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navDrawer.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* ================================================================
     ৩. SIDEBAR DRAWER — Mobile Slide-in
  ================================================================ */
  var aside = document.querySelector("aside");
  var sidebarToggle = document.querySelector(".sidebar-toggle");
  var sidebarOverlay = document.querySelector(".sidebar-overlay");

  function openSidebar() {
    if (!aside) return;
    aside.classList.add("sidebar-open");
    if (sidebarOverlay) sidebarOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    if (!aside) return;
    aside.classList.remove("sidebar-open");
    if (sidebarOverlay) sidebarOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      aside && aside.classList.contains("sidebar-open")
        ? closeSidebar()
        : openSidebar();
    });
  }

  if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeSidebar();
    if (navDrawer) {
      navDrawer.classList.remove("open");
      if (hamburger) hamburger.classList.remove("open");
    }
  });


  /* ================================================================
     ৪. ACTIVE SIDEBAR — সঠিক scroll-based লজিক

     লজিক:
       H = 75 (header height)
       rect.top ≤ H → section header line পার হয়েছে

       সব section loop করে শেষবার যেটার rect.top ≤ H পাওয়া গেছে
       সেটাই active (user এটাই পড়ছে)।

       Early break: rect.top > H পেলে loop বন্ধ
       কারণ DOM order-এ পরের সব section-ও নিচে থাকবে।
  ================================================================ */
  var sections = Array.from(document.querySelectorAll("main section[id]"));
  var sidebarLinks = Array.from(document.querySelectorAll("aside ul li a[href^='#']"));

  if (!sections.length || !sidebarLinks.length) return;

  /* id → link ম্যাপ */
  var linkMap = {};
  sidebarLinks.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    if (id) linkMap[id] = link;
  });

  var currentActive = "";

  function setActive(id) {
    if (!id || id === currentActive) return;
    currentActive = id;

    sidebarLinks.forEach(function (l) { l.classList.remove("active"); });

    var activeLink = linkMap[id];
    if (!activeLink) return;
    activeLink.classList.add("active");

    /* Desktop sidebar — active link দেখা যাচ্ছে কিনা নিশ্চিত */
    if (!aside || window.innerWidth <= 768) return;
    var linkTop = activeLink.offsetTop;
    var linkBottom = linkTop + activeLink.offsetHeight;
    var aTop = aside.scrollTop;
    var aBot = aTop + aside.clientHeight;
    if (linkTop < aTop + 16) aside.scrollTop = linkTop - 16;
    else if (linkBottom > aBot - 16) aside.scrollTop = linkBottom - aside.clientHeight + 16;
  }

  function findActiveSection() {
    var H = 75;
    var scrollY = window.scrollY;
    var winH = window.innerHeight;
    var pageH = document.documentElement.scrollHeight;

    /* পেজের শেষে → শেষ section */
    if (scrollY + winH >= pageH - 20) {
      return sections[sections.length - 1].id;
    }

    var result = sections[0].id;

    for (var i = 0; i < sections.length; i++) {
      var top = sections[i].getBoundingClientRect().top;
      if (top <= H) {
        result = sections[i].id;
      } else {
        break; /* early break — DOM order-এ পরেরগুলোও নিচে */
      }
    }

    return result;
  }

  /* Scroll listener — rAF throttle */
  var rafPending = false;
  window.addEventListener("scroll", function () {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      setActive(findActiveSection());
      rafPending = false;
    });
  }, { passive: true });

  /* Sidebar link ক্লিক → smooth scroll */
  sidebarLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (!href || href[0] !== "#") return;
      e.preventDefault();

      var targetId = href.slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;

      var top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: "smooth" });

      setActive(targetId);
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  /* Initial active — পেজ লোডে সঠিক section active */
  setActive(findActiveSection());
  setTimeout(function () {
    currentActive = "";
    setActive(findActiveSection());
  }, 100);

});