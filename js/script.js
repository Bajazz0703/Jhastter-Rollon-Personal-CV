document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Reload Intro Screen Animation ---
    const introScreen = document.getElementById('intro-screen');
    const introContent = document.getElementById('intro-content');
    const introProgressBar = document.getElementById('intro-progress-bar');
    let introFinished = false;

    function finishIntro() {
        if (introFinished) return;
        introFinished = true;

        if (introScreen) {
            introScreen.classList.add('intro-hidden');
            setTimeout(() => {
                introScreen.style.display = 'none';
                document.body.classList.remove('intro-active');
            }, 500);
        } else {
            document.body.classList.remove('intro-active');
        }

        // Start typing animation once the intro finishes
        startTyping();
    }

    function runIntroSequence() {
        if (!introScreen || !introContent) {
            document.body.classList.remove('intro-active');
            startTyping();
            return;
        }

        introFinished = false;
        introScreen.style.display = 'flex';
        introScreen.classList.remove('intro-hidden');
        introContent.classList.remove('is-open');
        document.body.classList.add('intro-active');

        if (introProgressBar) {
            introProgressBar.style.transition = 'none';
            introProgressBar.style.width = '0%';
            void introProgressBar.offsetWidth; // trigger reflow
            introProgressBar.style.transition = 'width 1.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
            setTimeout(() => {
                introProgressBar.style.width = '100%';
            }, 50);
        }

        // Phase 2: Exactly 1 second delay before opening logo to reveal "Jhastter Rollon Personal CV"
        setTimeout(() => {
            if (!introFinished) {
                introContent.classList.add('is-open');
            }
        }, 1000);

        // Phase 3: Transition out to portfolio
        setTimeout(() => {
            finishIntro();
        }, 2300);
    }

    // Expose replay function for manual testing in console: replayIntro()
    window.replayIntro = runIntroSequence;

    // Start intro sequence on reload
    runIntroSequence();

    // Click to skip intro
    if (introScreen) {
        introScreen.addEventListener('click', () => {
            finishIntro();
        });
    }

    // Key to skip intro
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
            if (!introFinished) {
                finishIntro();
            }
        }
    });

    // --- 1. Typing Animation ---
    const typingElement = document.getElementById('typing-text');
    let typingStarted = false;

    function startTyping() {
        if (typingStarted || !typingElement) return;
        typingStarted = true;

        const words = JSON.parse(typingElement.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before typing next word
            }

            setTimeout(type, typingSpeed);
        }

        setTimeout(type, 300);
    }

    // --- 2. Skills Category Data & Logic ---
    const skillsData = {
        languages: [
            { name: 'Python', level: 90, icon: 'fa-brands fa-python' },
            { name: 'JavaScript', level: 85, icon: 'fa-brands fa-js' },
            { name: 'Java', level: 70, icon: 'fa-brands fa-java' },
            { name: 'HTML & CSS', level: 90, icon: 'fa-brands fa-html5' }
        ],
        frontend: [
            { name: 'React + Next.js', level: 85, icon: 'fa-brands fa-react' },
            { name: 'Vite', level: 80, icon: 'fa-solid fa-bolt' },
            { name: 'TailwindCSS', level: 90, icon: 'fa-brands fa-css3-alt' },
        ],
        backend: [
            { name: 'Node.js + Express', level: 85, icon: 'fa-brands fa-node-js' },
            { name: 'Flask / Python Backend', level: 80, icon: 'fa-solid fa-cube' },
            { name: 'PostgreSQL', level: 80, icon: 'fa-solid fa-database' },
            { name: 'REST APIs', level: 90, icon: 'fa-solid fa-gears' },
        ],
        design: [
            { name: 'Figma', level: 90, icon: 'fa-brands fa-figma' },
            { name: 'Adobe Photoshop', level: 80, icon: 'fa-solid fa-image' },
            { name: 'Adobe Illustrator', level: 75, icon: 'fa-solid fa-bezier-curve' },
            { name: 'Canva', level: 95, icon: 'fa-solid fa-wand-magic-sparkles' },
            { name: 'Github', level: 95, icon: 'fa-brands fa-github' }
        ],
        professional: [
            { name: 'Problem Solving', level: 90, icon: 'fa-solid fa-puzzle-piece' },
            { name: 'Communication', level: 85, icon: 'fa-solid fa-comments' },
            { name: 'Teamwork', level: 95, icon: 'fa-solid fa-handshake' },
            { name: 'Time Management', level: 85, icon: 'fa-solid fa-clock' },
            { name: 'UI/UX Design', level: 90, icon: 'fa-solid fa-palette' },
            { name: 'Fast Learner', level: 95, icon: 'fa-solid fa-bolt' }
        ]
    };

    const skillsGrid = document.getElementById('skills-grid');
    const tabButtons = document.querySelectorAll('.tab-btn');

    function renderSkills(category) {
        if (!skillsGrid) return;

        // Clear grid
        skillsGrid.innerHTML = '';

        // Populate items
        const skills = skillsData[category] || [];
        skills.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'glass skill-card';
            card.innerHTML = `
                <div class="skill-icon-wrapper">
                    <i class="${skill.icon}"></i>
                </div>
                <div class="skill-info">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-level-bar">
                        <div class="skill-level-fill" style="width: 0%"></div>
                    </div>
                </div>
            `;
            skillsGrid.appendChild(card);

            // Trigger transition after render
            setTimeout(() => {
                const fill = card.querySelector('.skill-level-fill');
                if (fill) fill.style.width = `${skill.level}%`;
            }, 50);
        });
    }

    // Tab buttons event listeners
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');
            // Render category
            const category = btn.getAttribute('data-category');
            renderSkills(category);
        });
    });

    // Initial render
    renderSkills('languages');

    // --- 3. Scroll Reveal (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once shown to prevent repeat animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. Navigation Highlighting and Sticky Effect ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav a');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY;

        // Sticky nav shadow
        if (navbar) {
            if (scrollPos > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Highlight nav links
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 4.5 Theme Toggle (Dark / Light) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('portfolio-theme');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (document.body) {
            document.body.classList.toggle('light-theme', theme === 'light');
        }
        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('i');
            if (icon) {
                icon.style.transform = theme === 'light' ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }
    }

    if (savedTheme) {
        applyTheme(savedTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(nextTheme);
            localStorage.setItem('portfolio-theme', nextTheme);
        });
    }

    window.toggleTheme = function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
        localStorage.setItem('portfolio-theme', nextTheme);
        return nextTheme;
    };

    // --- 5. Mobile Navigation Menu ---
    const menuToggle = document.getElementById('menu-toggle');
    const navbarNav = document.getElementById('navbar-nav');

    if (menuToggle && navbarNav) {
        menuToggle.addEventListener('click', () => {
            navbarNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navbarNav.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbarNav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    // --- 6. Quick Toast & Email Action Helper ---
    function showToast(message, icon = 'fa-solid fa-circle-check') {
        let toast = document.querySelector('.contact-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'contact-toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    const emailContactLink = document.querySelector('.email-contact-link');
    if (emailContactLink) {
        emailContactLink.addEventListener('click', () => {
            const email = emailContactLink.getAttribute('data-email') || 'jhastterrollon2003@gmail.com';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast('Email copied to clipboard! Opening Gmail...');
                }).catch(() => {
                    showToast('Opening Gmail compose...');
                });
            } else {
                showToast('Opening Gmail compose...');
            }
        });
    }

    // --- 7. Certificate Image Lightbox Modal ---
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('modal-caption');
    const closeBtn = document.querySelector('.modal-close');
    const awardImages = document.querySelectorAll('.timeline-image');

    if (modal && modalImg && closeBtn) {
        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore body scrolling
        };

        awardImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                modal.style.display = 'block';
                modal.scrollTop = 0; // Reset modal scroll position to top
                document.body.style.overflow = 'hidden'; // Disable body scrolling background
                modalImg.src = img.src;
                captionText.textContent = img.alt || 'Certificate';
            });
        });

        // Close when clicking Close (X) button
        closeBtn.addEventListener('click', closeModal);

        // Close when clicking outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close when hitting ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    }
});
