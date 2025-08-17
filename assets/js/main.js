let dealsData = [];
let clientsData = [];
let currentTheme = 1;

document.addEventListener('DOMContentLoaded', async function() {
    await fetchData();
    if (dealsData.length > 0 || clientsData.length > 0) {
        selectTheme(1);
    }
});

async function fetchData() {
    try {
        // Загружаем сделки
        const dealsResponse = await fetch('/api/getDeals.php');
        const dealsJson = await dealsResponse.json();
        if (dealsJson.success) dealsData = dealsJson.data;

        // Загружаем клиентов
        const clientsResponse = await fetch('/api/getClients.php');
        const clientsJson = await clientsResponse.json();
        if (clientsJson.success) clientsData = clientsJson.data;

        console.log('Data loaded:', { dealsData, clientsData });
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function selectTheme(themeId) {
    currentTheme = themeId;
    
    const themeLinks = document.querySelectorAll('#themeList a');
    themeLinks.forEach(link => {
        if (link.getAttribute('data-theme') == themeId) {
            link.classList.add('text-white', 'bg-blue-700', 'dark:bg-blue-600');
            link.classList.remove('bg-gray-50', 'dark:bg-gray-800');
        } else {
            link.classList.remove('text-white', 'bg-blue-700', 'dark:bg-blue-600');
            link.classList.add('bg-gray-50', 'dark:bg-gray-800');
        }
    });
    
    loadItemsForTheme(themeId);
}

function loadItemsForTheme(themeId) {
    const subthemeList = document.getElementById('subthemeList');
    subthemeList.innerHTML = '';
    
    const items = themeId == 1 ? dealsData : clientsData;
    
    if (items.length > 0) {
        items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="#" class="inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white" 
                   data-item="${themeId == 1 ? item.deal_id : item.id}" 
                   onclick="selectItem(${themeId == 1 ? item.deal_id : item.id}, ${themeId})">
                    <svg class="w-4 h-4 me-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                    ${themeId == 1 ? item.name : `${item.firstname} ${item.surname}`}
                    ${themeId == 1 ? `(${item.price.toLocaleString()} ₽)` : ''}
                </a>
            `;
            subthemeList.appendChild(li);
        });
        
        selectItem(items[0].deal_id || items[0].id, themeId);
    }
}

function selectItem(itemId, themeId) {
    const itemLinks = document.querySelectorAll('#subthemeList a');
    itemLinks.forEach(link => {
        if (link.getAttribute('data-item') == itemId) {
            link.classList.add('selected');
        } else {
            link.classList.remove('selected');
        }
    });
    
    updateContent(itemId, themeId);
}

function updateContent(itemId, themeId) {
    const contentDiv = document.getElementById('content');
    
    if (themeId == 1) {
        // Показываем информацию о сделке
        const deal = dealsData.find(d => d.deal_id == itemId);
        contentDiv.innerHTML = `
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">${deal.name}</h3>
            <div class="mb-4">
                <p><strong>Цена:</strong> ${deal.price.toLocaleString()} ₽</p>
                <p><strong>Дата создания:</strong> ${deal.created_at || 'не указана'}</p>
            </div>
            <h4 class="font-bold text-gray-800 dark:text-gray-200 mb-2">Участники:</h4>
            <ul class="list-disc pl-5">
                ${deal.participants.map(p => `<li>${p}</li>`).join('')}
            </ul>
        `;
    } else {
        // Показываем информацию о клиенте
        const client = clientsData.find(c => c.id == itemId);
        contentDiv.innerHTML = `
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">${client.firstname} ${client.surname}</h3>
            <div class="mb-4">
                <p><strong>Email:</strong> ${client.email || 'не указан'}</p>
                <p><strong>Телефон:</strong> ${client.phone || 'не указан'}</p>
                <p><strong>Сделка:</strong> ${client.deal_name || 'не указана'} (${client.price ? client.price.toLocaleString() + ' ₽' : 'нет данных'})</p>
            </div>
        `;
    }
}