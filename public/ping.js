document.addEventListener('DOMContentLoaded', () => {
    const siteGrid = document.getElementById('site-grid');
    const nameInput = document.getElementById('site-name');
    const addressInput = document.getElementById('site-address');
    const addBtn = document.getElementById('add-btn');

    // デフォルト！！！　日本の神！！！
    const defaultSites = [
        { name: 'Motchiy Server', address: 'motchiy.com' },
        { name: 'Google', address: 'google.com' },
        { name: 'Bing', address: 'bing.com' }
    ];

    let savedSites = JSON.parse(localStorage.getItem('ping_sites')) || defaultSites;

    // 画面にタイルを一覧表示する関数
    function renderTiles() {
        siteGrid.innerHTML = '';
        
        savedSites.forEach((site, index) => {
            const card = document.createElement('div');
            card.className = 'site-card';
            
            card.innerHTML = `
                <span class="site-card__title">${site.name}</span>
                <span class="site-card__address">${site.address}</span>
                <span class="site-card__speed">0 ms</span>
                <button class="site-card__delete-btn" data-index="${index}" title="削除">×</button>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('site-card__delete-btn')) return;
                runPing(card);
            });

            siteGrid.appendChild(card);
        });
    }

    async function runPing(card) {
        const addressEl = card.querySelector('.site-card__address');
        const speedEl = card.querySelector('.site-card__speed');
        if (!addressEl || !speedEl) return;
    
        const domain = addressEl.textContent.trim();
        speedEl.textContent = '計測中...';
        card.style.opacity = '0.7';
    
        try {
            const domainExists = await checkDomainExists(domain);
            
            if (!domainExists) {
                speedEl.textContent = 'Domain not exists';
                return;
            }
            const ms = await pingUsingImage(`https://${domain}`);
            speedEl.textContent = `${ms} ms`;
        } catch (error) {
            speedEl.textContent = 'Error';
        } finally {
            card.style.opacity = '1';
        }
    }
    
    async function checkDomainExists(domain) {
        try {
            const response = await fetch(`https://cloudflare-dns.com{domain}&type=A`, {
                headers: { 'Accept': 'application/dns-json' }
            });
            const data = await response.json();
            if (data.Status === 3) {
                return false;
            }
            return data.Answer && data.Answer.length > 0;
        } catch (e) {
            return true; 
        }
    }


    addBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const address = addressInput.value.trim().replace(/^https?:\/\//, '');

        if (!name || !address) {
            alert('サイト名とドメインを両方入力してください。');
            return;
        }

        savedSites.push({ name, address });
        localStorage.setItem('ping_sites', JSON.stringify(savedSites));

        renderTiles();
        nameInput.value = '';
        addressInput.value = '';
    });

    siteGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('site-card__delete-btn')) {
            const index = e.target.getAttribute('data-index');
            savedSites.splice(index, 1);
            localStorage.setItem('ping_sites', JSON.stringify(savedSites));
            renderTiles();
        }
    });
    renderTiles();
});

// ピングポングしましゅ
function pingUsingImage(url) {
    return new Promise((resolve) => {
        const startTime = performance.now();
        const img = new Image();
        const cacheBuster = `?t=${Date.now()}`;

        img.onload = () => {
            const duration = performance.now() - startTime;
            resolve(Math.round(duration));
        };

        img.onerror = () => {
            const duration = performance.now() - startTime;
            resolve(Math.round(duration));
        };

        img.src = `${url}/favicon.ico${cacheBuster}`;
    });
}
