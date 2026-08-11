/**
 * Events List View — Browsable Cards with Search, Category, Location & Date Filters
 */

function renderEventsView(params) {
  const events = window.eventStore.getEvents();
  const activeCategory = params.get('category') || 'All';
  const searchQuery = (params.get('search') || '').toLowerCase();
  const locationQuery = (params.get('location') || '').toLowerCase();
  const dateFilter = params.get('date') || '';

  const categories = ['All', 'Technology', 'Design', 'Business', 'Music'];

  const categoryTabsHtml = categories.map(cat => {
    const isActive = cat === activeCategory ? 'active' : '';
    const href = cat === 'All' ? '#events' : `#events?category=${encodeURIComponent(cat)}`;
    return `<a href="${href}" class="filter-tab ${isActive}">${cat}</a>`;
  }).join('');

  // Apply all filters
  const filteredEvents = events.filter(evt => {
    const matchesCategory = activeCategory === 'All' ||
      evt.category.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch = !searchQuery ||
      evt.title.toLowerCase().includes(searchQuery) ||
      evt.description.toLowerCase().includes(searchQuery) ||
      evt.location.toLowerCase().includes(searchQuery);

    const matchesLocation = !locationQuery ||
      evt.location.toLowerCase().includes(locationQuery);

    const matchesDate = !dateFilter ||
      evt.date.startsWith(dateFilter); // dateFilter is YYYY-MM-DD

    return matchesCategory && matchesSearch && matchesLocation && matchesDate;
  });

  const hasActiveFilters = activeCategory !== 'All' || searchQuery || locationQuery || dateFilter;

  const cardsHtml = filteredEvents.length > 0
    ? filteredEvents.map(evt => {
      const seatPercentage = Math.min(100, Math.round(((evt.registered || 0) / evt.capacity) * 100));
      const isSaved = window.eventStore.isSaved(evt.id);
      const seatsLeft = Math.max(0, evt.capacity - (evt.registered || 0));
      const isFull = seatsLeft === 0;

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
                <span>Registrations</span>
                <span><strong>${evt.registered || 0}</strong> / ${evt.capacity}
                  ${isFull ? '<span class="badge badge-danger" style="margin-left:6px">Full</span>' : ''}
                </span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill ${seatPercentage > 85 ? 'high' : ''}" style="width: ${seatPercentage}%"></div>
              </div>
            </div>

            <div class="card-footer">
              <span class="price-tag">${evt.price}</span>
              <div class="card-actions">
                <a href="#event-detail?id=${evt.id}" class="btn btn-sm btn-primary">View →</a>
                <a href="#create?edit=${evt.id}" class="btn btn-sm btn-outline" title="Edit Event">✏️ Edit</a>
                <button class="btn btn-sm btn-danger-outline btn-delete-event" data-event-id="${evt.id}" title="Delete Event">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('')
    : `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No events found</h3>
        <p>Try adjusting your search or filters.</p>
        <a href="#events" class="btn btn-secondary">Clear All Filters</a>
      </div>
    `;

  return `
    <div class="events-view-container">
      <div class="events-header">
        <div>
          <h1 class="page-title">Browse Events</h1>
          <p class="page-subtitle">Discover conferences, workshops, and community events.</p>
        </div>
        <a href="#create" class="btn btn-primary">+ New Event</a>
      </div>

      <!-- Filter Toolbar -->
      <div class="toolbar">
        <!-- Category Tabs -->
        <div class="filter-tabs">
          ${categoryTabsHtml}
        </div>

        <!-- Search & Filters Row -->
        <div class="filter-row">
          <div class="search-box">
            <input type="text" id="event-search-input"
              placeholder="Search events..."
              value="${params.get('search') || ''}">
            <button id="btn-search-trigger" class="btn btn-sm btn-secondary">Search</button>
          </div>

          <input type="text" id="filter-location" class="form-input filter-input"
            placeholder="📍 Filter by location..."
            value="${params.get('location') || ''}">

          <input type="date" id="filter-date" class="form-input filter-input"
            value="${params.get('date') || ''}"
            title="Filter by date">

          ${hasActiveFilters ? `<button id="btn-clear-filters" class="btn btn-sm btn-outline">✕ Clear Filters</button>` : ''}
        </div>
      </div>

      <!-- Results count -->
      <p class="results-count">
        Showing <strong>${filteredEvents.length}</strong> of ${events.length} events
      </p>

      <!-- Events Grid -->
      <div class="events-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}
