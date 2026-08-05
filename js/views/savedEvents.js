/**
 * Saved Events View Renderer
 */

function renderSavedEventsView() {
  const savedEvents = window.eventStore.getSavedEvents();

  const cardsHtml = savedEvents.length > 0 ? savedEvents.map(evt => {
    const seatPercentage = Math.round((evt.registered / evt.capacity) * 100);
    return `
      <div class="event-card">
        <div class="card-image-wrapper">
          <img src="${evt.image}" alt="${evt.title}" class="card-image" loading="lazy">
          <span class="badge category-badge">${evt.category}</span>
          <button class="btn-favorite active" data-event-id="${evt.id}" title="Remove from saved">❤️</button>
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
      <div class="empty-icon">❤️</div>
      <h3>No saved events yet</h3>
      <p>Click the heart icon on any event to bookmark it here for quick access.</p>
      <a href="#events" class="btn btn-primary">Explore Events</a>
    </div>
  `;

  return `
    <div class="events-view-container">
      <div class="events-header">
        <div>
          <h1 class="page-title">My Saved Events</h1>
          <p class="page-subtitle">Events you have bookmarked for easy viewing.</p>
        </div>
      </div>

      <div class="events-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}
