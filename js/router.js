/**
 * Convene Event Management Platform - Client Side Hash Router & View Engine
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentView = null;
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  addRoute(path, renderFn) {
    this.routes[path] = renderFn;
  }

  navigate(path) {
    window.location.hash = path;
  }

  getRouteInfo() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    const [path, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');
    return { path, params };
  }

  handleRoute() {
    const { path, params } = this.getRouteInfo();
    const container = document.getElementById('app-content');
    
    if (!container) return;

    // Update nav active states
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === `#${path}` || (href === '#dashboard' && path === '')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Fade out transition
    container.style.opacity = '0';
    container.style.transform = 'translateY(6px)';

    setTimeout(() => {
      // Find matching route handler
      let handler = this.routes[path];
      if (!handler && this.routes['*']) {
        handler = this.routes['*'];
      }

      if (handler) {
        container.innerHTML = handler(params);
        if (typeof window.onViewLoaded === 'function') {
          window.onViewLoaded(path, params);
        }
      } else {
        container.innerHTML = `<div class="error-view"><h2>404 - Page Not Found</h2><p>The requested page view does not exist.</p><a href="#dashboard" class="btn btn-primary">Back to Dashboard</a></div>`;
      }

      // Fade in transition
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
      window.scrollTo(0, 0);
    }, 150);
  }
}

window.router = new Router();
