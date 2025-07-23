let translations = {}; // Store fetched translations
let projectsData = []; // Store fetched projects
let currentLang = 'en'; // Default language

document.addEventListener('DOMContentLoaded', function() {
    const projectsContainer = document.getElementById('projectsContainer');
    const modal = document.getElementById('projectModal');
    const closeButton = document.querySelector('.close');

    // Fetch all necessary data
    Promise.all([
        fetch('translations.json').then(response => response.json()),
        fetchProjects()
    ])
    .then(([translationsData, projects]) => {
        translations = translationsData;
        projectsData = projects;
        
        populateProjects();
        populateSkills();
        updateTextContent();
        highlightActiveNavLink();
    })
    .catch(error => console.error('Error loading data:', error));

    async function fetchProjects() {
        const projectFolders = ['insurance_regression_analysis'];
        const projects = [];

        for (const folder of projectFolders) {
            const analysisLang = currentLang === 'fr' ? 'analysis_fr.html' : 'analysis.html';
            const response = await fetch(`projects/${folder}/${analysisLang}`);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const title = doc.querySelector('h1').textContent;
            const description = doc.querySelector('.card p').textContent;
            const tags = Array.from(doc.querySelectorAll('.tech-badge')).map(badge => badge.textContent);
            const githubLink = "https://github.com/ehicham95/Insurance_Charges_Analysis";

            // Fix image paths
            const images = doc.querySelectorAll('img');
            images.forEach(img => {
                const src = img.getAttribute('src');
                if (src && !src.startsWith('http')) {
                    img.setAttribute('src', `projects/${folder}/${src}`);
                }
            });

            projects.push({
                id: folder,
                title: title,
                description: description,
                tags: tags,
                html: doc.querySelector('.container').innerHTML,
                githubLink: githubLink
            });
        }
        return projects;
    }

    async function openModal(projectId) {
        const project = projectsData.find(p => p.id === projectId);
        if (project) {
            const analysisLang = currentLang === 'fr' ? 'analysis_fr.html' : 'analysis.html';
            const response = await fetch(`projects/${project.id}/${analysisLang}`);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Fix image paths
            const images = doc.querySelectorAll('img');
            images.forEach(img => {
                const src = img.getAttribute('src');
                if (src && !src.startsWith('http')) {
                    img.setAttribute('src', `projects/${project.id}/${src}`);
                }
            });

            document.getElementById('modalProjectTitle').textContent = doc.querySelector('h1').textContent;
            document.getElementById('modalProjectDetails').innerHTML = doc.querySelector('.container').innerHTML;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    function populateProjects() {
        projectsContainer.innerHTML = '';
        projectsData.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-project-id', project.id);

            const projectImage = document.createElement('img');
            projectImage.src = `projects/${project.id}/project_image.png`;
            projectImage.alt = project.title;
            projectImage.className = 'project-image';
            projectCard.appendChild(projectImage);

            const projectTitle = document.createElement('h3');
            projectTitle.textContent = project.title;

            const projectDescription = document.createElement('p');
            projectDescription.textContent = project.description;

            const projectSkillsContainer = document.createElement('div');
            projectSkillsContainer.className = 'project-skills';
            project.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'project-tag';
                tagElement.textContent = tag;
                projectSkillsContainer.appendChild(tagElement);
            });

            const projectLinksContainer = document.createElement('div');
            projectLinksContainer.className = 'project-links';

            const seeDetailsButton = document.createElement('button');
            seeDetailsButton.className = 'see-details-btn project-link';
            seeDetailsButton.setAttribute('data-translate-key', 'seeDetails');
            seeDetailsButton.textContent = translations[currentLang]?.seeDetails || 'See Details';
            seeDetailsButton.addEventListener('click', () => openModal(project.id));
            projectLinksContainer.appendChild(seeDetailsButton);

            if (project.githubLink) {
                const githubLink = document.createElement('a');
                githubLink.href = project.githubLink;
                githubLink.className = 'project-link github-link';
                githubLink.target = '_blank';
                githubLink.innerHTML = `<i class="fab fa-github"></i> <span data-translate-key="githubPage">${translations[currentLang]?.githubPage || 'GitHub'}</span>`;
                projectLinksContainer.appendChild(githubLink);
            }

            projectCard.appendChild(projectTitle);
            projectCard.appendChild(projectDescription);
            projectCard.appendChild(projectSkillsContainer);
            projectCard.appendChild(projectLinksContainer);
            projectsContainer.appendChild(projectCard);
        });
    }

    function populateSkills() {
        const skillsContainer = document.getElementById('skillsContainer');
        skillsContainer.innerHTML = ''; // Clear existing skills

        const skillsData = translations[currentLang]?.skills;
        if (!skillsData) return;

        for (const categoryKey in skillsData) {
            const category = skillsData[categoryKey];
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skills-category';

            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = category.title;
            categoryDiv.appendChild(categoryTitle);

            const skillsList = document.createElement('ul');
            skillsList.className = 'skills-list';

            category.items.forEach(skill => {
                const skillItem = document.createElement('li');
                skillItem.className = 'skill-item';
                skillItem.textContent = skill.name; // Display only the name, no icon
                skillsList.appendChild(skillItem);
            });

            categoryDiv.appendChild(skillsList);
            skillsContainer.appendChild(categoryDiv);
        }
    }

    function updateTextContent() {
        if (!translations[currentLang]) return;

        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.getAttribute('data-translate-key');
            if (translations[currentLang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[currentLang][key];
                } else {
                    element.textContent = translations[currentLang][key];
                }
            }
        });

        const aboutTextContainer = document.getElementById('aboutTextContainer');
        if (aboutTextContainer && translations[currentLang].aboutText) {
            aboutTextContainer.innerHTML = '';
            if (Array.isArray(translations[currentLang].aboutText)) {
                translations[currentLang].aboutText.forEach(paragraphText => {
                    const p = document.createElement('p');
                    p.textContent = paragraphText;
                    aboutTextContainer.appendChild(p);
                });
            } else {
                const p = document.createElement('p');
                p.textContent = translations[currentLang].aboutText;
                aboutTextContainer.appendChild(p);
            }
        }
        
        // Re-populate projects and skills to update their text content
        populateProjects();
        populateSkills();
    }

    window.switchLanguage = async function() {
        currentLang = currentLang === 'en' ? 'fr' : 'en';
        const newFlag = currentLang === 'en' ? 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png' : 'https://cdn.countryflags.com/thumbs/france/flag-400.png';
        const newAltFlag = currentLang === 'en' ? 'https://cdn.countryflags.com/thumbs/france/flag-400.png' : 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png';
        document.getElementById('selectedFlag').src = newFlag;
        document.querySelector('.alternative-flag').src = newAltFlag;
        projectsData = await fetchProjects();
        updateTextContent();
    };

    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if(targetSection){
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    function highlightActiveNavLink() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('nav a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').substring(1) === current) {
                a.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNavLink);

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Intersection Observer for fade-in sections
    const sectionsToFade = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sectionsToFade.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
});
