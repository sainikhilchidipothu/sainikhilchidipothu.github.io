
    document.addEventListener('DOMContentLoaded', () => {
        const skillItems = document.querySelectorAll('.skill-grid-item');
        const projectCards = document.querySelectorAll('.project-card');
        let activeFilters = [];

        function filterProjects() {
            if (activeFilters.length === 0) {
                projectCards.forEach(card => card.classList.remove('is-filtered'));
                return;
            }

            projectCards.forEach(card => {
                const projectSkills = card.dataset.skills.split(' ');
                const matches = activeFilters.every(filter => projectSkills.includes(filter));
                if (matches) {
                    card.classList.remove('is-filtered');
                } else {
                    card.classList.add('is-filtered');
                }
            });
        }

        skillItems.forEach(item => {
            item.addEventListener('click', () => {
                const skill = item.dataset.skill;
                item.classList.toggle('active');
                
                if (item.classList.contains('active')) {
                    activeFilters.push(skill);
                } else {
                    activeFilters = activeFilters.filter(f => f !== skill);
                }
                filterProjects();
            });
        });

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
        }, { rootMargin: '0px', threshold: 0.1 });
        animatedElements.forEach(el => { observer.observe(el); });

        /* === NEW TERMINAL LOGIC === */
        const terminal = document.getElementById('terminal');
        const terminalBody = document.getElementById('terminalBody');
        const terminalInput = document.getElementById('terminalInput');
        const terminalCloseBtn = document.getElementById('terminalCloseBtn');
        const terminalFab = document.getElementById('terminalFab');

        let isTyping = false;
        let currentPrompt;

        const toggleTerminal = () => {
            const isOpen = terminal.classList.toggle('terminal--open');
            terminalFab.classList.toggle('terminal-fab--hidden', isOpen);
            document.body.classList.toggle('terminal-open-no-scroll', isOpen);
            /* === FIX 2: Auto-focus the input after the animation completes === */
            if (isOpen) {
                setTimeout(() => terminalInput.focus(), 400);
            }
        };

        const createNewPromptLine = () => {
            const p = document.createElement('p');
            p.innerHTML = `<span style="color:var(--heading-text-color); font-weight:bold;">&gt;</span> <span class="command-line"></span><span class="blinking-cursor"></span>`;
            terminalBody.appendChild(p);
            currentPrompt = p;
            terminalBody.scrollTop = terminalBody.scrollHeight;
        };
        
        function typeWriter(outputHTML, callback) {
            isTyping = true;

            const outputWrapper = document.createElement('div');
            outputWrapper.innerHTML = outputHTML;
            terminalBody.appendChild(outputWrapper);

            const typingQueue = [];
            const walker = document.createTreeWalker(outputWrapper, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while(node = walker.nextNode()) {
                if(node.textContent.trim() !== '') {
                    typingQueue.push({
                        element: node,
                        text: node.textContent,
                        speed: 8
                    });
                    node.textContent = '';
                }
            }

            function processQueue() {
                if (typingQueue.length === 0) {
                    isTyping = false;
                    if(callback) callback();
                    return;
                }

                const item = typingQueue.shift();
                let i = 0;
                const timer = setInterval(() => {
                    if (i < item.text.length) {
                        item.element.textContent += item.text.charAt(i);
                        i++;
                        terminalBody.scrollTop = terminalBody.scrollHeight;
                    } else {
                        clearInterval(timer);
                        processQueue();
                    }
                }, item.speed);
            }
            processQueue();
        }

        const processCommand = (cmd) => {
            let output = '';
            switch (cmd.toLowerCase()) {
                case 'help':
                    output = `<pre class="command-output">
      help      - Displays this list of commands.
      whoami    - Shows a brief summary about me.
      projects  - Lists my featured projects with details.
      skills    - Displays a categorized list of my technical skills.
      contact   - Provides my contact information.
      clear     - Clears the terminal screen.
      close     - Closes this terminal.
    </pre>`;
                    break;
                case 'whoami':
                    output = `<p><strong>// Accessing records for user: Sai Nikhil Chidipothu...</strong></p>
    <p><strong>Status:</strong> Graduate CS Student @ <span class="ucf-gold">University of Central Florida (UCF)</span>.</p>
    <br>
    <p>I believe the best software is a bridge between complex data and human intuition. My focus is on building that bridge. I'm fascinated by how machine learning can uncover hidden patterns, and I'm driven to build the high-performance applications that bring those insights to life.</p>
    <p>Currently, I'm honing my skills as a Graduate Teaching Assistant, mentoring the next wave of developers while deepening my own expertise.</p>`;
                    break;
                case 'projects':
                    let projectHTML = '<h4>// Querying project database... 3 entries found.</h4>';
                    document.querySelectorAll('.project-card').forEach(p => {
                        const title = p.querySelector('h4').textContent;
                        const link = p.querySelector('.project-card__link-button[href*="github.com"]')?.href;

                        projectHTML += `<br><p><strong>// Project: ${title}</strong></p>`;
                        if (title.includes('SkyEye')) {
                             projectHTML += `<p><strong>Challenge:</strong> Fine-tuning a YOLOv8 model for real-time performance on high-resolution drone imagery. The key was balancing accuracy with an inference speed under 80ms.</p>`;
                        } else if (title.includes('Pill')) {
                            projectHTML += `<p><strong>Challenge:</strong> Reducing misidentifications in a dataset of over 10,000 similar-looking pills. Optimizing the MobileNetV2 architecture was critical.</p>`;
                        } else if (title.includes('Audio')) {
                            projectHTML += `<p><strong>Challenge:</strong> Building a modular system that could handle various audio formats without failing, preparing the output for NLP pipelines.</p>`;
                        }
                        
                        if (link) {
                            projectHTML += `<p><strong>Source:</strong> <a href="${link}" target="_blank">View on GitHub</a></p>`;
                        }
                    });
                    output = projectHTML;
                    break;
                case 'skills':
                    output = `<h4>// Compiling skill assessment...</h4>
    <br>
    <p><strong>Languages:</strong> Python (Primary for ML/scripting), Java, C</p>
    <p><strong>Machine Learning:</strong> TensorFlow, Keras, YOLOv8 (Model fine-tuning, computer vision)</p>
    <p><strong>Web & Backend:</strong> Flask, React, Streamlit (API development, interactive UIs)</p>
    <p><strong>Databases:</strong> PostgreSQL, MongoDB, SQL (Data modeling and querying)</p>
    <p><strong>Tools & Platforms:</strong> Git, GitHub, Linux, AWS (Version control, deployment, and systems)</p>`;
                    break;
                case 'contact':
                    output = `<h4>// Establishing connection protocols...</h4>
    <br>
    <p>Let's connect and build something great together. You can reach me through the following channels:</p>
    <p><strong>- Email:</strong> <a href="mailto:sainikhil1024@gmail.com">sainikhil1024@gmail.com</a> (Preferred for direct inquiries)</p>
    <p><strong>- LinkedIn:</strong> <a href="https://www.linkedin.com/in/sai-nikhil-a10499231/" target="_blank">linkedin.com/in/sai-nikhil-a10499231</a> (For professional networking)</p>
    <p><strong>- GitHub:</strong> <a href="https://github.com/sainikhilchidipothu" target="_blank">github.com/sainikhilchidipothu</a> (To see my latest code)</p>`;
                    break;
                case 'clear':
                    terminalBody.innerHTML = '';
                    createNewPromptLine();
                    return;
                case 'close':
                    toggleTerminal();
                    return;
                default:
                    output = `<p>Command not found: '${cmd}'. Type 'help' for a list of commands.</p>`;
                    break;
            }

            if (output) {
              typeWriter(output, createNewPromptLine);
            } else {
              createNewPromptLine();
            }
        };
        
        terminalFab.addEventListener('click', toggleTerminal);
        terminalCloseBtn.addEventListener('click', toggleTerminal);

        terminalBody.addEventListener('click', () => {
            terminalInput.focus();
        });

        terminalInput.addEventListener('input', () => {
            if (currentPrompt) {
                const commandLine = currentPrompt.querySelector('.command-line');
                if (commandLine) {
                    commandLine.textContent = terminalInput.value;
                }
            }
        });

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !isTyping) {
                const command = terminalInput.value.trim();
                
                if (currentPrompt) {
                    const cursor = currentPrompt.querySelector('.blinking-cursor');
                    if(cursor) cursor.remove();
                }

                if (command) {
                    processCommand(command);
                } else {
                   const p = document.createElement('p');
                   p.innerHTML = `<span style="color:var(--heading-text-color); font-weight:bold;">&gt;</span>`;
                   terminalBody.appendChild(p);
                   createNewPromptLine();
                }
                
                
                terminalInput.value = '';
            }
        });

        createNewPromptLine();
    });
