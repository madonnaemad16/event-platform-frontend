/**
 * Convene Event Management Platform - Main Application Bootstrap & Event Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register Routes
  window.router.addRoute('dashboard', () => renderDashboardView());
  window.router.addRoute('events', (params) => renderEventsView(params));
  window.router.addRoute('event-detail', (params) => renderEventDetailView(params));
  window.router.addRoute('create', () => renderCreateEventView());
  window.router.addRoute('*', () => renderDashboardView());

  // Global View Loaded Lifecycle Callback
  window.onViewLoaded = (path, params) => {
    attachViewEventListeners(path, params);
  };

  // Initial routing
  window.router.handleRoute();
});

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

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Attach View Specific Handlers
function attachViewEventListeners(path, params) {
  // 1. Search Bar Event Listener in Events View
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

    if (searchBtn) {
      searchBtn.addEventListener('click', handleSearch);
    }
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  // 2. RSVP Form Handler in Event Details View
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const eventId = rsvpForm.getAttribute('data-event-id');
      const name = document.getElementById('rsvp-name').value.trim();
      const email = document.getElementById('rsvp-email').value.trim();

      try {
        window.eventStore.registerAttendee(eventId, { name, email });
        showToast(`Success! ${name}, your seat has been reserved! 🎉`, 'success');
        // Refresh detail view
        window.router.handleRoute();
      } catch (err) {
        showToast(err.message || 'Registration failed', 'error');
      }
    });
  }

  // 3. Delete Event Button in Event Details View
  const deleteBtn = document.getElementById('btn-delete-event');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      const eventId = deleteBtn.getAttribute('data-event-id');
      if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        window.eventStore.deleteEvent(eventId);
        showToast('Event removed successfully', 'success');
        window.location.hash = '#events';
      }
    });
  }

  // 4. Create Event Form Handler
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

      showToast(`'${title}' is now live! ✨`, 'success');
      window.location.hash = `#event-detail?id=${newEvent.id}`;
    });
  }
}
