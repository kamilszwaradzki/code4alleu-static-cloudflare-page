// app.js - bezpieczna wersja dla statycznej strony
document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('language');
    const KNOWN_LANGS = ['en', 'de', 'fr'];
    const CONTACT_EMAIL = 'kontakt@code4all.eu';

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const lang = document.documentElement.lang || 'pl';
        const WEB3FORMS_KEY = '9b846071-f385-40d6-ad13-e2edd56564d3';
        const subjectPrefix = {
            pl: 'Wiadomość ze strony od ',
            en: 'Website message from ',
            de: 'Nachricht von der Website von ',
            fr: 'Message du site de '
        }[lang] || 'Wiadomość ze strony od ';
        const t = {
            sending: { pl: 'Wysyłanie...', en: 'Sending...', de: 'Wird gesendet...', fr: 'Envoi...' },
            success: {
                pl: 'Dziękuję! Wiadomość została wysłana, odezwę się wkrótce.',
                en: 'Thank you! Your message has been sent — I will get back to you soon.',
                de: 'Danke! Deine Nachricht wurde gesendet — ich melde mich bald.',
                fr: "Merci ! Votre message a été envoyé — je vous répondrai bientôt."
            },
            error: {
                pl: 'Coś poszło nie tak. Spróbuj ponownie lub napisz bezpośrednio na ',
                en: 'Something went wrong. Please try again or email directly at ',
                de: 'Etwas ist schiefgelaufen. Bitte versuche es erneut oder schreibe direkt an ',
                fr: "Une erreur s'est produite. Réessayez ou écrivez directement à "
            }
        };
        const statusEl = document.getElementById('form-status');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const submitBtnOriginalText = submitBtn ? submitBtn.innerHTML : '';

        function showStatus(text, type) {
            if (!statusEl) return;
            statusEl.className = 'mt-3 alert alert-' + type;
            statusEl.textContent = text;
        }

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const botcheck = contactForm.elements['botcheck'];
            if (botcheck && botcheck.checked) return;

            const name = contactForm.elements['name'].value;
            const email = contactForm.elements['email'].value;
            const message = contactForm.elements['message'].value;

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = t.sending[lang] || t.sending.pl;
            }

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    subject: subjectPrefix + name,
                    name: name,
                    email: email,
                    message: message
                })
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (data.success) {
                        showStatus(t.success[lang] || t.success.pl, 'success');
                        contactForm.reset();
                    } else {
                        throw new Error(data.message || 'error');
                    }
                })
                .catch(function () {
                    showStatus((t.error[lang] || t.error.pl) + CONTACT_EMAIL, 'danger');
                })
                .finally(function () {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = submitBtnOriginalText;
                    }
                });
        });
    }

    document.querySelectorAll('.phone-reveal-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const phone = btn.dataset.tel.split('').reverse().join('');
            const link = document.createElement('a');
            link.href = 'tel:' + phone.replace(/\s/g, '');
            link.textContent = phone;
            link.className = btn.className.replace('phone-reveal-btn', '').trim();
            link.style.color = 'var(--accent)';
            btn.replaceWith(link);
        });
    });

    if (languageSelect) {
        languageSelect.addEventListener("change", function (e) {
            const targetLang = e.target.value;
            const parts = window.location.pathname.split('/').filter(Boolean);

            let file = 'index.html';
            if (parts.length === 0) {
                file = 'index.html';
            } else if (KNOWN_LANGS.includes(parts[0])) {
                file = parts[1] || 'index.html';
            } else {
                file = parts[0];
            }

            const url = targetLang === 'pl' ? '/' + file : '/' + targetLang + '/' + file;
            window.location.href = url === '/index.html' ? '/' : url;
        });
    }
});
