(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("cf-theme", next);
      } catch (e) {}
      themeToggle.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  var burger = document.querySelector(".nav-burger");
  var menu = document.getElementById("mobile-menu");
  if (burger && menu) {
    var closeMenu = function () {
      burger.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    };
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
  }

  var revealEls = document.querySelectorAll(".reveal");
  var heroReveals = document.querySelectorAll(".hero .reveal");
  heroReveals.forEach(function (el, i) {
    el.style.setProperty("--reveal-delay", 0.08 * i + "s");
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }

  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var countIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          countIO.unobserve(el);
          var target = parseInt(el.getAttribute("data-count"), 10);
          if (reduceMotion) {
            el.textContent = target;
            return;
          }
          var start = null;
          var dur = 1100;
          function tick(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) {
      countIO.observe(el);
    });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count");
    });
  }

  var toast = document.getElementById("toast");
  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.hidden = true;
    }, 3200);
  }

  var captureBtn = document.getElementById("capture-btn");
  var kanban = document.getElementById("kanban");
  if (captureBtn && kanban) {
    var sampleJobs = [
      ["Senior Frontend Engineer", "Ramp · Saved from LinkedIn"],
      ["Design Engineer", "Notion · Saved from Wellfound"],
      ["Frontend Engineer", "Stripe · Pasted from a listing"],
      ["Product Engineer", "Gumroad · Saved from LinkedIn"]
    ];
    var captureCount = 0;
    captureBtn.addEventListener("click", function () {
      var job = sampleJobs[captureCount % sampleJobs.length];
      captureCount++;
      var col = kanban.querySelector(".col");
      var countEl = document.getElementById("count-wishlist");
      var card = document.createElement("div");
      card.className = "card just-added";
      card.dataset.stage = "wishlist";
      var tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = "Remote";
      var strong = document.createElement("strong");
      strong.textContent = job[0];
      var meta = document.createElement("span");
      meta.className = "meta";
      meta.textContent = job[1] + " · Just now";
      card.append(tag, strong, meta);
      col.insertBefore(card, col.children[1]);
      countEl.textContent = parseInt(countEl.textContent, 10) + 1;
      card.addEventListener(
        "animationend",
        function () {
          card.classList.remove("just-added");
        },
        { once: true }
      );
      showToast("Captured — \u201C" + job[0] + "\u201D landed in Wishlist");
    });
  }

  var form = document.getElementById("waitlist-form");
  var note = document.getElementById("cta-note");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.email.value.trim();
      if (!email) return;
      note.textContent = "You\u2019re on the list — we\u2019ll email " + email + " the moment your invite is ready.";
      form.reset();
    });
  }

  var seq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var idx = 0;
  document.addEventListener("keydown", function (e) {
    idx = e.keyCode === seq[idx] ? idx + 1 : e.keyCode === seq[0] ? 1 : 0;
    if (idx === seq.length) {
      idx = 0;
      fireConfetti();
      showToast("Easter egg found — you\u2019re a real one. Good luck out there.");
    }
  });

  var canvas = document.getElementById("confetti");
  var ctx = canvas.getContext("2d");
  var parts = [];
  var colors = ["#818cf8", "#f2f1ec", "#ff7a52", "#7cb7ff"];
  var frame = null;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function fireConfetti() {
    parts.length = 0;
    for (var i = 0; i < 140; i++) {
      parts.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 60,
        w: 5 + Math.random() * 5,
        h: 8 + Math.random() * 8,
        c: colors[i % colors.length],
        vy: 2.2 + Math.random() * 3,
        vx: -1.4 + Math.random() * 2.8,
        rot: Math.random() * Math.PI * 2,
        vr: -0.12 + Math.random() * 0.24
      });
    }
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tickConfetti);
  }

  function tickConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var alive = false;
    parts.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.rot += p.vr;
      if (p.y < canvas.height + 20) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (alive) frame = requestAnimationFrame(tickConfetti);
  }
})();
