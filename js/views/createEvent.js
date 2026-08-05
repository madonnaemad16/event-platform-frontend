/**
 * Create & Edit Event View Component
 */

function renderCreateEventView() {
  return `
    <div class="create-event-container">
      <div class="form-header">
        <h1 class="page-title">Host a New Event</h1>
        <p class="page-subtitle">Fill out the details below to publish your event to the Convene platform.</p>
      </div>

      <div class="create-layout">
        <!-- Event Form -->
        <form id="create-event-form" class="glass-card main-form">
          <div class="form-section">
            <h3 class="form-section-title">1. Event Basics</h3>
            
            <div class="form-group">
              <label for="event-title">Event Title *</label>
              <input type="text" id="event-title" class="form-input" placeholder="e.g. NextGen Web Developers Summit 2026" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="event-category">Category *</label>
                <select id="event-category" class="form-input" required>
                  <option value="Technology">Technology</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Music">Music</option>
                </select>
              </div>

              <div class="form-group">
                <label for="event-type">Format *</label>
                <select id="event-type" class="form-input" required>
                  <option value="Hybrid">Hybrid</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="form-section-title">2. Date, Venue & Capacity</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="event-date">Date & Time *</label>
                <input type="datetime-local" id="event-date" class="form-input" required>
              </div>

              <div class="form-group">
                <label for="event-price">Ticket Price *</label>
                <input type="text" id="event-price" class="form-input" placeholder="e.g. Free or $99" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="event-location">Location / Virtual Link *</label>
                <input type="text" id="event-location" class="form-input" placeholder="e.g. San Francisco Tech Center or Zoom Link" required>
              </div>

              <div class="form-group">
                <label for="event-capacity">Total Capacity (Seats) *</label>
                <input type="number" id="event-capacity" class="form-input" placeholder="100" min="1" max="10000" value="150" required>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="form-section-title">3. Details & Cover Banner</h3>
            
            <div class="form-group">
              <label for="event-image">Cover Image URL</label>
              <input type="url" id="event-image" class="form-input" placeholder="https://images.unsplash.com/photo-..." value="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80">
            </div>

            <div class="form-group">
              <label for="event-description">Event Description *</label>
              <textarea id="event-description" class="form-input form-textarea" rows="5" placeholder="Provide a detailed description of the event agenda, topics, speakers..." required></textarea>
            </div>
          </div>

          <div class="form-actions">
            <a href="#events" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary btn-lg">Publish Event Live ✨</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
