document.addEventListener('DOMContentLoaded', function() {
    const projects = [
        {
            title: "Sales Data Analysis",
            description: "Analyzed sales data to identify trends and provide actionable insights. Used Python and Pandas for data manipulation and Matplotlib for visualization.",
            tags: ["Python", "Pandas", "Matplotlib"]
        },
        {
            title: "Customer Segmentation",
            description: "Segmented customers based on purchasing behavior using clustering techniques. Visualized the segments to help tailor marketing strategies.",
            tags: ["R", "K-means Clustering", "GGplot2"]
        },
        {
            title: "Website Traffic Analysis",
            description: "Conducted an analysis of website traffic data to understand user behavior and optimize the user experience. Utilized SQL for data extraction and Tableau for dashboards.",
            tags: ["SQL", "Tableau", "Google Analytics"]
        },
        {
            title: "Social Media Sentiment Analysis",
            description: "Performed sentiment analysis on social media data to gauge public opinion on various topics. Used natural language processing techniques and visualization tools.",
            tags: ["Python", "NLTK", "Seaborn"]
        }
    ];

    const projectsContainer = document.getElementById('projectsContainer');

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        const projectTitle = document.createElement('h3');
        projectTitle.textContent = project.title;

        const projectDescription = document.createElement('p');
        projectDescription.textContent = project.description;

        const projectDetails = document.createElement('div');
        projectDetails.className = 'project-details';

        project.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'project-tag';
            tagElement.textContent = tag;
            projectDetails.appendChild(tagElement);
        });

        projectCard.appendChild(projectTitle);
        projectCard.appendChild(projectDescription);
        projectCard.appendChild(projectDetails);

        projectsContainer.appendChild(projectCard);
    });
});

let translations = {};
let lang = 'en'; // Default language

fetch('translations.json')
    .then(response => response.json())
    .then(data => {
        translations = data;
    });

document.addEventListener('DOMContentLoaded', function() {
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
        });

    function switchLanguage() {
        const currentFlag = document.getElementById('selectedFlag');
        const alternateFlag = document.querySelector('.alternative-flag');

        if (lang === 'en') {
            currentFlag.src = 'https://cdn.countryflags.com/thumbs/france/flag-400.png';
            alternateFlag.src = 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png';
            lang = 'fr';
        } else {
            currentFlag.src = 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png';
            alternateFlag.src = 'https://cdn.countryflags.com/thumbs/france/flag-400.png';
            lang = 'en';
        }

        updateTextContent(lang);
    }

    window.switchLanguage = switchLanguage;
});

function updateTextContent(lang) {
    // Logic to update the text content of the page based on the selected language
    const elements = document.querySelectorAll('[id]');
    elements.forEach(element => {
        const id = element.id;
        if (translations[lang] && translations[lang][id]) {
        element.textContent = translations[lang][id];
        }
    });
    console.log(`Language switched to ${lang}`);
}