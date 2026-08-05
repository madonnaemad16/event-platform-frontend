/**
 * Events Directory & Search View Renderer
 */

function renderEventsView(params) {
  const events = window.eventStore.getEvents();
  const activeCategory = params.get('category') || 'All';
  const searchQuery = (params.get('search') || '').toLowerCase();

  const categories = ['All', 'Technology', 'Design', 'Business', 'Music'];

  const categoryTabsHtml = categories.map(cat => {
    const isActive = cat === activeCategory ? 'active' : '';
    const href = cat === 'All' ? '#events' : `#events?category=${encodeURIComponent(cat)}`;
    return `<a href="${href}" class="filter-tab ${isActive}">${cat}</a>`;
  }).join('');

  // Filter logic
  const filteredEvents = events.filter(evt => {
    const matchesCategory = activeCategory === 'All' || evt.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      evt.title.toLowerCase().includes(searchQuery) || 
      evt.description.toLowerCase().includes(searchQuery) ||
      evt.location.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const cardsHtml = filteredEvents.length > 0 ? filteredEvents.map(evt => {
    const seatPercentage = Math.round((evt.registered / evt.capacity) * 100);
    const isSaved = window.eventStore.isSaved(evt.id);
    
    return `
      <div class="event-card">
        <div class="card-image-wrapper">
          <img src="${evt.image}" alt="${evt.title}" class="card-image" loading="lazy">
          <span class="badge category-badge">${evt.category}</span>
          <button class="btn-favorite ${isSaved ? 'active' : ''}" data-event-id="${evt.id}" title="${isSaved ? 'Saved' : 'Save Event'}">
            ${isSaved ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span>📅 ${new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span>📍 ${evt.location.split(',')[0]}</span>
          </div>
          <h3 class="card-title">${evt.title}</h3>
          <p class="card-desc">${evt.description.substring(0, 90)}...</p>
          
          <div class="capacity-section">
            <div class="capacity-header">
              <span>Capacity</span>
              <span><strong>${evt.registered}</strong> / ${evt.capacity} seats</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill ${seatPercentage > 85 ? 'high' : ''}" style="width: ${seatPercentage}%"></div>
            </div>
          </div>
          
          <div class="card-footer">
            <span class="price-tag">${evt.price}</span>
            <a href="#event-detail?id=${evt.id}" class="btn btn-sm btn-primary">View Details →</a>
          </div>
        </div>
      </div>
    `;
  }).join('') : `
    <div class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>No events found</h3>
      <p>Try adjusting your search query or selecting a different category filter.</p>
      <a href="#events" class="btn btn-secondary">Clear Filters</a>
    </div>
  `;

  return `
    <div class="events-view-container">
      <div class="events-header">
        <div>
          <h1 class="page-title">Browse Events</h1>
          <p class="page-subtitle">Discover tech conferences, creative design workshops, and community events.</p>
        </div>
        <a href="#create" class="btn btn-primary">+ Add Event</a>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="toolbar">
        <div class="filter-tabs">
          ${categoryTabsHtml}
        </div>
        <div class="search-box">
          <input type="text" id="event-search-input" placeholder="Search by title or location..." value="${params.get('search') || ''}">
          <button id="btn-search-trigger" class="btn btn-sm btn-secondary">Search</button>
        </div>
      </div>

      <!-- Events Card Grid -->
      <div class="events-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}
