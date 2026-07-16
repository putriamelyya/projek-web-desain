// ============================
// BAKSO RAIHAN — page & tab logic
// ============================

document.addEventListener("DOMContentLoaded", function () {

  // ---- Page-view navigation (Home / Menu / Tentang / Kontak) ----
  const navLinks = document.querySelectorAll("[data-page]");
  const pageViews = document.querySelectorAll(".page-view");

  function showPage(pageName) {
    pageViews.forEach(function (view) {
      view.classList.toggle("active", view.id === "page-" + pageName);
    });

    document.querySelectorAll(".nav-link-page").forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("data-page") === pageName);
    });

    // scroll to top when switching page
    window.scrollTo({ top: 0, behavior: "instant" });

    // close mobile navbar collapse if open
    const collapse = document.getElementById("navLinks");
    if (collapse && collapse.classList.contains("show")) {
      collapse.classList.remove("show");
    }

    // re-check reveal elements on the page that just became visible
    // (elements sitting inside a display:none page can't be measured,
    // so we give the browser one frame to lay them out, then recheck)
    requestAnimationFrame(revealElementsInViewport);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      showPage(page);
    });
  });

  // ---- Navbar gets a deeper shadow once the page is scrolled ----
  const mainNav = document.querySelector(".main-nav");
  function updateNavShadow() {
    if (!mainNav) return;
    mainNav.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", updateNavShadow, { passive: true });
  updateNavShadow();

  // ---- Menu tabs (Bakso / Tambahan / Minuman) ----
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const target = btn.getAttribute("data-tab");

      tabButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      tabPanels.forEach(function (panel) {
        panel.classList.toggle("active", panel.id === "tab-" + target);
      });

      // newly-shown tab panel may reveal cards that were never on screen yet
      requestAnimationFrame(revealElementsInViewport);
    });
  });

  // ---- Contact form (Kontak page) ----
  // NOTE: ini website statis tanpa backend/server, jadi form ini
  // TIDAK benar-benar mengirim email atau menyimpan data ke mana pun.
  // Ini cuma menampilkan pesan konfirmasi di layar (client-side only).
  // Kalau butuh form yang beneran terkirim, perlu tambahan backend
  // (misalnya Formspree, Google Form, atau server sendiri).
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nama = document.getElementById("namaPengirim").value.trim();
      const kategori = document.getElementById("kategoriPesan").value;
      const pesan = document.getElementById("isiPesan").value.trim();

      if (!nama || !kategori || !pesan) {
        formStatus.textContent = "⚠️ Mohon lengkapi nama, kategori, dan pesan dulu ya.";
        formStatus.className = "form-status error";
        return;
      }

      formStatus.textContent = "✅ Pesan kamu berhasil dicatat! Terima kasih, " + nama + ".";
      formStatus.className = "form-status success";
      contactForm.reset();
    });
  }

  // ---- Gentle scroll-reveal for cards & sections ----
  // Purely cosmetic: elements marked with class="reveal" fade + slide
  // into place the first time they enter the viewport. Respects users
  // who've asked their OS for reduced motion.
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = document.querySelectorAll(".reveal");
  let revealObserver = null;

  function revealElementsInViewport() {
    if (!revealObserver) return;
    revealTargets.forEach(function (el) {
      if (el.classList.contains("is-visible")) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
      if (inView) {
        el.classList.add("is-visible");
        revealObserver.unobserve(el);
      }
    });
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });

    // reveal whatever is already sitting inside the initial active page
    requestAnimationFrame(revealElementsInViewport);
  }

});