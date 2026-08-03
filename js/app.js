// app.js - bezpieczna wersja dla statycznej strony
document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('language');
    const KNOWN_LANGS = ['en', 'de', 'fr'];
    const CONTACT_EMAIL = 'kontakt@code4all.eu';

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const lang = document.documentElement.lang || 'pl';
        const subjectPrefix = {
            pl: 'Wiadomość ze strony od ',
            en: 'Website message from ',
            de: 'Nachricht von der Website von ',
            fr: 'Message du site de '
        }[lang] || 'Wiadomość ze strony od ';
        const fromLabel = { pl: 'Od', en: 'From', de: 'Von', fr: 'De' }[lang] || 'Od';

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = contactForm.elements['name'].value;
            const email = contactForm.elements['email'].value;
            const message = contactForm.elements['message'].value;

            const subject = encodeURIComponent(subjectPrefix + name);
            const body = encodeURIComponent(message + '\n\n---\n' + fromLabel + ': ' + name + ' (' + email + ')');
            window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
        });
    }

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
