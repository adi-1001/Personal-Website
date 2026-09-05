const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzAZYk7L7IHpOU0p7YqOU7FEp0KecloeHcgtD-AiHj0c-o69zSg-uYRd5aBQ-QNLB-fBQ/exec';

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const submitButton = document.getElementById('submit-btn');
  const buttonText = document.getElementById('btn-text');
  const formFeedback = document.getElementById('form-feedback');

  if (!contactForm) return;

  const showFeedback = (message, isSuccess = true) => {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback show p-3 text-xs font-mono border ${
      isSuccess
        ? 'border-lime/40 bg-lime/10 text-lime'
        : 'border-rust/40 bg-rust/10 text-rust'
    }`;

    setTimeout(() => {
      formFeedback.classList.remove('show');
    }, 6000);
  };

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const messageInput = document.getElementById('user-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !message) {
      showFeedback('Please fill in both your name and message.', false);
      return;
    }

    submitButton.disabled = true;
    const originalText = buttonText.textContent;
    buttonText.textContent = 'Sending...';

    const payload = {
      name,
      email: email || 'Not provided',
      message,
      timestamp: new Date().toISOString()
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      submitButton.disabled = false;
      buttonText.textContent = 'Message Sent! ✓';
      showFeedback('Thank you! Your message has been saved.', true);
      contactForm.reset();

      setTimeout(() => {
        buttonText.textContent = originalText;
      }, 3500);

    } catch (error) {
      submitButton.disabled = false;
      buttonText.textContent = originalText;
      showFeedback('Could not send message right now. Please try again or reach out on GitHub.', false);
    }
  });
});
