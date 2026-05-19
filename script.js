   function toggleNav() {
      document.getElementById('navLinks').classList.toggle('open');
    }

    // Sidebar active link highlight on scroll
    const sections = document.querySelectorAll('[id]');
    const sideLinks = document.querySelectorAll('aside a');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
      });
      sideLinks.forEach(a => {
        a.parentElement.classList.toggle('active-item', a.getAttribute('href') === '#' + current);
      });
    });