    const subthemesData = {
        1: [
            { id: '1.1', name: 'Подтема 1.1', content: 'Содержание для Подтемы 1.1: Это первая подтема первой темы.' },
            { id: '1.2', name: 'Подтема 1.2', content: 'Содержание для Подтемы 1.2: Это вторая подтема первой темы.' },
            { id: '1.3', name: 'Подтема 1.3', content: 'Содержание для Подтемы 1.3: Это третья подтема первой темы.' },
            { id: '1.4', name: 'Подтема 1.4', content: 'Содержание для Подтемы 1.4: Это четвертая подтема первой темы.' }
        ],
        2: [
            { id: '2.1', name: 'Подтема 2.1', content: 'Содержание для Подтемы 2.1: Это первая подтема второй темы.' },
            { id: '2.2', name: 'Подтема 2.2', content: 'Содержание для Подтемы 2.2: Это вторая подтема второй темы.' },
            { id: '2.3', name: 'Подтема 2.3', content: 'Содержание для Подтемы 2.3: Это третья подтема второй темы.' }
        ],
        3: [
            { id: '3.1', name: 'Подтема 3.1', content: 'Содержание для Подтемы 3.1: Это первая подтема третьей темы.' },
            { id: '3.2', name: 'Подтема 3.2', content: 'Содержание для Подтемы 3.2: Это вторая подтема третьей темы.' }
        ],
        4: [
            { id: '4.1', name: 'Подтема 4.1', content: 'Содержание для Подтемы 4.1: Это первая подтема четвертой темы.' }
        ]
    };

    let currentTheme = 1;
    let currentSubtheme = '1.1';

    document.addEventListener('DOMContentLoaded', function() {
        selectTheme(1);
    });

    function selectTheme(themeId) {
        currentTheme = themeId;
        
        const themeLinks = document.querySelectorAll('#themeList a');
        themeLinks.forEach(link => {
            if (link.getAttribute('data-theme') == themeId) {
                link.classList.remove('bg-gray-50', 'dark:bg-gray-800', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
                link.classList.add('text-white', 'bg-blue-700', 'dark:bg-blue-600');
            } else {
                link.classList.remove('text-white', 'bg-blue-700', 'dark:bg-blue-600');
                link.classList.add('bg-gray-50', 'dark:bg-gray-800', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
            }
        });
        
        loadSubthemes(themeId);
        
        if (subthemesData[themeId] && subthemesData[themeId].length > 0) {
            selectSubtheme(subthemesData[themeId][0].id);
        }
    }

    function loadSubthemes(themeId) {
        const subthemeList = document.getElementById('subthemeList');
        subthemeList.innerHTML = '';
        
        if (subthemesData[themeId]) {
            subthemesData[themeId].forEach(subtheme => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="#" class="inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white" 
                       data-subtheme="${subtheme.id}" onclick="selectSubtheme('${subtheme.id}')">
                        <svg class="w-4 h-4 me-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                        </svg>
                        ${subtheme.name}
                    </a>
                `;
                subthemeList.appendChild(li);
            });
        }
    }

    function selectSubtheme(subthemeId) {
        currentSubtheme = subthemeId;
        
        const subthemeLinks = document.querySelectorAll('#subthemeList a');
        subthemeLinks.forEach(link => {
            if (link.getAttribute('data-subtheme') == subthemeId) {
                link.classList.add('selected');
                link.classList.remove('bg-gray-50', 'dark:bg-gray-800');
            } else {
                link.classList.remove('selected');
                link.classList.add('bg-gray-50', 'dark:bg-gray-800');
            }
        });
        
        updateContent();
    }

    function updateContent() {
        const contentDiv = document.getElementById('content');
        const themeId = currentSubtheme.split('.')[0];
        const subtheme = subthemesData[themeId].find(st => st.id === currentSubtheme);
        
        if (subtheme) {
            contentDiv.innerHTML = `
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">${subtheme.name}</h3>
                <p>${subtheme.content}</p>
            `;
        }
    }