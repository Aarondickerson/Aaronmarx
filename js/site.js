// Noa-inspired interactions: theme toggle, live clock, drag reel, index hover preview.
(function () {
  // Theme
  var saved = localStorage.getItem("ad-theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  function toggleTheme() {
    var cur = document.documentElement.getAttribute("data-theme") === "night" ? "day" : "night";
    document.documentElement.setAttribute("data-theme", cur);
    localStorage.setItem("ad-theme", cur);
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest(".theme-toggle")) toggleTheme();
  });

  // Live clock (local time)
  var clock = document.querySelector(".clock");
  if (clock) {
    var tick = function () {
      var d = new Date();
      var hh = String(d.getHours()).padStart(2, "0");
      var mm = String(d.getMinutes()).padStart(2, "0");
      var ss = String(d.getSeconds()).padStart(2, "0");
      clock.textContent = hh + ":" + mm + ":" + ss + " local";
    };
    tick();
    setInterval(tick, 1000);
  }

  // Drag-to-scroll reel
  var reel = document.querySelector(".reel");
  if (reel) {
    var down = false, startX, startLeft, moved = false;
    reel.addEventListener("pointerdown", function (e) {
      down = true; moved = false; startX = e.clientX; startLeft = reel.scrollLeft;
      reel.classList.add("dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      reel.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", function () {
      down = false; reel.classList.remove("dragging");
    });
    reel.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); }
    }, true);
    // wheel: vertical scroll becomes horizontal
    reel.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        reel.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }

  // Index hover preview follows cursor
  var preview = document.querySelector(".cursor-preview");
  if (preview) {
    var img = preview.querySelector("img");
    document.querySelectorAll(".index-row[data-thumb]").forEach(function (row) {
      row.addEventListener("pointerenter", function () {
        img.src = row.getAttribute("data-thumb");
        img.alt = row.getAttribute("data-title") || "";
        preview.classList.add("show");
      });
      row.addEventListener("pointerleave", function () {
        preview.classList.remove("show");
      });
    });
    window.addEventListener("pointermove", function (e) {
      preview.style.left = e.clientX + "px";
      preview.style.top = e.clientY + "px";
    });
  }
})();

/* ===== Interactive companion (Aaron) ===== */
(function () {
  if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 520) {
    // keep it, but it'll be small; no special handling needed
  }
  var PREFIX = location.pathname.indexOf("/case-studies/") !== -1 ? "../" : "";
  var DIR = PREFIX + "images/mascot/";
  var POSES = {
    base: "base.png", wave: "wave.png", point: "point.png",
    thumbsup: "thumbsup.png", think: "think.png", arms: "arms.png"
  };

  // Per-page greeting
  var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var inCase = PREFIX === "../";
  var greeting;
  if (inCase && document.querySelector(".lockbox")) {
    greeting = { pose: "think", text: "This one's private \ud83d\udd12 Pop in the password to see it." };
  } else if (inCase) {
    var h1 = document.querySelector(".display, h1");
    greeting = { pose: "point", text: "Want the story behind <b>" + (h1 ? h1.textContent.trim().split("\n")[0] : "this project") + "</b>? Scroll on." };
  } else if (file.indexOf("work") === 0) {
    greeting = { pose: "arms", text: "Everything I've shipped. Hover a row for a peek." };
  } else if (file.indexOf("about") === 0) {
    greeting = { pose: "wave", text: "Good to meet you — here's my story." };
  } else if (file.indexOf("contact") === 0) {
    greeting = { pose: "thumbsup", text: "Let's build something. Say hi 👋" };
  } else {
    greeting = { pose: "wave", text: "Hey — I'm <b>Aaron</b> 👋 Welcome in. Drag the reel to explore." };
  }

  var TIPS = [
    { pose: "think", text: "Built on research, shipped with intent." },
    { pose: "point", text: "Tap any project — I'll point the way." },
    { pose: "thumbsup", text: "Dark mode's up top-right if you like it cozy." },
    { pose: "arms", text: "A decade of product design, honestly told." },
    { pose: "wave", text: "Flick the reel or open the index up top." }
  ];
  var CLICKS = [
    { pose: "thumbsup", text: "That's me. Glad you're here." },
    { pose: "point", text: "Check the Commerce on Mobile case — it's my favorite one." },
    { pose: "think", text: "Questions? The contact page is one tap away." },
    { pose: "wave", text: "Appreciate you clicking around 🙏" }
  ];

  // Preload
  Object.keys(POSES).forEach(function (k) { var i = new Image(); i.src = DIR + POSES[k]; });

  if (localStorage.getItem("ad-buddy-off") === "1") { makeChip(); return; }
  build();

  var el, imgEl, bubbleEl, busyUntil = 0, idleTimer, bubbleTimer, tipIdx = 0, clickIdx = 0;

  function build() {
    el = document.createElement("div");
    el.className = "ad-buddy";
    el.innerHTML =
      '<div class="ad-bubble" role="status" aria-live="polite"></div>' +
      '<img class="ad-buddy-img" alt="Aaron — your guide" draggable="false" />' +
      '<button class="ad-buddy-close" aria-label="Hide guide" title="Hide">\u00d7</button>';
    document.body.appendChild(el);
    imgEl = el.querySelector(".ad-buddy-img");
    bubbleEl = el.querySelector(".ad-bubble");
    setPose(greeting.pose);

    el.querySelector(".ad-buddy-close").addEventListener("click", function (e) {
      e.stopPropagation();
      el.remove();
      localStorage.setItem("ad-buddy-off", "1");
      makeChip();
    });
    imgEl.addEventListener("click", function () {
      var c = CLICKS[clickIdx % CLICKS.length]; clickIdx++;
      react(c.pose, c.text, 4200);
    });

    // greet shortly after load
    setTimeout(function () { react(greeting.pose, greeting.text, 5200); }, 650);

    wireScroll();
    wireLinks();
    startIdle();
  }

  function setPose(name) {
    if (!imgEl) return;
    el.classList.add("swap");
    setTimeout(function () {
      imgEl.src = DIR + (POSES[name] || POSES.base);
      el.classList.remove("swap");
    }, 150);
  }
  function say(text, dur) {
    if (!bubbleEl) return;
    bubbleEl.innerHTML = text;
    bubbleEl.classList.add("show");
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { bubbleEl.classList.remove("show"); }, dur || 4000);
  }
  function react(pose, text, dur) {
    setPose(pose);
    say(text, dur);
    busyUntil = Date.now() + (dur || 4000);
  }

  function startIdle() {
    clearInterval(idleTimer);
    idleTimer = setInterval(function () {
      if (document.hidden) return;
      if (Date.now() < busyUntil) return;
      // occasional subtle idle shift / tip
      if (Math.random() < 0.45) {
        var t = TIPS[tipIdx % TIPS.length]; tipIdx++;
        react(t.pose, t.text, 4200);
      } else {
        setPose(Math.random() < 0.5 ? "arms" : "base");
      }
    }, 9000);
  }

  function wireScroll() {
    var lastY = window.scrollY, t;
    window.addEventListener("scroll", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var y = window.scrollY;
        var nearBottom = (window.innerHeight + y) >= (document.body.scrollHeight - 160);
        if (nearBottom && Date.now() > busyUntil - 1000) {
          react("point", "Like what you see? Let's <b>talk</b>.", 4600);
        }
        lastY = y;
      }, 220);
    }, { passive: true });
  }

  function wireLinks() {
    var sel = ".reel-card, .index-row, .project-nav a, .work-cta, a.btn";
    document.querySelectorAll(sel).forEach(function (a) {
      a.addEventListener("mouseenter", function () {
        if (Date.now() < busyUntil) return;
        var label = a.getAttribute("data-title") ||
          (a.querySelector(".index-title, .np-title, .r-title") ? a.querySelector(".index-title, .np-title, .r-title").textContent.trim() : "");
        react("point", label ? ("Open <b>" + label + "</b> →") : "Take a look →", 2600);
      });
    });
  }

  function makeChip() {
    if (document.querySelector(".ad-buddy-chip")) return;
    var chip = document.createElement("button");
    chip.className = "ad-buddy-chip";
    chip.innerHTML = '<img src="' + DIR + POSES.wave + '" alt="" /> Bring Aaron back';
    chip.addEventListener("click", function () {
      chip.remove();
      localStorage.removeItem("ad-buddy-off");
      build();
    });
    document.body.appendChild(chip);
  }
})();
