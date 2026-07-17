(() => {
  const endpoint = "https://formspree.io/f/xlgqjyov";

  function prepareForm(form) {
    if (form.dataset.formspreeReady) return;
    form.dataset.formspreeReady = "true";
    form.action = endpoint;
    form.method = "post";
    form.removeAttribute("enctype");

    let status = form.querySelector(".form-note");
    if (!status) {
      status = document.createElement("p");
      status.className = "form-note";
      form.appendChild(status);
    }
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.textContent = "Your inquiry will be submitted securely to the United Milling team.";
  }

  function prepareAll() {
    document.querySelectorAll(".inquiry-form").forEach(prepareForm);
  }

  document.addEventListener("DOMContentLoaded", prepareAll);
  new MutationObserver(prepareAll).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  document.addEventListener("submit", async (event) => {
    const form = event.target.closest?.(".inquiry-form");
    if (!form) return;

    event.preventDefault();
    prepareForm(form);

    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector(".form-note");
    const originalLabel = button?.textContent || "Send inquiry";

    if (button) {
      button.disabled = true;
      button.textContent = "Sending…";
    }
    status.textContent = "Sending your inquiry…";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Submission failed");

      form.reset();
      status.textContent = "Thank you. Your inquiry has been sent to United Milling.";
    } catch {
      status.textContent = "We could not send your inquiry. Please try again.";
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    }
  }, true);
})();