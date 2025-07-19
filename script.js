let translations = {}; // Store fetched translations
let currentLang = 'en'; // Default language

const projectsData = [
    {
        id: "salesDataAnalysis",
        titleKey: "salesDataAnalysisTitle",
        descriptionKey: "salesDataAnalysisDesc",
        tags: ["Python", "Pandas", "Matplotlib", "Power BI"],
        githubLink: "https://github.com/your-username/sales-data-analysis-repo",
        problemStatementKey: "salesProblemStatement",
        dataSourcesKey: "salesDataSources",
        methodologyKey: "salesMethodology",
        resultsKey: "salesResults",
        challengesKey: "salesChallenges",
        learningsKey: "salesLearnings",
        visualizations: ["/assets/sales_chart_1.png", "/assets/sales_dashboard_2.png"],
        powerBiEmbedUrl: "https://app.powerbi.com/view?r=eyJrIjoiEXAMPLE-GUID-HERE-eyJiIjozLCJkIjo0fQ%3D%3D" // Example Power BI URL
    },
    {
        id: "customerSegmentation",
        titleKey: "customerSegmentationTitle",
        descriptionKey: "customerSegmentationDesc",
        tags: ["R", "K-means Clustering", "GGplot2"],
        githubLink: "https://github.com/your-username/customer-segmentation-repo",
        problemStatementKey: "customerProblemStatement",
        dataSourcesKey: "customerDataSources",
        methodologyKey: "customerMethodology",
        resultsKey: "customerResults",
        challengesKey: "customerChallenges",
        learningsKey: "customerLearnings",
        visualizations: [],
        powerBiEmbedUrl: ""
    },
    {
        id: "websiteTrafficAnalysis",
        titleKey: "websiteTrafficAnalysisTitle",
        descriptionKey: "websiteTrafficAnalysisDesc",
        tags: ["SQL", "Tableau", "Google Analytics"],
        githubLink: "https://github.com/your-username/website-traffic-analysis-repo",
        problemStatementKey: "websiteProblemStatement",
        dataSourcesKey: "websiteDataSources",
        methodologyKey: "websiteMethodology",
        resultsKey: "websiteResults",
        challengesKey: "websiteChallenges",
        learningsKey: "websiteLearnings",
        visualizations: [],
        powerBiEmbedUrl: ""
    },
    {
        id: "socialMediaSentimentAnalysis",
        titleKey: "socialMediaSentimentAnalysisTitle",
        descriptionKey: "socialMediaSentimentAnalysisDesc",
        tags: ["Python", "NLTK", "Seaborn"],
        githubLink: "https://github.com/your-username/social-media-sentiment-analysis-repo",
        problemStatementKey: "socialProblemStatement",
        dataSourcesKey: "socialDataSources",
        methodologyKey: "socialMethodology",
        resultsKey: "socialResults",
        challengesKey: "socialChallenges",
        learningsKey: "socialLearnings",
        visualizations: [],
        powerBiEmbedUrl: ""
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const projectsContainer = document.getElementById('projectsContainer');
    const aboutTextElement = document.getElementById('aboutText');
    const selectedFlag = document.getElementById('selectedFlag');
    const alternativeFlag = document.querySelector('.alternative-flag');
    const modal = document.getElementById('projectModal');
    const closeButton = document.querySelector('.close');

    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            populateProjects();
            updateTextContent();
            highlightActiveNavLink();
        })
        .catch(error => console.error('Error loading translations:', error));

    function openModal(projectId) {
        const project = projectsData.find(p => p.id === projectId);
        if (project) {
            document.getElementById('modalProjectTitle').textContent = translations[currentLang][project.titleKey];
            document.getElementById('modalProblemStatement').textContent = translations[currentLang][project.problemStatementKey];
            document.getElementById('modalDataSources').textContent = translations[currentLang][project.dataSourcesKey];
            document.getElementById('modalMethodology').textContent = translations[currentLang][project.methodologyKey];
            document.getElementById('modalResults').textContent = translations[currentLang][project.resultsKey];
            document.getElementById('modalChallenges').textContent = translations[currentLang][project.challengesKey];
            document.getElementById('modalLearnings').textContent = translations[currentLang][project.learningsKey];

            const visualizationsContainer = document.getElementById('modalVisualizations');
            visualizationsContainer.innerHTML = '';
            if (project.visualizations && project.visualizations.length > 0) {
                document.getElementById('modalVisualizationsContainer').style.display = 'block';
                project.visualizations.forEach(visUrl => {
                    const img = document.createElement('img');
                    img.src = visUrl;
                    img.alt = "Project Visualization";
                    visualizationsContainer.appendChild(img);
                });
            } else {
                document.getElementById('modalVisualizationsContainer').style.display = 'none';
            }

            const powerBiContainer = document.getElementById('modalPowerBiContainer');
            const powerBiFrame = document.getElementById('powerBiFrame');
            if (project.powerBiEmbedUrl) {
                powerBiContainer.style.display = 'block';
                powerBiFrame.src = project.powerBiEmbedUrl;
            } else {
                powerBiContainer.style.display = 'none';
            }

            modal.style.display = 'block';
        }
    }

    function populateProjects() {
        projectsContainer.innerHTML = '';
        projectsData.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-project-id', project.id);

            const projectTitle = document.createElement('h3');
            projectTitle.setAttribute('data-translate-key', project.titleKey);

            const projectDescription = document.createElement('p');
            projectDescription.setAttribute('data-translate-key', project.descriptionKey);

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
            seeDetailsButton.addEventListener('click', () => openModal(project.id));
            projectLinksContainer.appendChild(seeDetailsButton);

            if (project.githubLink) {
                const githubLink = document.createElement('a');
                githubLink.href = project.githubLink;
                githubLink.className = 'project-link github-link';
                githubLink.target = '_blank';
                githubLink.innerHTML = `<i class="fab fa-github"></i> <span data-translate-key="githubPage"></span>`;
                projectLinksContainer.appendChild(githubLink);
            }

            projectCard.appendChild(projectTitle);
            projectCard.appendChild(projectDescription);
            projectCard.appendChild(projectSkillsContainer);
            projectCard.appendChild(projectLinksContainer);
            projectsContainer.appendChild(projectCard);
        });
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
    }

    window.switchLanguage = function() {
        currentLang = currentLang === 'en' ? 'fr' : 'en';
        const newFlag = currentLang === 'en' ? 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png' : 'https://cdn.countryflags.com/thumbs/france/flag-400.png';
        const newAltFlag = currentLang === 'en' ? 'https://cdn.countryflags.com/thumbs/france/flag-400.png' : 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png';
        selectedFlag.src = newFlag;
        alternativeFlag.src = newAltFlag;
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

    closeButton.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
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
