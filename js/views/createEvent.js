/**
 * Create & Edit Event View — Shared Form with Edit Mode Support
 */

function renderCreateEventView(params) {
  const editId = params ? params.get('edit') : null;
  const evt = editId ? window.eventStore.getEventById(editId) : null;
  const isEditMode = !!evt;

  const v = (field, fallback = '') => isEditMode && evt[field] !== undefined ? evt[field] : fallback;

  return `
    <div class="create-event-container">
      <div class="form-header">
        <h1 class="page-title">${isEditMode ? '✏️ Edit Event' : '🎉 Host a New Event'}</h1>
        <p class="page-subtitle">
          ${isEditMode
            ? `Editing: <strong>${evt.title}</strong>`
            : 'Fill out the details below to publish your event to the Convene platform.'}
        </p>
      </div>

      <div class="create-layout">
        <form id="create-event-form" class="glass-card main-form" data-edit-id="${isEditMode ? editId : ''}">

          <!-- Section 1: Basics -->
          <div class="form-section">
            <h3 class="form-section-title">1. Event Basics</h3>

            <div class="form-group">
              <label for="event-title">Event Title *</label>
              <input type="text" id="event-title" class="form-input"
                placeholder="e.g. NextGen Web Developers Summit 2026"
                value="${v('title')}" required>
              <span class="field-error"></span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="event-category">Category *</label>
                <select id="event-category" class="form-input" required>
                  ${['Technology', 'Design', 'Business', 'Music'].map(cat =>
                    `<option value="${cat}" ${v('category') === cat ? 'selected' : ''}>${cat}</option>`
                  ).join('')}
                </select>
                <span class="field-error"></span>
              </div>

              <div class="form-group">
                <label for="event-type">Format *</label>
                <select id="event-type" class="form-input" required>
                  ${['In-Person', 'Virtual', 'Hybrid'].map(t =>
                    `<option value="${t}" ${v('type') === t ? 'selected' : ''}>${t}</option>`
                  ).join('')}
                </select>
                <span class="field-error"></span>
              </div>
            </div>
          </div>

          <!-- Section 2: Date, Venue & Capacity -->
          <div class="form-section">
            <h3 class="form-section-title">2. Date, Venue & Capacity</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="event-date">Date & Time *</label>
                <input type="datetime-local" id="event-date" class="form-input"
                  value="${v('date')}" required>
                <span class="field-error"></span>
              </div>

              <div class="form-group">
                <label for="event-price">Ticket Price</label>
                <input type="text" id="event-price" class="form-input"
                  placeholder="e.g. Free or $99"
                  value="${v('price', 'Free')}">
                <span class="field-error"></span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="event-location">Location *</label>
                <input type="text" id="event-location" class="form-input"
                  placeholder="e.g. San Francisco, CA or Zoom Link"
                  value="${v('location')}" required>
                <span class="field-error"></span>
              </div>

              <div class="form-group">
                <label for="event-capacity">Capacity (Seats) *</label>
                <input type="number" id="event-capacity" class="form-input"
                  placeholder="100" min="1" max="100000"
                  value="${v('capacity', 150)}" required>
                <span class="field-error"></span>
              </div>
            </div>
          </div>

          <!-- Section 3: Details -->
          <div class="form-section">
            <h3 class="form-section-title">3. Details & Cover Image</h3>

            <div class="form-group">
              <label for="event-image">Cover Image URL</label>
              <input type="url" id="event-image" class="form-input"
                placeholder="https://images.unsplash.com/..."
                value="${v('image', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80')}">
              <span class="field-error"></span>
            </div>

            <div class="form-group">
              <label for="event-description">Event Description *</label>
              <textarea id="event-description" class="form-input form-textarea" rows="5"
                placeholder="Describe the event agenda, topics, speakers..." required>${v('description')}</textarea>
              <span class="field-error"></span>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <a href="${isEditMode ? `#event-detail?id=${editId}` : '#events'}" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary btn-lg">
              ${isEditMode ? '💾 Save Changes' : '🚀 Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
