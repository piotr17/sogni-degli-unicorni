// Menu hamburger mobile
document.addEventListener('DOMContentLoaded', function() {
  const burgerMenu = document.querySelector('.burger-menu');
  const navbar = document.querySelector('.navbar');
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuLinks = document.querySelectorAll('.navbar a');

  if (!burgerMenu || !navbar || !menuOverlay) return;

  // Toggle menu
  function toggleMenu() {
    const isExpanded = burgerMenu.getAttribute('aria-expanded') === 'true';
    
    burgerMenu.setAttribute('aria-expanded', !isExpanded);
    navbar.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    
    // Previeni scroll del body quando il menu è aperto
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  }

  // Chiudi menu
  function closeMenu() {
    burgerMenu.setAttribute('aria-expanded', 'false');
    navbar.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  burgerMenu.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', closeMenu);

  // Chiudi menu quando si clicca su un link
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Chiudi menu con ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navbar.classList.contains('active')) {
      closeMenu();
    }
  });

  // Chiudi menu quando si ridimensiona la finestra
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && navbar.classList.contains('active')) {
      closeMenu();
    }
  });
});