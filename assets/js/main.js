// Sayfanın en üstüne yumuşak geçiş ile scroll yapma
const footerBtn = document.querySelector('.footer-btn');
footerBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Dropdown menüyü aç/kapat
function toggleDropdown(id) {
    var element = document.getElementById(id);
    element.classList.toggle('show');
}

// Mobil menüyü aç/kapat
function toggleMobileMenu() {
    var mobileNav = document.getElementById('mobile-nav');
    var burger = document.getElementById("burger");

    // Mobile menüyü aç/kapat
    mobileNav.classList.toggle('show');

    // Burger butonuna active sınıfını toggle yap (açık/kapalı)
    burger.classList.toggle("active");

    // Mobil menü açıldığında sayfa scroll'unu engelle
    if (mobileNav.classList.contains('show')) {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }
}
