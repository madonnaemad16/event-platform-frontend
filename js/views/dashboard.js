/**
 * Dashboard View — Platform Statistics & Featured Events
 */

function renderDashboardView() {
  const stats = window.eventStore.getStats();
  const events = window.eventStore.getEvents().slice(0, 3);

  const popularName = stats.mostPopularEvent
    ? stats.mostPopularEvent.title.length > 30
      ? stats.mostPopularEvent.title.substring(0, 28) + '…'
      : stats.mostPopularEvent.title
    : 'N/A';

  const eventCardsHtml = events.map(evt => {
    const seatPercentage = Math.min(100, Math.round(((evt.registered || 0) / evt.capacity) * 100));
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
              <span>Registrations</span>
              <span><strong>${evt.registered || 0}</strong> / ${evt.capacity}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill ${seatPercentage > 85 ? 'high' : ''}" style="width: ${seatPercentage}%"></div>
            </div>
          </div>

          <div class="card-footer">
            <span class="price-tag">${evt.price}</span>
            <a href="#event-detail?id=${evt.id}" class="btn btn-sm btn-outline">View Details →</a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="dashboard-container">
      <!-- Hero -->
      <section class="hero-banner">
        <div class="hero-content">
          <span class="hero-subtitle">✨ Convene Platform</span>
          <h1 class="hero-title">Host & Attend Great Community Events</h1>
          <p class="hero-desc">Browse upcoming workshops, reserve seats, and publish new events easily.</p>
          <div class="hero-actions">
            <a href="#create" class="btn btn-primary btn-lg">+ Create New Event</a>
            <a href="#events" class="btn btn-secondary btn-lg">Browse All Events</a>
          </div>
        </div>
      </section>

      <!-- Stats Grid -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎪</div>
          <div class="stat-info">
            <span class="stat-label">Total Events</span>
            <span class="stat-value">${stats.totalEvents}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <span class="stat-label">Upcoming Events</span>
            <span class="stat-value">${stats.upcomingEvents}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <span class="stat-label">Total Registrations</span>
            <span class="stat-value">${stats.totalRegistrations}</span>
          </div>
        </div>

        <div class="stat-card stat-card-wide">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <span class="stat-label">Most Popular Event</span>
            <span class="stat-value stat-value-sm">${popularName}</span>
            ${stats.mostPopularEvent ? `<span class="stat-sub">${stats.mostPopularEvent.registered} registrations</span>` : ''}
          </div>
        </div>
      </section>

      <!-- Featured Events -->
      <section class="section-container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Featured Events</h2>
            <p class="section-subtitle">Highlights happening soon</p>
          </div>
          <a href="#events" class="view-all-link">View All →</a>
        </div>
        <div class="events-grid">
          ${eventCardsHtml}
        </div>
      </section>
    </div>
  `;
}
