// AaronMarx Consulting — intake form.
// Progressive enhancement: the form still POSTs natively if JS is off.
// Never fabricates a successful submission; honors WEB-04/05/06/07.
(function () {
  "use strict";
  var form = document.getElementById("projectForm");
  if (!form) return;

  var statusEl = document.getElementById("formStatus");
  var summaryEl = document.getElementById("errorSummary");
  var summaryList = summaryEl ? summaryEl.querySelector("ul") : null;
  var submitBtn = document.getElementById("submitBtn");
  var successEl = document.getElementById("formSuccess");
  var submitting = false;

  // Localized copy: returns Spanish when i18n is active, else the English default.
  function tr(key, en) { return (window.i18nText && window.i18nText(key)) || en; }

  // ---- Service prefill from ?service= (user can still change it) ----
  var params = new URLSearchParams(location.search);
  var svc = (params.get("service") || "").toLowerCase();
  var ALIAS = { website: "website", websites: "website", web: "website",
                mobile: "mobile", app: "mobile", game: "game", games: "game",
                clarity: "clarity", support: "support", care: "support",
                improve: "support", partner: "support", other: "other" };
  var serviceSel = document.getElementById("service");
  if (svc && ALIAS[svc] && serviceSel) {
    serviceSel.value = ALIAS[svc];
    track("service_selected", ALIAS[svc]);
  }
  track("inquiry_started", serviceSel ? serviceSel.value : "");

  // ---- Lightweight, privacy-safe event hook (no PII, no form text) ----
  function track(event, service) {
    try {
      if (window.dataLayer && typeof window.dataLayer.push === "function") {
        window.dataLayer.push({ event: event, service: service || undefined });
      }
    } catch (e) { /* analytics is optional */ }
  }

  // ---- Validation ----
  var RULES = [
    { id: "name", key: "ferr.name", msg: "Please enter your name." },
    { id: "email", key: "ferr.email", msg: "Please enter a valid email address.",
      test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
    { id: "business", key: "ferr.business", msg: "Tell me the business or project name." },
    { id: "service", key: "ferr.service", msg: "Pick what you need help with." },
    { id: "budget", key: "ferr.budget", msg: "Choose a budget band (\u201cnot sure\u201d is fine)." },
    { id: "goal", key: "ferr.goal", msg: "A sentence on the goal helps a lot." }
  ];

  function fieldWrap(el) { return el.closest(".field"); }
  function setError(id, msg) {
    var el = document.getElementById(id);
    var wrap = fieldWrap(el);
    if (wrap) wrap.classList.add("invalid");
    el.setAttribute("aria-invalid", "true");
    var m = form.querySelector('.err-msg[data-for="' + id + '"]');
    if (m) m.textContent = msg;
    return { id: id, msg: msg };
  }
  function clearError(id) {
    var el = document.getElementById(id);
    var wrap = fieldWrap(el);
    if (wrap) wrap.classList.remove("invalid");
    el.removeAttribute("aria-invalid");
    var m = form.querySelector('.err-msg[data-for="' + id + '"]');
    if (m) m.textContent = "";
  }

  function validate() {
    var errors = [];
    RULES.forEach(function (r) {
      var el = document.getElementById(r.id);
      var v = (el.value || "").trim();
      var msg = tr(r.key, r.msg);
      clearError(r.id);
      if (!v) { errors.push(setError(r.id, msg)); return; }
      if (r.test && !r.test(v)) { errors.push(setError(r.id, msg)); }
    });
    return errors;
  }

  function showSummary(errors) {
    if (!summaryEl || !summaryList) return;
    summaryList.innerHTML = "";
    errors.forEach(function (e) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + e.id;
      a.textContent = e.msg;
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        var t = document.getElementById(e.id);
        if (t) t.focus();
      });
      li.appendChild(a);
      summaryList.appendChild(li);
    });
    summaryEl.classList.add("show");
    summaryEl.focus();
  }
  function hideSummary() { if (summaryEl) summaryEl.classList.remove("show"); }

  // Clear a field's error as the user fixes it
  form.addEventListener("input", function (e) {
    if (e.target.id && document.getElementById(e.target.id)) {
      var wrap = fieldWrap(e.target);
      if (wrap && wrap.classList.contains("invalid")) clearError(e.target.id);
    }
  });

  var endpointReady = form.getAttribute("action").indexOf("YOUR_FORM_ID") === -1 &&
                      form.getAttribute("data-endpoint-configured") !== "false";

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (submitting) return;

    // Honeypot — bots fill this; humans never see it.
    var hp = form.querySelector('input[name="_gotcha"]');
    if (hp && hp.value) { return; }

    hideSummary();
    var errors = validate();
    if (errors.length) { showSummary(errors); return; }

    // Endpoint not wired yet: be honest, never fake success.
    if (!endpointReady) {
      statusEl.style.color = "var(--accent)";
      statusEl.textContent = tr("fstat.notready", "Form isn't connected to its inbox yet \u2014 email dickersoam@gmail.com for now.");
      return;
    }

    submitting = true;
    submitBtn.disabled = true;
    statusEl.style.color = "var(--muted)";
    statusEl.textContent = tr("fstat.sending", "Sending\u2026");
    track("inquiry_submitted", serviceSel ? serviceSel.value : "");

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    }).then(function (res) {
      if (res.ok) {
        statusEl.textContent = "";
        form.hidden = true;
        if (successEl) { successEl.hidden = false; successEl.focus && successEl.focus(); }
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        fail();
      }
    }).catch(fail).then(function () {
      submitting = false;
      submitBtn.disabled = false;
    });

    function fail() {
      track("inquiry_failed", serviceSel ? serviceSel.value : "");
      statusEl.style.color = "var(--accent)";
      statusEl.textContent = tr("fstat.fail", "Something went wrong sending that. Your answers are still here \u2014 try again, or email dickersoam@gmail.com.");
    }
  });
})();
