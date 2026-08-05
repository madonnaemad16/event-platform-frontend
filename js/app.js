/**
 * Convene Event Management Platform - Application Bootstrap & Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register Routes
  window.router.addRoute('dashboard', () => renderDashboardView());
  window.router.addRoute('events', (params) => renderEventsView(params));
  window.router.addRoute('saved', () => renderSavedEventsView());
  window.router.addRoute('event-detail', (params) => renderEventDetailView(params));
  window.router.addRoute('create', () => renderCreateEventView());
  window.router.addRoute('*', () => renderDashboardView());

  // Global View Loaded Lifecycle Callback
  window.onViewLoaded = (path, params) => {
    attachViewEventListeners(path, params);
    updateSavedBadge();
  };

  // Initial badge setup & routing
  updateSavedBadge();
  window.router.handleRoute();
});

// Update Saved Badge Counter in Navbar
function updateSavedBadge() {
  const badge = document.getElementById('saved-badge');
  if (badge && window.eventStore) {
    const savedCount = window.eventStore.getSavedIds().length;
    badge.textContent = savedCount;
  }
}

// Toast notification helper
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : '⚠️'}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Attach View Event Listeners
function attachViewEventListeners(path, params) {
  // 1. Favorite Heart Button Delegate Handler
  document.querySelectorAll('.btn-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const eventId = btn.getAttribute('data-event-id');
      const isNowSaved = window.eventStore.toggleSaveEvent(eventId);
      
      updateSavedBadge();

      if (isNowSaved) {
        btn.classList.add('active');
        btn.innerHTML = '❤️';
        showToast('Event saved to favorites! ❤️', 'success');
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '🤍';
        showToast('Event removed from saved list.', 'success');
        
        // If on saved page, re-render
        if (path === 'saved') {
          window.router.handleRoute();
        }
      }
    });
  });

  // 2. Search Bar Listener in Events View
  const searchInput = document.getElementById('event-search-input');
  const searchBtn = document.getElementById('btn-search-trigger');
  
  if (searchInput) {
    const handleSearch = () => {
      const query = searchInput.value.trim();
      const cat = params.get('category') || 'All';
      let hash = `#events?category=${encodeURIComponent(cat)}`;
      if (query) {
        hash += `&search=${encodeURIComponent(query)}`;
      }
      window.location.hash = hash;
    };

    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  // 3. RSVP Form Handler
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const eventId = rsvpForm.getAttribute('data-event-id');
      const name = document.getElementById('rsvp-name').value.trim();
      const email = document.getElementById('rsvp-email').value.trim();

      try {
        window.eventStore.registerAttendee(eventId, { name, email });
        showToast(`Success! ${name}, your registration is confirmed! 🎉`, 'success');
        window.router.handleRoute();
      } catch (err) {
        showToast(err.message || 'Registration failed', 'error');
      }
    });
  }

  // 4. Delete Event Button
  const deleteBtn = document.getElementById('btn-delete-event');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      const eventId = deleteBtn.getAttribute('data-event-id');
      if (confirm('Are you sure you want to delete this event?')) {
        window.eventStore.deleteEvent(eventId);
        showToast('Event deleted successfully.', 'success');
        window.location.hash = '#events';
      }
    });
  }

  // 5. Create Event Form Handler
  const createForm = document.getElementById('create-event-form');
  if (createForm) {
    createForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('event-title').value.trim();
      const category = document.getElementById('event-category').value;
      const type = document.getElementById('event-type').value;
      const date = document.getElementById('event-date').value;
      const price = document.getElementById('event-price').value.trim();
      const location = document.getElementById('event-location').value.trim();
      const capacity = parseInt(document.getElementById('event-capacity').value, 10);
      const image = document.getElementById('event-image').value.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
      const description = document.getElementById('event-description').value.trim();

      const newEvent = window.eventStore.addEvent({
        title,
        category,
        type,
        date,
        price,
        location,
        capacity,
        image,
        description
      });

      showToast(`'${title}' created successfully! ✨`, 'success');
      window.location.hash = `#event-detail?id=${newEvent.id}`;
    });
  }
}
