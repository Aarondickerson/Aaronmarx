// AaronMarx Consulting — reusable discovery questionnaire.
// Data-driven + configurable via query params, so one page serves every client:
//   ?client=El Padrino&platform=SQUIRE&provider=barber&providers=barbers&plans=Executive,Titan
// Submits to Formspree via fetch. Never fabricates success; honeypot + honest failure.
(function () {
  "use strict";
  var form = document.getElementById("questionnaireForm");
  if (!form) return;

  var params = new URLSearchParams(location.search);
  function pget(k) { return (params.get(k) || "").trim(); }

  // ---- Config (sensible generic defaults; override via query params) ----
  var client = pget("client");
  var provider = pget("provider") || "team member";
  var providers = pget("providers") || (provider ? provider + "s" : "team members");
  var cfg = {
    client: client,
    bizName: client || "your business",
    platform: pget("platform") || "your booking tool",
    provider: provider,
    providers: providers,
    plans: pget("plans") ? pget("plans").split(",").map(function (s) { return s.trim(); }).filter(Boolean) : null
  };

  function sub(t) {
    if (t == null) return t;
    return String(t)
      .replace(/\{platform\}/g, cfg.platform)
      .replace(/\{providers\}/g, cfg.providers)
      .replace(/\{provider\}/g, cfg.provider)
      .replace(/\{business\}/g, cfg.bizName);
  }
  function subArr(a) { return a.map(sub); }

  // ---- Header / intro ----
  var titleEl = document.getElementById("qTitle");
  var leadEl = document.getElementById("qLead");
  if (client) {
    titleEl.innerHTML = esc(client) + "<br />questionnaire.";
    document.title = client + " — Discovery questionnaire — AaronMarx";
  }
  leadEl.textContent = "This helps me understand how " + cfg.bizName +
    " runs day-to-day so we build the right first version. It takes about 10 minutes — " +
    "no need to include any pricing or budget here; we'll talk about that directly.";
  document.getElementById("qSubject").value = "Discovery questionnaire" + (client ? " — " + client : "");
  document.getElementById("qClient").value = client;

  // ---- Plan question: checkboxes if plans provided, else a text field ----
  var planQ = cfg.plans
    ? { n: 6, star: true, type: "checks", name: "plan", text: "What plan are you on with {platform}?", options: cfg.plans.concat(["Not sure"]) }
    : { n: 6, star: true, type: "text", name: "plan", text: "What plan are you on with {platform} (if any)?" };

  // ---- Section 2 title reads well whether or not a platform was named ----
  var platformSectionTitle = pget("platform") ? ("Your current tool (" + cfg.platform + ")") : "Your current booking tool";

  // ---- Question set ----
  var SECTIONS = [
    { eyebrow: "Section 1", title: "Your business & daily operations", qs: [
      { n: 1, star: true, type: "textarea", name: "day", text: "Walk me through a typical day, open to close." },
      { n: 2, type: "text", name: "team_size", text: "How many {providers} work with you, and how many locations?" },
      { n: 3, star: true, type: "text", name: "top_goal", text: "If this project improved one thing, what should it be?" },
      { n: 4, type: "checks", name: "book_today", text: "How do customers book today? (check all)", options: ["Online / {platform}", "Phone", "Walk-in", "Text / DM", "Other"] },
      { n: 5, type: "text", name: "busiest", text: "When are you busiest, and where do you lose bookings?" }
    ]},
    { eyebrow: "Section 2", title: platformSectionTitle, qs: [
      planQ,
      { n: 7, star: true, type: "checks", name: "features_used", text: "Which features of {platform} do you actually use? (check all)", options: ["Booking / calendar", "Reminders / no-show", "Payments", "Email / text marketing", "Review requests", "Branded app", "Loyalty / gift cards", "Inventory", "Reports", "Kiosk / waitlist", "Commissions / payroll", "Booth-rent", "Client chat", "Other"] },
      { n: 8, star: true, type: "textarea", name: "features_need", text: "Which features do you need, or wish worked better?" },
      { n: 9, type: "text", name: "miss_most", text: "Anything you'd miss most if you switched?" },
      { n: 10, type: "text", name: "move_keep", text: "Any hardware, contract, or data you'd need to move or keep?" }
    ]},
    { eyebrow: "Section 3", title: "Payouts, commissions, tips & rent", qs: [
      { n: 11, star: true, type: "checks", name: "pay_model", text: "How are {providers} paid today? (check all)", options: ["Commission", "Booth / chair rent", "Hourly / salary", "Tips kept by {provider}", "Other"] },
      { n: 12, star: true, type: "textarea", name: "pay_pref", text: "How would you prefer payouts to work going forward?" },
      { n: 13, type: "checks", name: "pay_split", text: "Should payments split automatically between {providers} and the business?", options: ["Yes", "No", "Not sure"] },
      { n: 14, type: "text", name: "tips", text: "How are tips handled today?" },
      { n: 15, type: "text", name: "rent", text: "If {providers} pay booth rent, how and when is it collected?" }
    ]},
    { eyebrow: "Section 4", title: "Booking, services & scheduling", qs: [
      { n: 16, star: true, type: "textarea", name: "services", text: "What are your main services, typical times, and prices?" },
      { n: 17, type: "checks_text", name: "diff_hours", text: "Do {providers} have different hours, breaks, or days off? (details below)", options: ["Yes", "No"], subName: "diff_hours_detail", subPlaceholder: "Details (optional)" },
      { n: 18, type: "checks_text", name: "deposit", text: "Do you take a deposit to hold an appointment?", options: ["Yes", "No"], subName: "deposit_amount", subPlaceholder: "How much? (optional)" },
      { n: 19, type: "text", name: "cancel_rules", text: "Your cancellation / no-show / reschedule rules?" },
      { n: 20, type: "checks", name: "waitlist", text: "Do you run a walk-in queue or waitlist?", options: ["Yes", "No"] }
    ]},
    { eyebrow: "Section 5", title: "Payments & equipment", qs: [
      { n: 21, star: true, type: "text", name: "processor", text: "Who processes your card payments today?" },
      { n: 22, star: true, type: "checks", name: "equipment", text: "What checkout equipment do you have? (check all)", options: ["Card terminal / reader", "Tablet", "Receipt printer", "Cash drawer", "Phone tap-to-pay", "None"] },
      { n: 23, type: "text", name: "terminal_model", text: "Terminal brand / model (a photo of the label — cover the serial — is perfect):" },
      { n: 24, type: "checks", name: "pay_where", text: "Do you want customers to pay online, at the shop, or both?", options: ["Online", "In-shop", "Both"] },
      { n: 25, type: "checks", name: "provider_eval", text: "Open to evaluating Square or Stripe?", options: ["Square", "Stripe", "Keep current", "Not sure"] }
    ]},
    { eyebrow: "Section 6", title: "Promotions & customer communication", qs: [
      { n: 26, star: true, type: "text", name: "promos", text: "What promotions do you want to run?" },
      { n: 27, type: "checks", name: "first_meaning", text: "For a \u201cfirst visit\u201d offer, does \u201cfirst\u201d mean first visit to the business or to a specific {provider}?", options: ["The business", "A specific {provider}", "Not sure"] },
      { n: 28, type: "checks", name: "channels", text: "How do you reach customers today? (check all)", options: ["Email", "Text / SMS", "Instagram / social DM", "None"] },
      { n: 29, type: "text", name: "list_size", text: "Roughly how many customers are on your contact list?" },
      { n: 30, type: "text", name: "campaign_freq", text: "How often would you want to send promotions or campaigns?" },
      { n: 31, type: "checks", name: "reviews", text: "Do you ask for Google / online reviews after a visit?", options: ["Yes", "No"] }
    ]},
    { eyebrow: "Section 7", title: "Reporting & your owner view", qs: [
      { n: 32, type: "checks", name: "metrics", text: "What numbers do you want to see weekly / monthly? (check all)", options: ["Bookings", "Revenue", "Returning customers", "Each {provider}'s performance", "No-shows", "Other"] },
      { n: 33, type: "text", name: "access", text: "Besides you, who needs access, and to what?" }
    ]},
    { eyebrow: "Section 8", title: "Launch priorities", qs: [
      { n: 34, star: true, type: "textarea", name: "top_three", text: "If we could ship only three things first, what would they be?" },
      { n: 35, type: "text", name: "launch_when", text: "When would you like to launch?" },
      { n: 36, type: "checks", name: "keep_running", text: "Keep {platform} running during the switch-over?", options: ["Yes", "No", "Not sure"] },
      { n: 37, type: "text", name: "approver", text: "Who makes the final decisions and can give quick feedback?" },
      { n: 38, type: "textarea", name: "anything", text: "Anything else I should know about the business or your customers?" }
    ]}
  ];

  // ---- DOM helpers ----
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  function labelFor(q, id) {
    var html = (q.star ? '<span class="q-star">\u2605</span>' : "") +
      '<span class="q-num">' + q.n + ".</span> " + esc(sub(q.text));
    return el("label", { "for": id, html: html });
  }

  function textControl(q, id, multiline) {
    var tag = multiline ? "textarea" : "input";
    var a = { id: id, name: q.name };
    if (!multiline) a.type = "text";
    return el(tag, a);
  }

  function checksControl(q, idBase) {
    var wrap = el("div", { "class": "checks", role: "group", "aria-labelledby": idBase + "-lbl" });
    subArr(q.options).forEach(function (opt, i) {
      var cid = idBase + "-" + i;
      var input = el("input", { type: "checkbox", id: cid, name: q.name + "[]", value: opt });
      wrap.appendChild(el("label", { "class": "chk", "for": cid }, [input, el("span", { text: opt })]));
    });
    return wrap;
  }

  function buildQuestion(q) {
    var id = "q_" + q.name;
    var field = el("div", { "class": "field full" });
    var lbl = labelFor(q, id);
    lbl.id = id + "-lbl";
    field.appendChild(lbl);

    if (q.type === "text") field.appendChild(textControl(q, id, false));
    else if (q.type === "textarea") field.appendChild(textControl(q, id, true));
    else if (q.type === "checks") field.appendChild(checksControl(q, id));
    else if (q.type === "checks_text") {
      field.appendChild(checksControl(q, id));
      var ti = el("input", { type: "text", id: id + "_sub", name: q.subName, placeholder: q.subPlaceholder || "", "class": "q-subfield" });
      field.appendChild(ti);
    }
    return field;
  }

  // ---- Render contact block + sections ----
  var root = document.getElementById("qFields");

  var contact = el("div", { "class": "q-section" });
  contact.appendChild(el("div", { "class": "q-section-head" }, [
    el("span", { "class": "q-eyebrow", text: "First, the basics" }),
    el("h2", { text: "Who you are" })
  ]));
  function basicField(id, name, label, type, value, req) {
    var f = el("div", { "class": "field full" });
    f.appendChild(el("label", { "for": id, html: esc(label) + (req ? ' <span class="q-star">\u2605</span>' : "") }));
    var inp = el("input", { id: id, name: name, type: type || "text" });
    if (value) inp.value = value;
    if (req) { inp.setAttribute("required", ""); inp.setAttribute("aria-required", "true"); }
    f.appendChild(inp);
    f.appendChild(el("span", { "class": "err-msg", "data-for": id }));
    return f;
  }
  contact.appendChild(basicField("c_name", "name", "Your name", "text", "", true));
  contact.appendChild(basicField("c_email", "email", "Email", "email", "", true));
  contact.appendChild(basicField("c_business", "business", "Business name", "text", client, true));
  contact.appendChild(basicField("c_phone", "phone", "Phone (optional)", "tel", "", false));
  root.appendChild(contact);

  SECTIONS.forEach(function (s) {
    var sec = el("div", { "class": "q-section" });
    sec.appendChild(el("div", { "class": "q-section-head" }, [
      el("span", { "class": "q-eyebrow", text: s.eyebrow }),
      el("h2", { text: sub(s.title) })
    ]));
    s.qs.forEach(function (q) { sec.appendChild(buildQuestion(q)); });
    root.appendChild(sec);
  });

  // ---- Validation (only the basics are required) ----
  var statusEl = document.getElementById("formStatus");
  var summaryEl = document.getElementById("errorSummary");
  var summaryList = summaryEl ? summaryEl.querySelector("ul") : null;
  var submitBtn = document.getElementById("submitBtn");
  var successEl = document.getElementById("formSuccess");
  var submitting = false;

  var RULES = [
    { id: "c_name", msg: "Please enter your name." },
    { id: "c_email", msg: "Please enter a valid email address.", test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
    { id: "c_business", msg: "Please enter the business name." }
  ];
  function wrapOf(el2) { return el2.closest(".field"); }
  function setError(id, msg) {
    var e = document.getElementById(id); var w = wrapOf(e);
    if (w) w.classList.add("invalid"); e.setAttribute("aria-invalid", "true");
    var m = form.querySelector('.err-msg[data-for="' + id + '"]'); if (m) m.textContent = msg;
    return { id: id, msg: msg };
  }
  function clearError(id) {
    var e = document.getElementById(id); var w = wrapOf(e);
    if (w) w.classList.remove("invalid"); e.removeAttribute("aria-invalid");
    var m = form.querySelector('.err-msg[data-for="' + id + '"]'); if (m) m.textContent = "";
  }
  function validate() {
    var errs = [];
    RULES.forEach(function (r) {
      var e = document.getElementById(r.id); var v = (e.value || "").trim();
      clearError(r.id);
      if (!v) { errs.push(setError(r.id, r.msg)); return; }
      if (r.test && !r.test(v)) errs.push(setError(r.id, r.msg));
    });
    return errs;
  }
  function showSummary(errs) {
    if (!summaryEl || !summaryList) return;
    summaryList.innerHTML = "";
    errs.forEach(function (er) {
      var li = el("li"); var a = el("a", { href: "#" + er.id, text: er.msg });
      a.addEventListener("click", function (ev) { ev.preventDefault(); var t = document.getElementById(er.id); if (t) t.focus(); });
      li.appendChild(a); summaryList.appendChild(li);
    });
    summaryEl.classList.add("show"); summaryEl.focus();
  }
  function hideSummary() { if (summaryEl) summaryEl.classList.remove("show"); }

  form.addEventListener("input", function (e) {
    if (e.target.id && document.getElementById(e.target.id)) {
      var w = wrapOf(e.target);
      if (w && w.classList.contains("invalid")) clearError(e.target.id);
    }
  });

  var endpointReady = form.getAttribute("action").indexOf("YOUR_FORM_ID") === -1 &&
                      form.getAttribute("data-endpoint-configured") !== "false";

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (submitting) return;
    var hp = form.querySelector('input[name="_gotcha"]');
    if (hp && hp.value) return; // bot

    hideSummary();
    var errs = validate();
    if (errs.length) { showSummary(errs); return; }

    // keep the email subject useful
    var bizVal = (document.getElementById("c_business").value || "").trim();
    document.getElementById("qSubject").value = "Discovery questionnaire — " + (client || bizVal || "new client");

    // populate the required "goal" field (shared Formspree schema) with the client's main goal
    var goalEl = document.getElementById("qGoal");
    var topGoalInput = form.querySelector('[name="top_goal"]');
    var topGoal = topGoalInput ? (topGoalInput.value || "").trim() : "";
    if (goalEl) {
      goalEl.value = topGoal
        ? "Questionnaire — main goal: " + topGoal
        : "Discovery questionnaire submitted" + (bizVal ? " (" + bizVal + ")" : "");
    }

    if (!endpointReady) {
      statusEl.style.color = "var(--accent)";
      statusEl.textContent = "Form isn't connected to its inbox yet \u2014 email dickersoam@gmail.com for now.";
      return;
    }

    submitting = true;
    submitBtn.disabled = true;
    statusEl.style.color = "var(--muted)";
    statusEl.textContent = "Sending\u2026";

    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (res) {
        if (res.ok) {
          statusEl.textContent = "";
          form.hidden = true;
          if (successEl) { successEl.hidden = false; successEl.focus && successEl.focus(); }
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else { fail(); }
      }).catch(fail).then(function () { submitting = false; submitBtn.disabled = false; });

    function fail() {
      statusEl.style.color = "var(--accent)";
      statusEl.textContent = "Something went wrong sending that. Your answers are still here \u2014 try again, or email dickersoam@gmail.com.";
    }
  });
})();
