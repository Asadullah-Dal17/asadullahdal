document.addEventListener('DOMContentLoaded', () => {
    const MEDIUM_RSS_URL = 'https://medium.com/feed/@asadullahdal';
    const RSS2JSON_API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_RSS_URL)}`;
    
    let allPosts = [];
    let currentFilter = 'all';
    
    const elements = {
        grid: document.getElementById('blog-grid'),
        searchInput: document.getElementById('search-input'),
        filterChips: document.querySelectorAll('.filter-chip'),
        postCount: document.getElementById('post-count')
    };
    
    // Initial Load
    fetchPosts();
    
    // Event Listeners
    elements.searchInput.addEventListener('input', (e) => filterPosts(e.target.value));
    elements.filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Toggle active state
            elements.filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            currentFilter = chip.dataset.filter;
            filterPosts(elements.searchInput.value);
        });
    });

    async function fetchPosts() {
        showSkeleton();
        
        try {
            const response = await fetch(RSS2JSON_API);
            const data = await response.json();
            
            if (data.status === 'ok') {
                allPosts = data.items.map(normalizePost);
                renderPosts(allPosts);
            } else {
                showError();
            }
        } catch (error) {
            console.error('Error fetching Medium feed:', error);
            showError();
        }
    }
    
    function normalizePost(item) {
        // Extract first image from content if thumbnail is missing form feed
        let thumb = item.thumbnail;
        if (!thumb || !thumb.startsWith('http')) {
            const match = item.content.match(/<img[^>]+src="([^">]+)"/);
            if (match) {
                thumb = match[1];
            } else {
                thumb = 'assets/images/medium-placeholder.jpg'; // Fallback needs to exist or use remote
            }
        }
        
        // Clean excerpt
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.content;
        const text = tempDiv.textContent || tempDiv.innerText || '';
        const excerpt = text.substring(0, 180) + '...';
        
        return {
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate.replace(/-/g, '/')), // Safari fix
            thumbnail: thumb,
            excerpt: excerpt,
            categories: item.categories || []
        };
    }
    
    function renderPosts(posts) {
        elements.grid.innerHTML = '';
        
        if (posts.length === 0) {
            elements.grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">No posts found.</div>';
            return;
        }
        
        posts.forEach(post => {
            const formattedDate = post.pubDate.toLocaleDateString(undefined, { 
                year: 'numeric', month: 'long', day: 'numeric' 
            });
            
            // Render visible categories (limit 2)
            const catHTML = post.categories.slice(0, 2)
                .map(cat => `<span class="cat-tag">#${cat}</span>`)
                .join('');
            
            const article = document.createElement('article');
            article.className = 'blog-card';
            article.innerHTML = `
                <div class="card-cover-wrapper">
                    <img src="${post.thumbnail}" alt="${post.title}" class="card-cover" loading="lazy">
                </div>
                <div class="card-body">
                    <div class="card-meta">
                        <i class="far fa-calendar"></i> ${formattedDate}
                    </div>
                    <div class="card-categories">${catHTML}</div>
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-excerpt">${post.excerpt}</p>
                    <div class="card-footer">
                        <a href="${post.link}" target="_blank" class="btn-read">
                            Read Article <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            `;
            
            elements.grid.appendChild(article);
        });
    }
    
    function filterPosts(searchTerm) {
        const term = searchTerm.toLowerCase();
        
        const filtered = allPosts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(term) || 
                                  post.excerpt.toLowerCase().includes(term);
            
            const matchesCategory = currentFilter === 'all' || 
                                    post.categories.some(c => c.toLowerCase().includes(currentFilter));
            
            return matchesSearch && matchesCategory;
        });
        
        renderPosts(filtered);
    }
    
    function showSkeleton() {
        elements.grid.innerHTML = '';
        for(let i=0; i<6; i++) {
            elements.grid.innerHTML += `
                <div class="blog-card" style="height: 400px; padding:0;">
                    <div class="skeleton" style="height: 200px; width: 100%;"></div>
                    <div style="padding: 1.5rem;">
                        <div class="skeleton" style="height: 20px; width: 40%; margin-bottom: 1rem;"></div>
                        <div class="skeleton" style="height: 30px; width: 90%; margin-bottom: 1rem;"></div>
                        <div class="skeleton" style="height: 15px; width: 100%; margin-bottom: 0.5rem;"></div>
                        <div class="skeleton" style="height: 15px; width: 80%;"></div>
                    </div>
                </div>
            `;
        }
    }
    
    function showError() {
        elements.grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p>Could not load articles.</p>
                <a href="https://medium.com/@asadullahdal" target="_blank" class="btn btn-primary">Visit Medium Profile</a>
            </div>
        `;
    }
});
