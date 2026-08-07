// Yurexa State Management
// Cart, Watchlist, and Filters — all persisted to localStorage.

const Store = {
  // Storage keys
  keys: {
    cart: "yurexa_cart",
    watchlist: "yurexa_watchlist",
    savedForLater: "yurexa_saved_for_later",
    search: "yurexa_search",
    filter: "yurexa_filter",
    sort: "yurexa_sort"
  },

  // In-memory state
  state: {
    cart: [],
    watchlist: [],
    savedForLater: [],
    search: "",
    filter: "All",
    sort: "featured"
  },

  // Load state from localStorage on init
  init() {
    try {
      this.state.cart = JSON.parse(localStorage.getItem(this.keys.cart)) || [];
      this.state.watchlist = JSON.parse(localStorage.getItem(this.keys.watchlist)) || [];
      this.state.savedForLater = JSON.parse(localStorage.getItem(this.keys.savedForLater)) || [];
      this.state.search = localStorage.getItem(this.keys.search) || "";
      this.state.filter = localStorage.getItem(this.keys.filter) || "All";
      this.state.sort = localStorage.getItem(this.keys.sort) || "featured";
    } catch (e) {
      console.warn("Failed to load state:", e);
      this.state.cart = [];
      this.state.watchlist = [];
      this.state.savedForLater = [];
    }
    this.syncBadges();
  },

  // Persist a specific key
  save(key) {
    localStorage.setItem(this.keys[key], JSON.stringify(this.state[key]));
    this.syncBadges();
  },

  // Save non-array keys (search, filter, sort)
  saveRaw(key) {
    localStorage.setItem(this.keys[key], this.state[key]);
  },

  // --- Cart methods ---
  addToCart(movieId) {
    const existing = this.state.cart.find(item => item.id === movieId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.state.cart.push({ id: movieId, quantity: 1 });
    }
    this.save("cart");
    return true;
  },

  removeFromCart(movieId) {
    this.state.cart = this.state.cart.filter(item => item.id !== movieId);
    this.save("cart");
  },

  updateCartQuantity(movieId, quantity) {
    const item = this.state.cart.find(i => i.id === movieId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.save("cart");
    }
  },

  clearCart() {
    this.state.cart = [];
    this.save("cart");
  },

  getCartTotal() {
    return this.state.cart.reduce((total, item) => {
      const movie = MOVIES.find(m => m.id === item.id);
      return movie ? total + (movie.price * item.quantity) : total;
    }, 0);
  },

  getCartCount() {
    return this.state.cart.reduce((total, item) => total + item.quantity, 0);
  },

  // --- Saved for Later methods ---
  saveForLater(movieId) {
    // Remove from cart
    this.removeFromCart(movieId);
    // Add to saved for later if not already there
    if (!this.state.savedForLater.includes(movieId)) {
      this.state.savedForLater.push(movieId);
      this.save("savedForLater");
    }
    return true;
  },

  moveToCart(movieId) {
    // Remove from saved for later
    this.state.savedForLater = this.state.savedForLater.filter(id => id !== movieId);
    this.save("savedForLater");
    // Add to cart
    this.addToCart(movieId);
    return true;
  },

  removeFromSaved(movieId) {
    this.state.savedForLater = this.state.savedForLater.filter(id => id !== movieId);
    this.save("savedForLater");
  },

  isSavedForLater(movieId) {
    return this.state.savedForLater.includes(movieId);
  },

  // --- Watchlist methods ---
  toggleWatchlist(movieId) {
    const index = this.state.watchlist.indexOf(movieId);
    if (index > -1) {
      this.state.watchlist.splice(index, 1);
      this.save("watchlist");
      return false; // removed
    } else {
      this.state.watchlist.push(movieId);
      this.save("watchlist");
      return true; // added
    }
  },

  isInWatchlist(movieId) {
    return this.state.watchlist.includes(movieId);
  },

  addAllToCart() {
    const added = [];
    this.state.watchlist.forEach(movieId => {
      this.addToCart(movieId);
      added.push(movieId);
    });
    return added.length;
  },

  clearWatchlist() {
    const count = this.state.watchlist.length;
    this.state.watchlist = [];
    this.save("watchlist");
    return count;
  },

  // --- Filter/Sort methods ---
  setFilter(genre) {
    this.state.filter = genre;
    this.saveRaw("filter");
  },

  setSort(sortBy) {
    this.state.sort = sortBy;
    this.saveRaw("sort");
  },

  setSearch(query) {
    this.state.search = query;
    this.saveRaw("search");
  },

  // Filter and sort the movie list
  getFilteredMovies() {
    let movies = [...MOVIES];

    // Genre filter
    if (this.state.filter !== "All") {
      movies = movies.filter(m => m.genre === this.state.filter);
    }

    // Search
    if (this.state.search.trim()) {
      const q = this.state.search.toLowerCase().trim();
      movies = movies.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        m.cast.some(actor => actor.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (this.state.sort) {
      case "rating":
        movies.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        movies.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        movies.sort((a, b) => b.price - a.price);
        break;
      case "year":
        movies.sort((a, b) => b.year - a.year);
        break;
      case "title":
        movies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // featured
        movies.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return movies;
  },

  // Update nav badges with a subtle pop animation
  syncBadges() {
    const cartBadge = document.getElementById("cartBadge");
    const watchlistBadge = document.getElementById("watchlistBadge");
    if (cartBadge) {
      cartBadge.textContent = this.getCartCount();
      this.animateBadge(cartBadge);
    }
    if (watchlistBadge) {
      watchlistBadge.textContent = this.state.watchlist.length;
      this.animateBadge(watchlistBadge);
    }
  },

  // Add a pop animation to a badge
  animateBadge(badge) {
    badge.classList.remove("badge-pop");
    void badge.offsetWidth; // restart animation
    badge.classList.add("badge-pop");
  }
};

// Initialize store
Store.init();
