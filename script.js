let translations = {}; // Store fetched translations
let currentLang = 'en'; // Default language

const projectsData = [ // Renamed to avoid confusion with translated projects
    {
        id: "salesDataAnalysis", // Add an ID for mapping to translations.json
        titleKey: "salesDataAnalysisTitle",
        descriptionKey: "salesDataAnalysisDesc",
        tags: ["Python", "Pandas", "Matplotlib"],
        detailsLink: "sales-details.html", // ADDED: Specific details link for each project
        githubLink: "https://github.com/your-username/sales-data-analysis-repo" // Replace with actual repo link
    },
    {
        id: "customerSegmentation",
        titleKey: "customerSegmentationTitle",
        descriptionKey: "customerSegmentationDesc",
        tags: ["R", "K-means Clustering", "GGplot2"],
        detailsLink: "customer-details.html", // ADDED
        githubLink: "https://github.com/your-username/customer-segmentation-repo" // Replace with actual repo link
    },
    {
        id: "websiteTrafficAnalysis",
        titleKey: "websiteTrafficAnalysisTitle",
        descriptionKey: "websiteTrafficAnalysisDesc",
        tags: ["SQL", "Tableau", "Google Analytics"],
        detailsLink: "website-details.html", // ADDED
        githubLink: "https://github.com/your-username/website-traffic-analysis-repo" // Replace with actual repo link
    },
    {
        id: "socialMediaSentimentAnalysis",
        titleKey: "socialMediaSentimentAnalysisTitle",
        descriptionKey: "socialMediaSentimentAnalysisDesc",
        tags: ["Python", "NLTK", "Seaborn"],
        detailsLink: "sentiment-details.html", // ADDED
        githubLink: "https://github.com/your-username/social-media-sentiment-analysis-repo" // Replace with actual repo link
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const projectsContainer = document.getElementById('projectsContainer'); // Ensure this ID exists on your projects container
    const aboutTextElement = document.getElementById('aboutText'); // Ensure this ID exists on your "About Me" description
    const selectedFlag = document.getElementById('selectedFlag');
    const alternativeFlag = document.querySelector('.alternative-flag');

    // --- Fetch translations first ---
    fetch('translations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            translations = data;
            // After translations are loaded, populate content
            populateProjects(); // Populate projects first
            updateTextContent(); // Then update all text content
            highlightActiveNavLink(); // Set initial active nav link
        })
        .catch(error => console.error('Error loading translations:', error));

    // --- Function to populate project cards ---
    function populateProjects() {
        // Clear existing projects if any (useful if calling this function multiple times)
        projectsContainer.innerHTML = '';

        projectsData.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-project-id', project.id); // Add data attribute for easier translation targeting

            const projectTitle = document.createElement('h3');
            projectTitle.setAttribute('data-translate-key', project.titleKey); // Mark for translation
            // Text content will be set by updateTextContent

            const projectDescription = document.createElement('p');
            projectDescription.setAttribute('data-translate-key', project.descriptionKey); // Mark for translation
            // Text content will be set by updateTextContent

            const projectSkillsContainer = document.createElement('div'); // Renamed from projectDetails for clarity
            projectSkillsContainer.className = 'project-skills';

            project.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'project-tag';
                tagElement.textContent = tag;
                projectSkillsContainer.appendChild(tagElement);
            });

            // --- Create the project links container ---
            const projectLinksContainer = document.createElement('div');
            projectLinksContainer.className = 'project-links';

            // Create "See details" link
            if (project.detailsLink) { // Only create if a link exists
                const detailsLink = document.createElement('a');
                detailsLink.href = project.detailsLink;
                detailsLink.className = 'project-link';
                detailsLink.target = '_blank'; // Open in new tab
                detailsLink.textContent = translations[currentLang]?.seeDetails || 'See details'; // Initial text, will be updated by updateTextContent
                detailsLink.setAttribute('data-translate-key', 'seeDetails'); // Mark for translation
                projectLinksContainer.appendChild(detailsLink);
            }

            // Create "GitHub Page" link
            if (project.githubLink) { // Only create if a link exists
                const githubLink = document.createElement('a');
                githubLink.href = project.githubLink;
                githubLink.className = 'project-link github-link';
                githubLink.target = '_blank'; // Open in new tab
                githubLink.innerHTML = `<i class="fab fa-github"></i> <span data-translate-key="githubPage">${translations[currentLang]?.githubPage || 'GitHub'}</span>`; // Initial text, will be updated by updateTextContent
                projectLinksContainer.appendChild(githubLink);
            }

            // Append all parts to the card
            projectCard.appendChild(projectTitle);
            projectCard.appendChild(projectDescription);
            projectCard.appendChild(projectSkillsContainer);
            projectCard.appendChild(projectLinksContainer); // Append the links container

            projectsContainer.appendChild(projectCard);
        });
    }

    // --- Function to update text content based on currentLang ---
    function updateTextContent() {
        if (!translations[currentLang]) {
            console.warn(`Translations for language '${currentLang}' not found.`);
            return;
        }

        // Update About Me section
        const aboutMeSectionTitle = document.querySelector('#about h2'); // Assuming your "About Me" title is an h2 inside #about
        if (aboutMeSectionTitle && translations[currentLang].aboutMeTitle) {
            aboutMeSectionTitle.textContent = translations[currentLang].aboutMeTitle;
        }
        if (aboutTextElement && translations[currentLang].aboutText) {
            aboutTextElement.textContent = translations[currentLang].aboutText;
        }

        // Update My Projects section title
        const projectsSectionTitle = document.querySelector('#projects h2'); // Assuming your "My Projects" title is an h2 inside #projects
        if (projectsSectionTitle && translations[currentLang].myProjectsTitle) {
            projectsSectionTitle.textContent = translations[currentLang].myProjectsTitle;
        }


        // Update project titles and descriptions
        document.querySelectorAll('[data-project-id]').forEach(card => {
            const projectId = card.getAttribute('data-project-id');
            const projectData = projectsData.find(p => p.id === projectId); // Find original project data

            if (projectData) {
                const titleElement = card.querySelector('h3[data-translate-key]');
                const descElement = card.querySelector('p[data-translate-key]');

                if (titleElement && translations[currentLang][projectData.titleKey]) {
                    titleElement.textContent = translations[currentLang][projectData.titleKey];
                }
                if (descElement && translations[currentLang][projectData.descriptionKey]) {
                    descElement.textContent = translations[currentLang][projectData.descriptionKey];
                }
            }
        });

        // Update project link texts for all project cards
        document.querySelectorAll('.project-link[data-translate-key="seeDetails"]').forEach(link => {
            link.textContent = translations[currentLang]?.seeDetails || 'See details';
        });

        // Update GitHub Page link text (within the span if using icon)
        document.querySelectorAll('.project-link.github-link span[data-translate-key="githubPage"]').forEach(span => {
            span.textContent = translations[currentLang]?.githubPage || 'GitHub';
        });

        // Get the aboutText container
        const aboutTextContainer = document.getElementById('aboutTextContainer'); // Use the new ID
        if (aboutTextContainer && translations[currentLang].aboutText) {
            aboutTextContainer.innerHTML = ''; // Clear previous content

            // If aboutText is an array (multiple paragraphs)
            if (Array.isArray(translations[currentLang].aboutText)) {
                translations[currentLang].aboutText.forEach(paragraphText => {
                    const p = document.createElement('p');
                    p.textContent = paragraphText;
                    aboutTextContainer.appendChild(p);
                });
            } else { // If it's a single string (fallback)
                const p = document.createElement('p');
                p.textContent = translations[currentLang].aboutText;
                aboutTextContainer.appendChild(p);
            }
        }

        // Handle all elements with a data-translate-key attribute
        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.getAttribute('data-translate-key');
            if (translations[currentLang][key]) {
                // Skip aboutText as it's handled above
                if (key === 'aboutText') return;

                // Special handling for GitHub Page link to preserve icon
                if (key === 'githubPage' && element.tagName === 'SPAN' && element.closest('.github-link')) {
                    element.textContent = translations[currentLang][key];
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // For input placeholders
                    element.placeholder = translations[currentLang][key];
                }
                else {
                    element.textContent = translations[currentLang][key];
                }
            }
        });

        console.log(`Language content updated to ${currentLang}`);
    }

    // --- Language Switcher Logic ---
    window.switchLanguage = function() {
        if (currentLang === 'en') {
            selectedFlag.src = 'https://cdn.countryflags.com/thumbs/france/flag-400.png';
            alternativeFlag.src = 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png';
            currentLang = 'fr';
        } else {
            selectedFlag.src = 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png';
            alternativeFlag.src = 'https://cdn.countryflags.com/thumbs/france/flag-400.png';
            currentLang = 'en';
        }
        updateTextContent(); // Call update function after changing language
    };

    // --- Smooth scrolling for navigation links & Active Link Highlighting ---
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }

            // Update active state immediately on click
            document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // --- Highlight active navigation link based on scroll position ---
    const sections = document.querySelectorAll('section[id]');
    function highlightActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjust for header height
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
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

    // Listen for scroll events to update active link
    window.addEventListener('scroll', highlightActiveNavLink);
});