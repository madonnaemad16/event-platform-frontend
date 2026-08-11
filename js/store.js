/**
 * Convene Event Management Platform - Data Store & LocalStorage Persistence
 * Handles Events Data and User Saved Favorites
 */

const INITIAL_EVENTS = [
  {
    id: "evt-101",
    title: "Global AI & Tech Summit 2026",
    category: "Technology",
    date: "2026-09-15T09:00",
    location: "San Francisco, CA",
    organizer: "Tech Global Network",
    type: "In-Person",
    capacity: 250,
    registered: 184,
    price: "$149",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    description: "Join tech leaders and developers for keynotes and workshops discussing artificial intelligence, cloud development, and web trends.",
    agenda: [
      { time: "09:00 AM", title: "Keynote: Tech Trends in 2026" },
      { time: "11:30 AM", title: "Workshop: Web Development Best Practices" },
      { time: "02:00 PM", title: "Panel Discussion & Q&A" }
    ],
    attendees: [
      { name: "Sarah Chen", email: "sarah@example.com", date: "2026-08-01" },
      { name: "Marcus Vance", email: "marcus@example.com", date: "2026-08-03" }
    ]
  },
  {
    id: "evt-102",
    title: "UI/UX Design Systems Workshop",
    category: "Design",
    date: "2026-09-22T10:00",
    location: "New York, NY",
    organizer: "Creative Designers Guild",
    type: "In-Person",
    capacity: 120,
    registered: 115,
    price: "$99",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    description: "Learn how to build accessible component libraries, design tokens, and user-friendly web layouts.",
    agenda: [
      { time: "10:00 AM", title: "Introduction to Design Tokens" },
      { time: "01:30 PM", title: "Building Accessible UI Components" }
    ],
    attendees: [
      { name: "Elena Rostova", email: "elena@example.com", date: "2026-07-28" }
    ]
  },
  {
    id: "evt-103",
    title: "Web Developers Hackathon",
    category: "Technology",
    date: "2026-10-05T08:00",
    location: "Online / Virtual",
    organizer: "Code Community",
    type: "Virtual",
    capacity: 500,
    registered: 342,
    price: "Free",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    description: "A 48-hour online coding event focused on building simple, fast web applications.",
    agenda: [
      { time: "08:00 AM", title: "Hackathon Opening & Guidelines" },
      { time: "12:00 PM", title: "Mentorship Office Hours" }
    ],
    attendees: []
  },
  {
    id: "evt-104",
    title: "Business & Startup Meetup",
    category: "Business",
    date: "2026-10-18T18:00",
    location: "Austin, TX",
    organizer: "Austin Business Club",
    type: "In-Person",
    capacity: 80,
    registered: 65,
    price: "$25",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    description: "An evening for startup founders and entrepreneurs to network, share ideas, and connect.",
    agenda: [
      { time: "06:00 PM", title: "Networking & Refreshments" },
      { time: "07:00 PM", title: "Speaker Session & Discussion" }
    ],
    attendees: []
  },
  {
    id: "evt-105",
    title: "Live Music & Arts Night",
    category: "Music",
    date: "2026-11-01T16:00",
    location: "Los Angeles, CA",
    organizer: "City Cultural Arts",
    type: "In-Person",
    capacity: 1500,
    registered: 1280,
    price: "$50",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    description: "An outdoor musical gathering featuring acoustic performances and local art exhibits.",
    agenda: [
      { time: "04:00 PM", title: "Gates Open & Opening Act" },
      { time: "08:00 PM", title: "Main Stage Performance" }
    ],
    attendees: []
  }
];

class EventStore {
  constructor() {
    this.storageKey = 'convene_events_data_v2';
    this.savedKey = 'convene_saved_events_v1';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_EVENTS));
    }
    if (!localStorage.getItem(this.savedKey)) {
      localStorage.setItem(this.savedKey, JSON.stringify([]));
    }
  }

  getEvents() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : INITIAL_EVENTS;
    } catch (e) {
      return INITIAL_EVENTS;
    }
  }

  saveEvents(events) {
    localStorage.setItem(this.storageKey, JSON.stringify(events));
  }

  getEventById(id) {
    const events = this.getEvents();
    return events.find(evt => evt.id === id) || null;
  }

  addEvent(eventData) {
    const events = this.getEvents();
    const newEvent = {
      id: `evt-${Date.now().toString().slice(-6)}`,
      registered: 0,
      attendees: [],
      agenda: eventData.agenda || [{ time: "09:00 AM", title: "Event Starts" }],
      ...eventData
    };
    events.unshift(newEvent);
    this.saveEvents(events);
    return newEvent;
  }

  updateEvent(id, eventData) {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Event not found');
    events[index] = { ...events[index], ...eventData };
    this.saveEvents(events);
    return events[index];
  }

  deleteEvent(id) {
    let events = this.getEvents();
    events = events.filter(e => e.id !== id);
    this.saveEvents(events);
    // Also remove from saved if present
    let savedIds = this.getSavedIds().filter(sid => sid !== id);
    localStorage.setItem(this.savedKey, JSON.stringify(savedIds));
  }

  registerAttendee(eventId, attendee) {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found");

    if (event.registered >= event.capacity) {
      throw new Error("Sorry, this event is full!");
    }

    // Prevent duplicate email
    event.attendees = event.attendees || [];
    const duplicate = event.attendees.find(a => a.email.toLowerCase() === attendee.email.toLowerCase());
    if (duplicate) {
      throw new Error("This email is already registered for this event.");
    }

    event.registered += 1;
    event.attendees.push({
      ...attendee,
      date: new Date().toISOString().split('T')[0]
    });
    this.saveEvents(events);
    return event;
  }

  cancelRegistration(eventId, attendeeEmail) {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found");

    const before = (event.attendees || []).length;
    event.attendees = (event.attendees || []).filter(
      a => a.email.toLowerCase() !== attendeeEmail.toLowerCase()
    );
    const after = event.attendees.length;

    if (before !== after) {
      event.registered = Math.max(0, event.registered - 1);
    }
    this.saveEvents(events);
    return event;
  }

  // Saved / Bookmarked Events
  getSavedIds() {
    try {
      const saved = localStorage.getItem(this.savedKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  isSaved(eventId) {
    return this.getSavedIds().includes(eventId);
  }

  toggleSaveEvent(eventId, forceState) {
    let savedIds = this.getSavedIds();
    const index = savedIds.indexOf(eventId);
    let isNowSaved = false;
    if (forceState === false || (forceState === undefined && index !== -1)) {
      savedIds = savedIds.filter(id => id !== eventId);
      isNowSaved = false;
    } else {
      if (index === -1) savedIds.push(eventId);
      isNowSaved = true;
    }
    localStorage.setItem(this.savedKey, JSON.stringify(savedIds));
    return isNowSaved;
  }

  getSavedEvents() {
    const savedIds = this.getSavedIds();
    return this.getEvents().filter(e => savedIds.includes(e.id));
  }

  getStats() {
    const events = this.getEvents();
    const now = new Date();

    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => new Date(e.date) > now).length;
    const totalRegistrations = events.reduce((sum, e) => sum + (e.registered || 0), 0);

    let mostPopularEvent = null;
    if (events.length > 0) {
      mostPopularEvent = events.reduce((best, e) =>
        (e.registered || 0) > (best.registered || 0) ? e : best
      , events[0]);
    }

    return {
      totalEvents,
      upcomingEvents,
      totalRegistrations,
      mostPopularEvent
    };
  }
}

window.eventStore = new EventStore();
