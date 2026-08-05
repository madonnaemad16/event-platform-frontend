/**
 * Event Detail View & RSVP Registration Component
 */

function renderEventDetailView(params) {
  const eventId = params.get('id');
  const event = window.eventStore.getEventById(eventId);

  if (!event) {
    return `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h2>Event Not Found</h2>
        <p>The event you are looking for does not exist or has been removed.</p>
        <a href="#events" class="btn btn-primary">Back to Events</a>
      </div>
    `;
  }

  const seatsLeft = Math.max(0, event.capacity - event.registered);
  const isFullyBooked = seatsLeft === 0;
  const seatPercentage = Math.round((event.registered / event.capacity) * 100);

  const agendaHtml = (event.agenda || []).map(item => `
    <div class="agenda-item">
      <div class="agenda-time">${item.time}</div>
      <div class="agenda-title">${item.title}</div>
    </div>
  `).join('');

  const attendeesHtml = (event.attendees || []).length > 0 ? (event.attendees || []).map(att => `
    <div class="attendee-chip">
      <div class="avatar">${att.name.charAt(0).toUpperCase()}</div>
      <div class="attendee-info">
        <span class="attendee-name">${att.name}</span>
        <span class="attendee-date">RSVP on ${att.date}</span>
      </div>
    </div>
  `).join('') : `<p class="text-muted">Be the first attendee to register for this event!</p>`;

  return `
    <div class="event-detail-container">
      <!-- Top Breadcrumb Navigation -->
      <nav class="breadcrumb">
        <a href="#events">← Back to Events</a>
        <span>/</span>
        <span class="current">${event.title}</span>
      </nav>

      <!-- Event Header Hero -->
      <div class="detail-hero">
        <div class="detail-hero-content">
          <div class="detail-badges">
            <span class="badge category-badge">${event.category}</span>
            <span class="badge type-badge">${event.type}</span>
            <span class="badge ${isFullyBooked ? 'badge-danger' : 'badge-success'}">
              ${isFullyBooked ? 'Sold Out' : `${seatsLeft} Seats Left`}
            </span>
          </div>
          <h1 class="detail-title">${event.title}</h1>
          <div class="detail-meta-grid">
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <div>
                <strong>Date & Time</strong>
                <p>${new Date(event.date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
              </div>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📍</span>
              <div>
                <strong>Location & Venue</strong>
                <p>${event.location}</p>
              </div>
            </div>
            <div class="meta-item">
              <span class="meta-icon">💳</span>
              <div>
                <strong>Ticket Price</strong>
                <p>${event.price}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-image-card">
          <img src="${event.image}" alt="${event.title}" class="detail-image">
        </div>
      </div>

      <!-- Detail Main Content Grid -->
      <div class="detail-layout">
        <!-- Left Side: Overview & Agenda -->
        <div class="detail-main">
          <section class="glass-card">
            <h2>About This Event</h2>
            <p class="description-text">${event.description}</p>
          </section>

          <section class="glass-card">
            <h2>Event Schedule & Agenda</h2>
            <div class="agenda-timeline">
              ${agendaHtml || '<p class="text-muted">Agenda will be announced closer to the event date.</p>'}
            </div>
          </section>

          <section class="glass-card">
            <h2>Registered Attendees (${event.attendees ? event.attendees.length : 0})</h2>
            <div class="attendees-list">
              ${attendeesHtml}
            </div>
          </section>
        </div>

        <!-- Right Side: Sticky RSVP Card -->
        <div class="detail-sidebar">
          <div class="sticky-card glass-card">
            <h3 class="sidebar-title">Reserve Your Seat</h3>
            
            <div class="capacity-gauge">
              <div class="gauge-header">
                <span>Registration Status</span>
                <span><strong>${event.registered}</strong> / ${event.capacity}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill ${seatPercentage > 85 ? 'high' : ''}" style="width: ${seatPercentage}%"></div>
              </div>
              <p class="gauge-caption">${isFullyBooked ? 'Registration is currently closed' : `Hurry! Only ${seatsLeft} seats remaining.`}</p>
            </div>

            <!-- RSVP Form -->
            <form id="rsvp-form" data-event-id="${event.id}">
              <div class="form-group">
                <label for="rsvp-name">Full Name</label>
                <input type="text" id="rsvp-name" class="form-input" placeholder="e.g. Alex Morgan" required ${isFullyBooked ? 'disabled' : ''}>
              </div>

              <div class="form-group">
                <label for="rsvp-email">Email Address</label>
                <input type="email" id="rsvp-email" class="form-input" placeholder="alex@company.com" required ${isFullyBooked ? 'disabled' : ''}>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" ${isFullyBooked ? 'disabled' : ''}>
                ${isFullyBooked ? 'Event Fully Booked' : 'Confirm RSVP Registration ✨'}
              </button>
            </form>

            <div class="sidebar-divider"></div>

            <div class="action-buttons-group">
              <button id="btn-delete-event" data-event-id="${event.id}" class="btn btn-sm btn-danger-outline">Delete Event</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
