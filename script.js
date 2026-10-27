// Handoff site script: footer year, Web3Forms lead forms and Google Analytics (GA4) events.
// Forms also work without JavaScript; this keeps visitors on the page and records conversions.
(function () {
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  function track(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
  }

  // --- Attribution: remember campaign tags and the landing page for this visit,
  // so they ride along with the form even if the visitor moves between pages.
  var UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var attrib = {};
  try { attrib = JSON.parse(sessionStorage.getItem('handoff_attrib') || '{}'); } catch (e) {}
  var qs = new URLSearchParams(location.search);
  if (UTM.some(function (k) { return qs.get(k); })) {
    UTM.forEach(function (k) { if (qs.get(k)) attrib[k] = qs.get(k); });
  }
  if (!attrib.landing_page) {
    attrib.landing_page = location.pathname;
    attrib.referrer = document.referrer || '(direct)';
  }
  try { sessionStorage.setItem('handoff_attrib', JSON.stringify(attrib)); } catch (e) {}

  // --- CTA clicks: any element with data-cta="where-it-is".
  // data-interest="..." also preselects the form's "Interested in" field.
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-cta]');
    if (!el) return;
    track('cta_click', { cta_location: el.dataset.cta, link_url: el.getAttribute('href') || '' });
    if (el.dataset.interest) {
      var target = document.querySelector(el.getAttribute('href')) || document;
      var sel = target.querySelector('select[name="interest"]') || document.querySelector('form.js-lead select[name="interest"]');
      if (sel) sel.value = el.dataset.interest;
    }
  });

  // --- Lead forms: <form class="js-lead" data-form-id="..." data-success="...">
  document.querySelectorAll('form.js-lead').forEach(function (form) {
    var formId = form.dataset.formId || form.id || 'form';
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    var label = button.textContent;
    var started = false;

    Object.keys(attrib).forEach(function (k) {
      var input = document.createElement('input');
      input.type = 'hidden'; input.name = k; input.value = attrib[k];
      form.appendChild(input);
    });

    form.addEventListener('focusin', function () {
      if (started) return;
      started = true;
      track('lead_form_start', { form_id: formId });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      button.disabled = true;
      button.textContent = 'Sending…';
      status.className = 'form-status';
      status.textContent = '';
      var data = new FormData(form);
      try {
        var res = await fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: data });
        var json = await res.json();
        if (!(res.ok && json.success)) throw new Error(json.message || 'Something went wrong.');
        track('generate_lead', {
          form_id: formId,
          interest: data.get('interest') || '',
          stage: data.get('stage') || ''
        });
        form.reset();
        status.className = 'form-status ok';
        status.textContent = form.dataset.success || "Thanks! Your message is on its way.";
      } catch (err) {
        track('lead_form_error', { form_id: formId });
        status.className = 'form-status err';
        status.textContent = "Sorry, that didn't send. Please try again, or email hello@handoffcoaching.com.";
      } finally {
        button.disabled = false;
        button.textContent = label;
      }
    });
  });

  // --- Landing page: the header and mobile "Request a 30-minute review" buttons only show
  // while neither lead form is on screen (they just jump to the form).
  var forms = document.querySelectorAll('form.js-lead');
  var jumpers = document.querySelectorAll('.lp-jump');
  if (jumpers.length && forms.length && 'IntersectionObserver' in window) {
    var onScreen = new Set();
    var setVisible = function (show) {
      jumpers.forEach(function (el) {
        el.classList.toggle('show', show);
        el.setAttribute('aria-hidden', show ? 'false' : 'true');
        var link = el.matches('a') ? el : el.querySelector('a');
        if (link) link.tabIndex = show ? 0 : -1;
      });
    };
    setVisible(false);
    var io = new IntersectionObserver(function (entries) {
      // A form counts as on screen once a real part of it is visible, not a sliver at the edge.
      entries.forEach(function (en) { en.intersectionRect.height >= 160 ? onScreen.add(en.target) : onScreen.delete(en.target); });
      setVisible(onScreen.size === 0);
    }, { threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5, 0.75, 1] });
    forms.forEach(function (f) { io.observe(f); });
  }
})();
