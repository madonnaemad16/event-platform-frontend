/**
 * Convene Event Management Platform - Data Store & LocalStorage Persistence
 */

const INITIAL_EVENTS = [
  {
    id: "evt-101",
    title: "Global AI & Next-Gen Tech Summit 2026",
    category: "Technology",
    date: "2026-09-15T09:00",
    location: "Convention Center, San Francisco & Online",
    type: "Hybrid",
    capacity: 250,
    registered: 184,
    price: "$149",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    description: "Join world-class AI researchers and engineering leaders discussing autonomous agents, generative models, and scalable cloud infrastructure.",
    agenda: [
      { time: "09:00 AM", title: "Keynote: The Future of Autonomous AI Systems" },
      { time: "11:30 AM", title: "Panel: Scaling Deep Learning Pipelines" },
      { time: "02:00 PM", title: "Hands-on Workshop: Building Agentic Workflows" }
    ],
    attendees: [
      { name: "Sarah Chen", email: "sarah.chen@tech.io", date: "2026-08-01" },
      { name: "Marcus Vance", email: "marcus@devlabs.com", date: "2026-08-03" }
    ]
  },
  {
    id: "evt-102",
    title: "UX/UI Design Systems Conference",
    category: "Design",
    date: "2026-09-22T10:00",
    location: "Design Hub Auditorium, New York",
    type: "In-Person",
    capacity: 120,
    registered: 115,
    price: "$99",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    description: "Master multi-brand tokenized design systems, accessible UI components, and dynamic micro-interactions for modern web and mobile apps.",
    agenda: [
      { time: "10:00 AM", title: "Building Accessible Micro-Interactions" },
      { time: "01:30 PM", title: "Design Tokens at Enterprise Scale" }
    ],
    attendees: [
      { name: "Elena Rostova", email: "elena@designcraft.com", date: "2026-07-28" }
    ]
  },
  {
    id: "evt-103",
    title: "Indie Web Developers Hackathon",
    category: "Technology",
    date: "2026-10-05T08:00",
    location: "Virtual (Discord & YouTube Live)",
    type: "Virtual",
    capacity: 500,
    registered: 342,
    price: "Free",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    description: "A 48-hour global online hackathon focused on building high-performance, lightweight web applications without bloated frameworks.",
    agenda: [
      { time: "08:00 AM", title: "Kickoff & Challenge Announcements" },
      { time: "12:00 PM", title: "Mid-way Mentor Office Hours" }
    ],
    attendees: []
  },
  {
    id: "evt-104",
    title: "SaaS Founder & Investor Fireside Chat",
    category: "Business",
    date: "2026-10-18T18:00",
    location: "Skyline Lounge, Austin, TX",
    type: "In-Person",
    capacity: 80,
    registered: 65,
    price: "$75",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    description: "An intimate evening connecting early-stage founders with venture capital partners discussing fundraising, product-market fit, and scaling strategy.",
    agenda: [
      { time: "06:00 PM", title: "Networking & Welcome Drinks" },
      { time: "07:00 PM", title: "Fireside Chat: Navigating Series A in 2026" }
    ],
    attendees: []
  },
  {
    id: "evt-105",
    title: "Neon Pulse Electronic Music & Arts Festival",
    category: "Music",
    date: "2026-11-01T16:00",
    location: "Metropolis Outdoor Arena, Los Angeles",
    type: "In-Person",
    capacity: 1500,
    registered: 1280,
    price: "$120",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    description: "Immersive audio-visual festival featuring world-renowned electronic producers, generative light art installations, and synth performances.",
    agenda: [
      { time: "04:00 PM", title: "Doors Open & Ambient Stage" },
      { time: "08:00 PM", title: "Headliner Live Set & Laser Show" }
    ],
    attendees: []
  }
];

class EventStore {
  constructor() {
    this.storageKey = 'convene_events_data_v1';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_EVENTS));
    }
  }

  getEvents() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : INITIAL_EVENTS;
    } catch (e) {
      console.error("Error reading events from localStorage", e);
      return INITIAL_EVENTS;
    }
  }

  saveEvents(events) {
    localStorage.setItem(this.storageKey, JSON.stringify(events));
  }

  getEventById(id) {
    const events = this.getEvents();
    return events.find(evt => evt.id === id);
  }

  addEvent(eventData) {
    const events = this.getEvents();
    const newEvent = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      registered: 0,
      attendees: [],
      agenda: eventData.agenda || [{ time: "09:00 AM", title: "Event Commencement" }],
      ...eventData
    };
    events.unshift(newEvent);
    this.saveEvents(events);
    return newEvent;
  }

  updateEvent(id, updatedData) {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedData };
      this.saveEvents(events);
      return events[index];
    }
    return null;
  }

  deleteEvent(id) {
    let events = this.getEvents();
    events = events.filter(e => e.id !== id);
    this.saveEvents(events);
  }

  registerAttendee(eventId, attendee) {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (event) {
      if (event.registered >= event.capacity) {
        throw new Error("This event is fully booked!");
      }
      event.registered += 1;
      event.attendees = event.attendees || [];
      event.attendees.push({
        ...attendee,
        date: new Date().toISOString().split('T')[0]
      });
      this.saveEvents(events);
      return event;
    }
    throw new Error("Event not found");
  }

  getStats() {
    const events = this.getEvents();
    const totalEvents = events.length;
    const totalRegistered = events.reduce((sum, e) => sum + (e.registered || 0), 0);
    const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
    const availableSeats = Math.max(0, totalCapacity - totalRegistered);
    
    // Find most popular category
    const categoryCounts = {};
    events.forEach(e => {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    });
    let topCategory = 'Technology';
    let maxCount = 0;
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCategory = cat;
      }
    });

    return {
      totalEvents,
      totalRegistered,
      availableSeats,
      topCategory
    };
  }

  resetToDefault() {
    localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
}

window.eventStore = new EventStore();
