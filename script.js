    document.addEventListener('DOMContentLoaded', () => {
        const navToggle = document.querySelector('.nav__toggle');
        const navLinksContainer = document.querySelector('.nav__links');
        if (navToggle && navLinksContainer) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navLinksContainer.classList.toggle('nav__links--open');
                navToggle.querySelector('i').classList.toggle('bi-list');
                navToggle.querySelector('i').classList.toggle('bi-x');
            });
        }
        
        
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        
        const headerElement = document.querySelector('.site-header');
        const headerHeight = headerElement ? headerElement.clientHeight : 70;
        const navLinksElements = document.querySelectorAll('.nav__links a');
        const sections = document.querySelectorAll('main section[id]');

        window.addEventListener('scroll', () => {
            const homeSection = document.getElementById('home');
            const halfway = homeSection ? homeSection.offsetTop + homeSection.offsetHeight / 3 : 300;
            
            navLinksElements.forEach(link => {
                if (window.scrollY > halfway) { 
                    link.classList.add('icon-mode');
                } else {
                    link.classList.remove('icon-mode');
                }
            });

            let currentSectionId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - (headerHeight + 50);
                if (window.scrollY >= sectionTop) {
                    currentSectionId = section.id;
                }
            });

            navLinksElements.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }, { passive: true });

        
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    });