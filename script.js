// Handoff: contact form (Web3Forms) + footer year.
// The form also works without JavaScript; this just keeps visitors on the page.
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contact-form');
const status = form.querySelector('.form-status');
const button = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (form.access_key.value.includes('YOUR_ACCESS_KEY')) {
    status.className = 'form-status err';
    status.textContent = 'Site owner: add your Web3Forms access key to index.html (see README).';
    return;
  }
  button.disabled = true;
  button.textContent = 'Sending…';
  status.className = 'form-status';
  status.textContent = '';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      form.reset();
      status.className = 'form-status ok';
      status.textContent = "Thanks! Your message is on its way. I'll reply within one business day.";
    } else {
      throw new Error(data.message || 'Something went wrong.');
    }
  } catch (err) {
    status.className = 'form-status err';
    status.textContent = "Sorry, that didn't send. Please try again in a moment.";
  } finally {
    button.disabled = false;
    button.textContent = 'Send message';
  }
});
