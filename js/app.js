// app.js - bezpieczna wersja dla statycznej strony
document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('language');

    if (languageSelect) {
        languageSelect.addEventListener("change", function (e) {
            const lang = e.target.value;
            if (lang === 'pl') {
                window.location.href = '/';
            } else {
                alert('Wersja językowa ' + lang.toUpperCase() + ' jest jeszcze w przygotowaniu 🚧');
            }
        });
    }
});
