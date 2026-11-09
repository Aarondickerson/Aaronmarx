// AaronMarx — lightweight in-place i18n (EN default, ES translation).
// Scope: consulting-side pages (consulting, start-project, contact).
// Text lives in the HTML as English (the source); this file supplies Spanish
// and swaps it in place. English is restored from a per-element cache, so no
// English dictionary is needed. Preference persists in localStorage + ?lang.
(function () {
  "use strict";

  var STORE_KEY = "ad-lang";
  var SUPPORTED = ["en", "es"];

  function initialLang() {
    try {
      var p = new URLSearchParams(location.search).get("lang");
      if (p && SUPPORTED.indexOf(p) > -1) return p;
      var s = localStorage.getItem(STORE_KEY);
      if (s && SUPPORTED.indexOf(s) > -1) return s;
    } catch (e) {}
    return "en";
  }

  // Set synchronously so scripts loaded after this (site.js) can read the lang.
  var current = initialLang();
  window.AD_LANG = current;

  var DICT = {
    es: {
      /* ---- Header / nav ---- */
      "nav.work": "Trabajo",
      "nav.index": "Índice",
      "nav.profile": "Perfil",
      "nav.contact": "Contacto",
      "nav.consulting": "Consultoría",

      /* ---- Consulting: hero ---- */
      "c.eyebrow": "AaronMarx Consultoría",
      "c.hero.title": 'Construye tu próxima<br /><span class="u-serif">jugada digital.</span>',
      "c.hero.lede": "Sitios web, prototipos de apps y experiencias interactivas — diseñados y construidos junto a Aaron, desde el primer alcance claro hasta la siguiente mejora útil. Colaboración directa y práctica; sin capas de cuentas, sin equipos inflados.",
      "c.hero.cta1": "Inicia un proyecto",
      "c.hero.cta2": "Explora mi trabajo",

      /* ---- Consulting: service paths ---- */
      "c.s2.eyebrow": "En qué te ayudo",
      "c.s2.h2": "Tres maneras de empezar",
      "c.svc1.badge": "Listo para producción",
      "c.svc1.h3": "Sitios web",
      "c.svc1.p": "Sitios creíbles, rápidos y responsivos que hacen que tu negocio luzca profesional y que a tus clientes les resulte fácil contactarte. Estructura clara, apoyo honesto con los textos y SEO básico incluido.",
      "c.svc1.link": "Crea un sitio web →",
      "c.svc2.badge": "Primero el prototipo · desarrollo completo por consulta",
      "c.svc2.h3": "Apps móviles y web",
      "c.svc2.p": "Valida una idea con un prototipo navegable y un plan de implementación claro — o ve más allá con una app web instalable (PWA) que tus clientes agregan a su teléfono, con reservas, pagos y mensajería. Con enfoque de descubrimiento primero; desarrollos completos por consulta.",
      "c.svc2.link": "Valida una idea →",
      "c.svc3.badge": "Experimental · por consulta",
      "c.svc3.h3": "Juegos e interactivos",
      "c.svc3.p": "Pequeños juegos 2D para navegador y experiencias interactivas de marca — una mecánica, bien hecha. Actualmente se ofrece por consulta mientras se consolida el enfoque de entrega.",
      "c.svc3.link": "Pregunta por un prototipo →",

      /* ---- Consulting: work proof ---- */
      "c.s3.eyebrow": "Trabajo reciente",
      "c.s3.h2": "Una muestra del oficio",
      "c.s3.lead": "Un par de ejemplos relevantes, etiquetados con honestidad. Los proyectos empresariales de abajo se hicieron como diseñador empleado, no como encargos independientes.",
      "c.proof1.label": "Producto personal · pre-lanzamiento",
      "c.proof1.p": "Marca, pensamiento de producto e interfaz para una plataforma local de fitness/movimiento — del concepto al pre-lanzamiento.",
      "c.proof2.label": "Trabajo de empleo · Coca-Cola",
      "c.proof2.p": "Diseño de experiencia de comercio B2B a escala — investigación, flujos y un sistema de diseño compartido.",
      "c.s3.link": "Ver el índice completo →",

      /* ---- Consulting: starter packages ---- */
      "c.s4.eyebrow": "Paquetes iniciales",
      "c.s4.h2": "Alcance claro, precio claro",
      "c.s4.lead": "Precios iniciales para los primeros clientes piloto. Cada paquete es un alcance definido — la cotización final confirma inclusiones, tiempos y lo que quede fuera del límite. Los precios asumen marca/textos proporcionados y dos rondas de revisión consolidadas.",

      "c.pkg1.name": "Sesión de consultoría",
      "c.pkg1.meta": '<span class="pkg-start">Desde $350</span> · ~1 semana · una sesión de trabajo',
      "c.pkg1.li1": "Una sesión de trabajo de 60 minutos",
      "c.pkg1.li2": "Resumen escrito breve",
      "c.pkg1.li3": "Alcance priorizado",
      "c.pkg1.li4": "Siguiente paso recomendado",
      "c.pkg1.excl": "<b>No incluye:</b> diseño o desarrollo terminado.",
      "c.pkg1.btn": "Reserva una sesión",

      "c.pkg2.name": "Página de lanzamiento",
      "c.pkg2.meta": '<span class="pkg-start">Desde $950</span> · 2–3 semanas · 1 página',
      "c.pkg2.li1": "Una página responsiva, hasta 6 secciones",
      "c.pkg2.li2": "Un formulario de contacto o integración de reservas",
      "c.pkg2.li3": "SEO básico de la página",
      "c.pkg2.li4": "Dos rondas de revisión consolidadas",
      "c.pkg2.excl": "<b>No incluye:</b> motor de reservas a medida, ecommerce, redacción completa, diseño de identidad.",
      "c.pkg2.btn": "Crea una página de lanzamiento",

      "c.pkg3.name": "Sitio web para pequeñas empresas",
      "c.pkg3.meta": '<span class="pkg-start">Desde $2,250</span> · 4–6 semanas · hasta 5 páginas',
      "c.pkg3.li1": "Hasta 5 páginas, un sistema de diseño compartido",
      "c.pkg3.li2": "Un formulario + una integración de reservas",
      "c.pkg3.li3": "SEO básico y entrega ordenada",
      "c.pkg3.li4": "Dos rondas de revisión consolidadas",
      "c.pkg3.excl": "<b>No incluye:</b> inicio de sesión de miembros, CRM a medida, comercio, migración compleja.",
      "c.pkg3.btn": "Crea un sitio web",

      "c.pkg4.name": "Sprint de concepto móvil",
      "c.pkg4.meta": '<span class="pkg-start">Desde $1,500</span> · 2–4 semanas · prototipo navegable',
      "c.pkg4.li1": "Un flujo principal de usuario, hasta 8 pantallas",
      "c.pkg4.li2": "Prototipo navegable",
      "c.pkg4.li3": "Plan de implementación breve",
      "c.pkg4.li4": "Dos rondas de revisión consolidadas",
      "c.pkg4.excl": "<b>No incluye:</b> backend de producción, publicación nativa, envío a tiendas.",
      "c.pkg4.btn": "Inicia un sprint de concepto",

      "c.pkg5.name": "Prototipo de juego en navegador",
      "c.pkg5.meta": '<span class="pkg-start">Por consulta</span> · alcance según la idea · vía experimental',
      "c.pkg5.li1": "Una mecánica 2D, un nivel/modo",
      "c.pkg5.li2": "Inicio / juego / reinicio",
      "c.pkg5.li3": "Entrada de escritorio y táctil",
      "c.pkg5.li4": "Recursos proporcionados o con licencia",
      "c.pkg5.excl": "<b>No incluye:</b> multijugador, cuentas, pagos, arte 3D a medida, operaciones en vivo.",
      "c.pkg5.btn": "Pregunta por un prototipo",

      "c.s4.note": "Facturación: los proyectos normalmente son 50% al reservar y 50% al aceptar la entrega. Una ventana de 14 días posterior al lanzamiento cubre desviaciones del alcance aceptado. El hosting, los dominios, las fuentes/recursos de pago, las suscripciones y las tarifas de tiendas son aparte y se informan antes de la aprobación. Las apps nativas y los juegos de producción requieren un descubrimiento pagado y una cotización separada. Los términos finales del contrato se confirman por escrito antes de comenzar.",

      /* ---- Consulting: process ---- */
      "c.s5.eyebrow": "Cómo trabajamos",
      "c.s5.h2": "Cuatro pasos honestos",
      "c.step1.h3": "Alcance",
      "c.step1.p": "Una breve llamada de encaje y luego un alcance por escrito con entregables, exclusiones, criterios de aceptación, costo y fechas.",
      "c.step2.h3": "Desarrollo",
      "c.step2.p": "Estado semanal: qué está listo, qué sigue, decisiones necesarias y riesgos. La retroalimentación se consolida en los hitos.",
      "c.step3.h3": "Lanzamiento",
      "c.step3.p": "Lista de aceptación, despliegue y una entrega ordenada — tú eres dueño de tu dominio, cuentas y archivos.",
      "c.step4.h3": "Mejora",
      "c.step4.p": "Un backlog de oportunidades de 90 días y soporte mensual opcional, revisado contra un resultado acordado.",

      /* ---- Consulting: ongoing support ---- */
      "c.s6.eyebrow": "Soporte continuo opcional",
      "c.s6.h2": "Sigue mejorando, sin contratar a tiempo completo",
      "c.s6.lead": "Planes mensuales con un bloque fijo de tiempo reservado. Sin solicitudes ilimitadas, sin facturas sorpresa — una cola visible y una solicitud activa a la vez.",
      "c.plan1.name": "Cuidado",
      "c.plan1.hours": "1 hora incluida / mes",
      "c.plan1.p": "Revisiones de rutina y pequeñas solicitudes de contenido o correcciones, con un breve resumen mensual de actividad.",
      "c.plan2.name": "Mejora",
      "c.plan2.hours": "4 horas incluidas / mes",
      "c.plan2.p": "Mejoras priorizadas de diseño, desarrollo y contenido con una revisión mensual del progreso.",
      "c.plan3.name": "Socio",
      "c.plan3.hours": "8 horas incluidas / mes",
      "c.plan3.p": "Un backlog continuo más amplio, experimentos y reuniones dos veces al mes.",
      "c.s6.note": "Las solicitudes se confirman dentro de dos días hábiles (lun–vie, América/Chicago). La confirmación no es resolución — recibirás una estimación y un calendario tras la evaluación. Todas las revisiones, reportes, llamadas e implementación se descuentan del tiempo incluido; las horas no usadas vencen cada mes porque la capacidad está reservada. El trabajo adicional siempre se aprueba por escrito con una cotización primero — nunca se cobra automáticamente. Los planes se facturan mensualmente y se pueden cancelar antes de la siguiente renovación; nunca se requiere un retainer para conservar la propiedad de tu sitio.",

      /* ---- Consulting: why ---- */
      "c.s7.eyebrow": "Por qué trabajar conmigo",
      "c.s7.h2": "Trabajo con experiencia, directo",
      "c.why1.h3": "Trabajas conmigo",
      "c.why1.p": "Sin traspasos a un equipo junior. La persona que define tu proyecto es la misma que lo diseña y lo construye.",
      "c.why2.h3": "Más de 15 años de diseño de producto",
      "c.why2.p": "Trabajo basado en investigación en comercio, IoT y SaaS para equipos como Cisco, Coca-Cola y Verizon.",
      "c.why3.h3": "Hecho para medirse",
      "c.why3.p": "Acordamos un resultado y una línea base, y luego construimos hacia él — sin resultados inventados, sin métricas vanidosas.",

      /* ---- Consulting: FAQ ---- */
      "c.s8.eyebrow": "Bueno saberlo",
      "c.s8.h2": "Preguntas, respondidas",
      "c.faq1.q": "¿Quién es dueño del sitio web final y de las cuentas?",
      "c.faq1.a": "Tú. Eres dueño de tu dominio, hosting y cuentas de terceros, y conservas los archivos entregados. La propiedad nunca depende de seguir en un plan de soporte.",
      "c.faq2.q": "¿Qué costos son aparte de la tarifa del proyecto?",
      "c.faq2.a": "Hosting, registro de dominio, fuentes o recursos de pago, suscripciones de software, inversión en publicidad y cualquier tarifa de tienda/plataforma. Se informan y aprueban antes de comprar nada.",
      "c.faq3.q": "¿Cuánto tardan los proyectos?",
      "c.faq3.a": "Tiempos indicativos: una página de lanzamiento en 2–3 semanas, un sitio pequeño en 4–6 semanas, un sprint de concepto en 2–4 semanas — desde el arranque y la recepción de los materiales que necesito. Las fechas se confirman según la capacidad real antes de reservar.",
      "c.faq4.q": "¿Cómo funcionan las revisiones?",
      "c.faq4.a": "Cada proyecto incluye dos rondas de revisión consolidadas en los hitos acordados. Los cambios mayores o el nuevo alcance se cotizan por separado para que el tiempo y el precio sigan siendo honestos.",
      "c.faq5.q": "¿Cuál es la diferencia entre un prototipo y una app de producción?",
      "c.faq5.a": "Un sprint de concepto entrega un prototipo navegable y un plan — ideal para validar una idea o mostrarla a inversionistas. Una app de producción (backend real, publicación en tiendas) es un encargo separado y más grande que comienza con un descubrimiento pagado.",
      "c.faq6.q": "¿Cómo funciona el soporte continuo?",
      "c.faq6.a": "Planes mensuales opcionales que reservan un bloque fijo de tiempo para mejoras. Una solicitud activa a la vez, una cola visible y confirmación en dos días hábiles. Puedes cancelar antes de la siguiente renovación.",
      "c.faq7.q": "¿Puedo cancelar?",
      "c.faq7.a": "Sí. Los planes mensuales se pueden cancelar antes de la siguiente fecha de facturación, y los proyectos tienen hitos claros de reserva/entrega. Siempre te diré tu próxima fecha de facturación y cómo funciona la salida.",

      /* ---- Consulting: closing + contact band ---- */
      "c.s9.note": "También disponible como servicios separados y por etapas una vez que el sitio está en vivo: el SEO básico está incluido en cada desarrollo; los pilotos de SEO enfocado, medios pagados y contenido social se pueden cotizar individualmente — sin garantías de rendimiento ni de posicionamiento.",
      "c.cta.big": "Construye tu próxima jugada digital.",
      "c.cta.p": "Cuéntame sobre tu negocio y lo que intentas lograr. Te responderé dentro de dos días hábiles.",
      "c.cta.btn": "Inicia un proyecto",

      /* ---- Contact page ---- */
      "ct.eyebrow": "Contacto",
      "ct.h1": "Saluda.",
      "ct.lead": "Para vacantes, consultas de proyectos o una solicitud de portafolio comercial completo — con gusto te ayudo.",
      "ct.direct": "Directo",
      "ct.k.email": "Correo",
      "ct.k.phone": "Teléfono",
      "ct.k.portfolio": "Portafolio",
      "ct.note.h3": "Envía una nota",
      "ct.note.p": "Esto abre tu app de correo con los datos ya completados.",
      "ct.note.link": "Redactar un correo →",
      "ct.cta.big": "Construyamos algo que valga la pena medir.",

      /* ---- Start a project page ---- */
      "sp.eyebrow": "Inicia un proyecto",
      "sp.h1": "Dime<br />qué necesitas.",
      "sp.lead": "Unas preguntas rápidas para entender el encaje. Sin presión, sin inscripción automática — te responderé dentro de dos días hábiles.",
      "sp.success.h2": "Gracias — recibido.",
      "sp.success.p": 'Tu consulta está registrada. La revisaré y te responderé dentro de dos días hábiles. Si es urgente, escribe a <a href="mailto:dickersoam@gmail.com">dickersoam@gmail.com</a>.',
      "sp.success.back": "Volver al trabajo",
      "sp.err.title": "Corrige lo siguiente:",
      "sp.lbl.name": 'Tu nombre <span class="req">*</span>',
      "sp.lbl.email": 'Correo <span class="req">*</span>',
      "sp.lbl.business": 'Empresa o proyecto <span class="req">*</span>',
      "sp.ph.business": "p. ej. Houston Strength Co. — un gimnasio que necesita un sitio nuevo",
      "sp.lbl.service": '¿Qué necesitas? <span class="req">*</span>',
      "sp.opt.select": "Selecciona una…",
      "sp.opt.website": "Sitio web",
      "sp.opt.mobile": "Concepto de app móvil (prototipo)",
      "sp.opt.game": "Juego / interactivo (por consulta)",
      "sp.opt.clarity": "Sesión de consultoría",
      "sp.opt.support": "Soporte continuo",
      "sp.opt.other": "Algo más",
      "sp.lbl.budget": 'Rango de presupuesto <span class="req">*</span>',
      "sp.opt.budget.notsure": "Aún no estoy seguro",
      "sp.opt.budget.under1k": "Menos de $1,000",
      "sp.opt.budget.1k": "$1,000 – $2,500",
      "sp.opt.budget.2_5k": "$2,500 – $5,000",
      "sp.opt.budget.5k": "$5,000+",
      "sp.lbl.goal": '¿Cuál es el objetivo? <span class="req">*</span>',
      "sp.ph.goal": "¿Qué debería lograr esto para tu negocio? p. ej. 'que sea fácil para los clientes reservar una clase.'",
      "sp.lbl.timing": "Tiempo preferido",
      "sp.opt.timing.none": "Sin preferencia marcada",
      "sp.opt.timing.asap": "Dentro de un mes",
      "sp.opt.timing.1_3": "1 – 3 meses",
      "sp.opt.timing.3plus": "3+ meses",
      "sp.opt.timing.exploring": "Solo explorando",
      "sp.lbl.website": "Sitio web actual (opcional)",
      "sp.consent": "Envíame de vez en cuando novedades útiles (opcional — está bien dejarlo sin marcar).",
      "sp.note": "Tus datos se usan solo para responder a tu consulta — nunca se venden ni se comparten. Por favor no incluyas contraseñas, datos de pago ni archivos confidenciales en este formulario.",
      "sp.submit": "Enviar consulta",

      /* ---- Form JS messages (consulting.js) ---- */
      "ferr.name": "Por favor ingresa tu nombre.",
      "ferr.email": "Por favor ingresa un correo válido.",
      "ferr.business": "Dime el nombre del negocio o proyecto.",
      "ferr.service": "Elige en qué necesitas ayuda.",
      "ferr.budget": "Elige un rango de presupuesto ('no estoy seguro' está bien).",
      "ferr.goal": "Una frase sobre el objetivo ayuda mucho.",
      "fstat.sending": "Enviando…",
      "fstat.notready": "El formulario aún no está conectado a su bandeja — escribe a dickersoam@gmail.com por ahora.",
      "fstat.fail": "Algo salió mal al enviar eso. Tus respuestas siguen aquí — inténtalo de nuevo o escribe a dickersoam@gmail.com.",

      /* ---- Mascot / buddy (site.js) ---- */
      "buddy.consulting": "¿Pensando en un proyecto? Así trabajaríamos juntos.",
      "buddy.contact": "Construyamos algo. Salúdame 👋",
      "buddy.scroll": "¿Te gusta lo que ves? <b>Hablemos</b>.",
      "buddy.hover.generic": "Echa un vistazo →",
      "buddy.tip1": "Basado en investigación, entregado con intención.",
      "buddy.tip2": "Toca cualquier proyecto — yo te señalo el camino.",
      "buddy.tip3": "El modo oscuro está arriba a la derecha si lo prefieres cómodo.",
      "buddy.tip4": "Una década de diseño de producto, contada con honestidad.",
      "buddy.tip5": "Desliza el carrusel o abre el índice arriba.",
      "buddy.click1": "Ese soy yo. Me alegra que estés aquí.",
      "buddy.click2": "Mira el caso Commerce on Mobile — es mi favorito.",
      "buddy.click3": "¿Preguntas? La página de contacto está a un toque.",
      "buddy.click4": "Gracias por explorar 🙏"
    }
  };

  // Lookup used by other scripts (site.js, consulting.js). Returns the Spanish
  // string when the active language is Spanish and a key exists; otherwise null
  // so callers fall back to their inline English default.
  window.i18nText = function (key) {
    if (window.AD_LANG === "es" && DICT.es && DICT.es[key] != null) return DICT.es[key];
    return null;
  };

  // Cache each element's original (English) content the first time we see it.
  var cache = typeof WeakMap === "function" ? new WeakMap() : null;
  function original(el) {
    if (cache && cache.has(el)) return cache.get(el);
    var o = {
      text: el.textContent,
      html: el.innerHTML,
      ph: el.getAttribute("placeholder"),
      aria: el.getAttribute("aria-label")
    };
    if (cache) cache.set(el, o);
    return o;
  }

  function translate(lng) {
    var d = DICT[lng] || {};
    var es = lng !== "en";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var o = original(el), k = el.getAttribute("data-i18n");
      el.textContent = (es && d[k] != null) ? d[k] : o.text;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var o = original(el), k = el.getAttribute("data-i18n-html");
      el.innerHTML = (es && d[k] != null) ? d[k] : o.html;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var o = original(el), k = el.getAttribute("data-i18n-ph");
      el.setAttribute("placeholder", (es && d[k] != null) ? d[k] : (o.ph || ""));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var o = original(el), k = el.getAttribute("data-i18n-aria");
      el.setAttribute("aria-label", (es && d[k] != null) ? d[k] : (o.aria || ""));
    });

    document.documentElement.setAttribute("lang", lng);
  }

  function reflectToggle(lng) {
    document.querySelectorAll(".lang-opt").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lng;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.classList.toggle("is-active", on);
    });
  }

  function setLang(lng) {
    if (SUPPORTED.indexOf(lng) === -1) lng = "en";
    window.AD_LANG = lng;
    try { localStorage.setItem(STORE_KEY, lng); } catch (e) {}
    translate(lng);
    reflectToggle(lng);
    try {
      var u = new URL(location.href);
      if (lng === "en") u.searchParams.delete("lang");
      else u.searchParams.set("lang", lng);
      history.replaceState(null, "", u);
    } catch (e) {}
    // Let other scripts (mascot) refresh their copy.
    try { document.dispatchEvent(new CustomEvent("ad:langchange", { detail: { lang: lng } })); } catch (e) {}
  }
  window.setLang = setLang;

  function wire() {
    document.querySelectorAll(".lang-opt").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });
    translate(current);
    reflectToggle(current);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
