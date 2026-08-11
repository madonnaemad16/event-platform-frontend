/**
 * Convene Event Management Platform - Application Bootstrap & Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register Routes
  window.router.addRoute('dashboard', () => renderDashboardView());
  window.router.addRoute('events', (params) => renderEventsView(params));
  window.router.addRoute('event-detail', (params) => renderEventDetailView(params));
  window.router.addRoute('create', (params) => renderCreateEventView(params));
  window.router.addRoute('saved', () => renderSavedEventsView());
  window.router.addRoute('*', () => renderDashboardView());

  // Global View Loaded Lifecycle Callback
  window.onViewLoaded = (path, params) => {
    updateActiveNavLink(path);
    attachViewEventListeners(path, params);
  };

  // Initial routing
  window.router.handleRoute();
});

// ─── Nav Active State ────────────────────────────────────────────────────────
function updateActiveNavLink(path) {
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const map = { dashboard: 'nav-dashboard', events: 'nav-events', create: 'nav-create' };
  const activeId = map[path];
  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) el.classList.add('active');
  }
}

// ─── Toast Notifications ──────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

// ─── Confirmation Modal ───────────────────────────────────────────────────────
function showModal(message, onConfirm, confirmLabel = 'Delete') {
  const overlay = document.getElementById('confirm-modal');
  const msgEl = document.getElementById('modal-message');
  const confirmBtn = document.getElementById('modal-confirm-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');

  msgEl.textContent = message;
  confirmBtn.textContent = confirmLabel;
  overlay.classList.add('open');

  // Clone buttons to remove old listeners
  const newConfirm = confirmBtn.cloneNode(true);
  const newCancel = cancelBtn.cloneNode(true);
  confirmBtn.replaceWith(newConfirm);
  cancelBtn.replaceWith(newCancel);

  function close() { overlay.classList.remove('open'); }

  newConfirm.addEventListener('click', () => { close(); onConfirm(); });
  newCancel.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
}
window.showModal = showModal;

// ─── Attach All View Event Listeners ─────────────────────────────────────────
function attachViewEventListeners(path, params) {

  // 1. Favorite Heart Buttons
  document.querySelectorAll('.btn-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const eventId = btn.getAttribute('data-event-id');
      const isNowSaved = window.eventStore.toggleSaveEvent(eventId);
      btn.classList.toggle('active', isNowSaved);
      btn.innerHTML = isNowSaved ? '❤️' : '🤍';
      showToast(isNowSaved ? 'Event saved! ❤️' : 'Removed from saved.', 'success');
    });
  });

  // 2. Search Bar (Events view)
  const searchInput = document.getElementById('event-search-input');
  const searchBtn = document.getElementById('btn-search-trigger');
  const clearBtn = document.getElementById('btn-clear-filters');

  if (searchInput) {
    const doSearch = () => {
      const query = searchInput.value.trim();
      const cat = document.getElementById('filter-category')?.value || 'All';
      const loc = document.getElementById('filter-location')?.value.trim() || '';
      const date = document.getElementById('filter-date')?.value || '';

      let hash = '#events?';
      const parts = [];
      if (cat && cat !== 'All') parts.push(`category=${encodeURIComponent(cat)}`);
      if (query) parts.push(`search=${encodeURIComponent(query)}`);
      if (loc) parts.push(`location=${encodeURIComponent(loc)}`);
      if (date) parts.push(`date=${encodeURIComponent(date)}`);
      window.location.hash = hash + parts.join('&');
    };

    if (searchBtn) searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });
    document.getElementById('filter-category')?.addEventListener('change', doSearch);
    document.getElementById('filter-location')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });
    document.getElementById('filter-date')?.addEventListener('change', doSearch);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => { window.location.hash = '#events'; });
  }

  // 3. Delete Event Buttons (on cards in Events list)
  document.querySelectorAll('.btn-delete-event').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const eventId = btn.getAttribute('data-event-id');
      const event = window.eventStore.getEventById(eventId);
      showModal(
        `Delete "${event ? event.title : 'this event'}"? This cannot be undone.`,
        () => {
          window.eventStore.deleteEvent(eventId);
          showToast('Event deleted.', 'success');
          window.router.handleRoute();
        }
      );
    });
  });

  // 4. Delete button in Event Detail view
  const detailDeleteBtn = document.getElementById('btn-delete-event-detail');
  if (detailDeleteBtn) {
    detailDeleteBtn.addEventListener('click', () => {
      const eventId = detailDeleteBtn.getAttribute('data-event-id');
      const event = window.eventStore.getEventById(eventId);
      showModal(
        `Delete "${event ? event.title : 'this event'}"? This cannot be undone.`,
        () => {
          window.eventStore.deleteEvent(eventId);
          showToast('Event deleted.', 'success');
          window.location.hash = '#events';
        }
      );
    });
  }

  // 5. Cancel Registration buttons (Event Detail)
  document.querySelectorAll('.btn-cancel-registration').forEach(btn => {
    btn.addEventListener('click', () => {
      const eventId = btn.getAttribute('data-event-id');
      const email = btn.getAttribute('data-email');
      showModal(
        `Cancel registration for ${email}?`,
        () => {
          try {
            window.eventStore.cancelRegistration(eventId, email);
            showToast('Registration cancelled.', 'success');
            window.router.handleRoute();
          } catch (err) {
            showToast(err.message || 'Failed to cancel.', 'error');
          }
        },
        'Cancel Registration'
      );
    });
  });

  // 6. RSVP Form (Event Detail)
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const eventId = rsvpForm.getAttribute('data-event-id');
      const name = document.getElementById('rsvp-name').value.trim();
      const email = document.getElementById('rsvp-email').value.trim();

      try {
        window.eventStore.registerAttendee(eventId, { name, email });
        showToast(`${name}, your registration is confirmed! 🎉`, 'success');
        window.router.handleRoute();
      } catch (err) {
        showToast(err.message || 'Registration failed.', 'error');
      }
    });
  }

  // 7. Create / Edit Event Form
  const createForm = document.getElementById('create-event-form');
  if (createForm) {
    createForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = {
        title: document.getElementById('event-title'),
        category: document.getElementById('event-category'),
        location: document.getElementById('event-location'),
        date: document.getElementById('event-date'),
        capacity: document.getElementById('event-capacity'),
        description: document.getElementById('event-description'),
      };

      // Clear previous errors
      document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
      document.querySelectorAll('.form-input').forEach(el => el.classList.remove('input-error'));

      // Validate
      let hasError = false;
      const showError = (fieldEl, msg) => {
        fieldEl.classList.add('input-error');
        const errorEl = fieldEl.parentElement.querySelector('.field-error');
        if (errorEl) errorEl.textContent = msg;
        hasError = true;
      };

      if (!fields.title.value.trim()) showError(fields.title, 'Event title is required.');
      if (!fields.category.value) showError(fields.category, 'Please select a category.');
      if (!fields.location.value.trim()) showError(fields.location, 'Location is required.');
      if (!fields.date.value) showError(fields.date, 'Date and time is required.');

      const capacityVal = parseInt(fields.capacity.value, 10);
      if (!fields.capacity.value || isNaN(capacityVal) || capacityVal < 1) {
        showError(fields.capacity, 'Capacity must be a number greater than 0.');
      }
      if (!fields.description.value.trim()) showError(fields.description, 'Description is required.');

      if (hasError) return;

      const editId = createForm.getAttribute('data-edit-id');
      const eventData = {
        title: fields.title.value.trim(),
        category: fields.category.value,
        type: document.getElementById('event-type').value,
        date: fields.date.value,
        price: document.getElementById('event-price').value.trim() || 'Free',
        location: fields.location.value.trim(),
        capacity: capacityVal,
        image: document.getElementById('event-image').value.trim() ||
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        description: fields.description.value.trim()
      };

      if (editId) {
        // Edit mode — update existing event
        const updated = window.eventStore.updateEvent(editId, eventData);
        showToast(`"${updated.title}" updated successfully! ✨`, 'success');
        window.location.hash = `#event-detail?id=${editId}`;
      } else {
        // Create mode — add new event
        const newEvent = window.eventStore.addEvent(eventData);
        showToast(`"${newEvent.title}" created successfully! 🎉`, 'success');
        window.location.hash = '#events';
      }
    });
  }
}
