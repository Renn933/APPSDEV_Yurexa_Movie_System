// Yurexa Components
// Reusable rendering helpers and view templates.

// --- Utility helpers ---

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function formatRuntime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast toast--${type} toast--show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("toast--show");
  }, 2500);
}

function emptyState(icon, title, message, actionHTML = "") {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">
        <i class="fas ${icon}"></i>
      </div>
      <h2 class="empty-state__title">${title}</h2>
      <p class="empty-state__message">${message}</p>
      ${actionHTML}
    </div>
  `;
}

// --- Movie card component ---

function movieCard(movie, compact = false) {
  const inWatchlist = Store.isInWatchlist(movie.id);
  return `
    <article class="movie-card" data-movie-id="${movie.id}">
      <div class="movie-card__poster" data-action="view-details" data-id="${movie.id}" role="button" tabindex="0" style="background-image: url('${movie.poster}')">
        ${movie.featured ? '<span class="movie-card__badge">Featured</span>' : ""}
        <button class="movie-card__favorite ${inWatchlist ? "is-active" : ""}" data-action="toggle-watchlist" data-id="${movie.id}">
          <i class="fas fa-heart"></i>
        </button>
        <div class="movie-card__overlay">
          <button class="btn btn--primary btn--sm" data-action="view-details" data-id="${movie.id}">View Details</button>
        </div>
      </div>
      <div class="movie-card__body">
        <h3 class="movie-card__title">${movie.title}</h3>
        <div class="movie-card__meta">
          <span class="movie-card__year">${movie.year}</span>
          <span class="movie-card__genre">${movie.genre}</span>
          <span class="movie-card__rating"><i class="fas fa-star"></i> ${movie.rating}</span>
        </div>
        <div class="movie-card__actions">
          <button class="btn btn--primary btn--sm" data-action="add-to-cart" data-id="${movie.id}">
            <i class="fas fa-cart-plus"></i> ${formatPrice(movie.price)}
          </button>
        </div>
      </div>
    </article>
  `;
}

// --- View: Home ---

function viewHome() {
  const featured = MOVIES.filter(m => m.featured).slice(0, 4);
  const latest = [...MOVIES].sort((a, b) => b.year - a.year).slice(0, 4);

  return `
    <section class="hero">
      <div class="hero__content">
        <h1 class="hero__title">Discover Your Next<br /><span>Favorite Film</span></h1>
        <p class="hero__subtitle">Browse, save, and rent the best movies — all in one place.</p>
        <div class="hero__actions">
          <button class="btn btn--primary btn--lg" data-action="go-browse">
            <i class="fas fa-film"></i> Browse Movies
          </button>
          <button class="btn btn--ghost btn--lg" data-action="go-featured">
            <i class="fas fa-star"></i> View Featured
          </button>
        </div>
      </div>
      <div class="hero__visual">
        <div class="hero__poster-stack">
          ${featured.slice(0, 3).map((m, i) => `
            <div class="hero__poster hero__poster--${i + 1}" style="background-image: url('${m.poster}')">
              <span class="hero__poster-title">${m.title}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__header">
        <h2 class="section__title">Featured Films</h2>
        <a href="#" class="section__link" data-action="go-browse">See all →</a>
      </div>
      <div class="movie-grid">
        ${featured.map(m => movieCard(m)).join("")}
      </div>
    </section>

    <section class="section section--alt">
      <div class="section__header">
        <h2 class="section__title">New Releases</h2>
        <a href="#" class="section__link" data-action="go-browse">See all →</a>
      </div>
      <div class="movie-grid">
        ${latest.map(m => movieCard(m)).join("")}
      </div>
    </section>

    <section class="section">
      <div class="genre-cta">
        <h2 class="genre-cta__title">Explore by Genre</h2>
        <div class="genre-cta__chips">
          ${GENRES.map(g => `<button class="chip" data-action="filter-genre" data-genre="${g}">${g}</button>`).join("")}
        </div>
      </div>
    </section>
  `;
}

// --- View: Browse ---

function viewBrowse() {
  const movies = Store.getFilteredMovies();
  const currentFilter = Store.state.filter;
  const currentSort = Store.state.sort;
  const search = Store.state.search;

  const filterButtons = ["All", ...GENRES].map(genre => `
    <button class="chip ${currentFilter === genre ? "chip--active" : ""}" data-action="filter-genre" data-genre="${genre}">
      ${genre}
    </button>
  `).join("");

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "rating", label: "Top Rated" },
    { value: "year", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "title", label: "Title A–Z" }
  ];

  const sortSelect = `
    <div class="select-wrap">
      <select class="select" data-action="sort-movies">
        ${sortOptions.map(opt => `<option value="${opt.value}" ${currentSort === opt.value ? "selected" : ""}>${opt.label}</option>`).join("")}
      </select>
      <i class="fas fa-chevron-down select__icon"></i>
    </div>
  `;

  let content;
  if (movies.length === 0) {
    content = emptyState(
      "fa-film",
      "No movies found",
      `No results match your search for "${search}". Try a different keyword or clear your filters.`,
      `<button class="btn btn--primary" data-action="clear-filters">Clear Filters</button>`
    );
  } else {
    content = `<div class="movie-grid">${movies.map(m => movieCard(m)).join("")}</div>`;
  }

  return `
    <section class="page-hero">
      <h1 class="page-hero__title">Browse Movies</h1>
      <p class="page-hero__subtitle">Explore our collection of ${MOVIES.length} films.</p>
    </section>

    <section class="browse-toolbar">
      <div class="search-bar">
        <i class="fas fa-search search-bar__icon"></i>
        <input
          type="text"
          class="search-bar__input"
          placeholder="Search by title, genre, or actor..."
          value="${search}"
          data-action="search-movies"
          id="searchInput"
        />
        ${search ? `<button class="search-bar__clear" data-action="clear-search" aria-label="Clear search">&times;</button>` : ""}
      </div>
      ${sortSelect}
    </section>

    <section class="browse-filters">
      ${filterButtons}
    </section>

    <section class="section">
      <div class="browse-count">${movies.length} movie${movies.length !== 1 ? "s" : ""} shown</div>
      ${content}
    </section>
  `;
}

// --- View: Watchlist ---

function viewWatchlist() {
  const watchlistMovies = MOVIES.filter(m => Store.state.watchlist.includes(m.id));

  let content;
  if (watchlistMovies.length === 0) {
    content = emptyState(
      "fa-heart",
      "Your watchlist is empty",
      "Save movies you want to watch later by tapping the heart icon on any movie.",
      `<button class="btn btn--primary" data-action="go-browse">Browse Movies</button>`
    );
  } else {
    content = `
      <div class="watchlist-toolbar">
        <button class="btn btn--primary" data-action="add-all-to-cart">
          <i class="fas fa-cart-plus"></i> Add All to Cart (${watchlistMovies.length})
        </button>
        <button class="btn btn--ghost" data-action="clear-watchlist">
          <i class="fas fa-trash"></i> Clear Watchlist
        </button>
      </div>
      <div class="movie-grid">
        ${watchlistMovies.map(m => `
          <article class="movie-card" data-movie-id="${m.id}">
            <div class="movie-card__poster" data-action="view-details" data-id="${m.id}" role="button" tabindex="0" style="background-image: url('${m.poster}')">
              <button class="movie-card__favorite is-active" data-action="toggle-watchlist" data-id="${m.id}">
                <i class="fas fa-heart"></i>
              </button>
              <div class="movie-card__overlay">
                <button class="btn btn--primary btn--sm" data-action="view-details" data-id="${m.id}">View Details</button>
              </div>
            </div>
            <div class="movie-card__body">
              <h3 class="movie-card__title">${m.title}</h3>
              <div class="movie-card__meta">
                <span class="movie-card__year">${m.year}</span>
                <span class="movie-card__genre">${m.genre}</span>
                <span class="movie-card__rating"><i class="fas fa-star"></i> ${m.rating}</span>
              </div>
              <div class="movie-card__actions movie-card__actions--stack">
                <button class="btn btn--primary btn--sm" data-action="add-to-cart" data-id="${m.id}">
                  <i class="fas fa-cart-plus"></i> ${formatPrice(m.price)}
                </button>
                <button class="btn btn--ghost btn--sm" data-action="toggle-watchlist" data-id="${m.id}">
                  <i class="fas fa-times"></i> Remove
                </button>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  return `
    <section class="page-hero">
      <h1 class="page-hero__title">My Watchlist</h1>
      <p class="page-hero__subtitle">${watchlistMovies.length} saved movie${watchlistMovies.length !== 1 ? "s" : ""}</p>
    </section>
    <section class="section">
      ${content}
    </section>
  `;
}

// --- View: Cart ---

function viewCart() {
  const cartItems = Store.state.cart
    .map(item => {
      const movie = MOVIES.find(m => m.id === item.id);
      return movie ? { ...item, movie } : null;
    })
    .filter(Boolean);

  const savedItems = Store.state.savedForLater
    .map(id => MOVIES.find(m => m.id === id))
    .filter(Boolean);

  const total = Store.getCartTotal();
  const count = Store.getCartCount();

  let content;
  if (cartItems.length === 0 && savedItems.length === 0) {
    content = emptyState(
      "fa-shopping-cart",
      "Your cart is empty",
      "Add movies to your cart to rent or buy them.",
      `<button class="btn btn--primary" data-action="go-browse">Browse Movies</button>`
    );
  } else {
    content = `
      <div class="cart-layout">
        <div class="cart-items">
          ${
            cartItems.length > 0
              ? cartItems.map(item => `
                  <div class="cart-item" data-movie-id="${item.movie.id}">
                    <div class="cart-item__poster" style="background-image: url('${item.movie.poster}')"></div>
                    <div class="cart-item__info">
                      <h3 class="cart-item__title">${item.movie.title}</h3>
                      <p class="cart-item__meta">${item.movie.year} • ${item.movie.genre} • ${formatRuntime(item.movie.runtime)}</p>
                      <p class="cart-item__price">${formatPrice(item.movie.price)} each</p>
                    </div>
                    <div class="cart-item__controls">
                      <div class="quantity-control">
                        <button class="quantity-control__btn" data-action="decrease-qty" data-id="${item.movie.id}" aria-label="Decrease quantity">−</button>
                        <span class="quantity-control__value">${item.quantity}</span>
                        <button class="quantity-control__btn" data-action="increase-qty" data-id="${item.movie.id}" aria-label="Increase quantity">+</button>
                      </div>
                      <span class="cart-item__subtotal">${formatPrice(item.movie.price * item.quantity)}</span>
                      <div class="cart-item__actions">
                        <button class="btn btn--secondary btn--sm" data-action="save-for-later" data-id="${item.movie.id}">
                          <i class="fas fa-clock"></i> Save for Later
                        </button>
                        <button class="btn btn--danger btn--sm" data-action="remove-from-cart" data-id="${item.movie.id}">
                          <i class="fas fa-trash"></i> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                `).join("")
              : `<div class="cart-empty-note">
                  <i class="fas fa-shopping-cart"></i>
                  <p>Your cart is empty. Check your saved items below or browse more movies.</p>
                  <button class="btn btn--primary btn--sm" data-action="go-browse">Browse Movies</button>
                </div>`
          }

          ${
            savedItems.length > 0
              ? `
                <div class="saved-section">
                  <h3 class="saved-section__title">
                    <i class="fas fa-clock"></i> Saved for Later (${savedItems.length})
                  </h3>
                  <div class="saved-items">
                    ${savedItems.map(movie => `
                      <div class="saved-item" data-movie-id="${movie.id}">
                        <div class="saved-item__poster" style="background-image: url('${movie.poster}')"></div>
                        <div class="saved-item__info">
                          <h4 class="saved-item__title">${movie.title}</h4>
                          <p class="saved-item__meta">${movie.year} • ${movie.genre} • ${formatRuntime(movie.runtime)}</p>
                          <p class="saved-item__price">${formatPrice(movie.price)}</p>
                        </div>
                        <div class="saved-item__actions">
                          <button class="btn btn--primary btn--sm" data-action="move-to-cart" data-id="${movie.id}">
                            <i class="fas fa-cart-plus"></i> Move to Cart
                          </button>
                          <button class="btn btn--ghost btn--sm" data-action="remove-from-saved" data-id="${movie.id}">
                            <i class="fas fa-times"></i> Remove
                          </button>
                        </div>
                      </div>
                    `).join("")}
                  </div>
                </div>
              `
              : ""
          }
        </div>

        <aside class="cart-summary">
          <h3 class="cart-summary__title">Order Summary</h3>
          <div class="cart-summary__row">
            <span>Items</span>
            <span>${count}</span>
          </div>
          <div class="cart-summary__row">
            <span>Subtotal</span>
            <span>${formatPrice(total)}</span>
          </div>
          <div class="cart-summary__row">
            <span>Tax (5%)</span>
            <span>${formatPrice(total * 0.05)}</span>
          </div>
          <div class="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>${formatPrice(total * 1.05)}</span>
          </div>
          <button class="btn btn--primary btn--block" data-action="go-checkout" ${cartItems.length === 0 ? "disabled" : ""}>
            <i class="fas fa-credit-card"></i> Proceed to Checkout
          </button>
          <button class="btn btn--ghost btn--block" data-action="clear-cart" ${cartItems.length === 0 ? "disabled" : ""}>
            <i class="fas fa-trash"></i> Clear Cart
          </button>
        </aside>
      </div>
    `;
  }

  return `
    <section class="page-hero">
      <h1 class="page-hero__title">Your Cart</h1>
      <p class="page-hero__subtitle">${count} item${count !== 1 ? "s" : ""} in your cart</p>
    </section>
    <section class="section">
      ${content}
    </section>
  `;
}

// --- View: Movie Details ---

function viewMovieDetails(movieId) {
  const movie = MOVIES.find(m => m.id === Number(movieId));
  if (!movie) {
    return emptyState("fa-film", "Movie not found", "The movie you're looking for doesn't exist.", `<button class="btn btn--primary" data-action="go-browse">Back to Browse</button>`);
  }

  const inWatchlist = Store.isInWatchlist(movie.id);
  const reviews = REVIEWS[movie.id] || [];
  const related = MOVIES.filter(m => m.genre === movie.genre && m.id !== movie.id).slice(0, 4);

  return `
    <section class="movie-detail" style="background-image: linear-gradient(to right, rgba(10, 12, 20, 0.95) 0%, rgba(10, 12, 20, 0.7) 50%, rgba(10, 12, 20, 0.4) 100%), url('${movie.backdrop}')">
      <div class="movie-detail__content">
        <div class="movie-detail__poster" style="background-image: url('${movie.poster}')"></div>
        <div class="movie-detail__info">
          <span class="movie-detail__genre">${movie.genre}</span>
          <h1 class="movie-detail__title">${movie.title}</h1>
          <div class="movie-detail__meta">
            <span class="movie-detail__rating"><i class="fas fa-star"></i> ${movie.rating}/10</span>
            <span>•</span>
            <span>${movie.year}</span>
            <span>•</span>
            <span>${formatRuntime(movie.runtime)}</span>
            <span>•</span>
            <span>${movie.releaseDate}</span>
          </div>
          <p class="movie-detail__description">${movie.description}</p>
          <div class="movie-detail__cast">
            <strong>Cast:</strong>
            ${movie.cast.map(actor => `<span class="chip chip--small">${actor}</span>`).join("")}
          </div>
          <div class="movie-detail__price">${formatPrice(movie.price)}</div>
          <div class="movie-detail__actions">
            <button class="btn btn--primary" data-action="add-to-cart" data-id="${movie.id}">
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
            <button class="btn btn--secondary ${inWatchlist ? "is-active" : ""}" data-action="toggle-watchlist" data-id="${movie.id}">
              <i class="fas fa-heart"></i> ${inWatchlist ? "Saved" : "Save to Watchlist"}
            </button>
            <button class="btn btn--ghost" data-action="go-back">
              <i class="fas fa-arrow-left"></i> Back
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section__title">Reviews</h2>
      ${
        reviews.length
          ? `<div class="reviews">
              ${reviews.map(review => `
                <div class="review">
                  <div class="review__header">
                    <span class="review__author">
                      <i class="fas fa-user-circle"></i> ${review.author}
                    </span>
                    <span class="review__rating"><i class="fas fa-star"></i> ${review.rating}</span>
                  </div>
                  <p class="review__text">${review.text}</p>
                </div>
              `).join("")}
            </div>`
          : `<p class="no-reviews"><i class="fas fa-comment-slash"></i> No reviews yet. Be the first to review this movie!</p>`
      }
    </section>

    ${
      related.length
        ? `<section class="section section--alt">
            <h2 class="section__title">More ${movie.genre} Films</h2>
            <div class="movie-grid">${related.map(m => movieCard(m)).join("")}</div>
          </section>`
        : ""
    }
  `;
}

// --- View: Checkout ---

function viewCheckout() {
  const cartItems = Store.state.cart
    .map(item => {
      const movie = MOVIES.find(m => m.id === item.id);
      return movie ? { ...item, movie } : null;
    })
    .filter(Boolean);

  if (cartItems.length === 0) {
    return emptyState(
      "fa-shopping-cart",
      "Nothing to check out",
      "Your cart is empty. Add some movies first.",
      `<button class="btn btn--primary" data-action="go-browse">Browse Movies</button>`
    );
  }

  const subtotal = Store.getCartTotal();
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const paymentMethods = [
    { value: "credit", label: "Credit Card", icon: "fa-credit-card" },
    { value: "paypal", label: "PayPal", icon: "fa-paypal" },
    { value: "gcash", label: "GCash", icon: "fa-mobile-alt" }
  ];

  return `
    <section class="page-hero">
      <h1 class="page-hero__title">Checkout</h1>
      <p class="page-hero__subtitle">Complete your rental order</p>
    </section>

    <section class="section">
      <form class="checkout-form" id="checkoutForm" novalidate>
        <div class="checkout-layout">
          <div class="checkout-form__main">
            <h3 class="checkout-form__heading">Contact Information</h3>
            <div class="form-group">
              <label for="fullName" class="form-label">Full Name</label>
              <input type="text" id="fullName" class="form-input" placeholder="Jane Doe" required minlength="2" />
              <span class="form-error" data-error-for="fullName"></span>
            </div>
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input type="email" id="email" class="form-input" placeholder="jane@example.com" required />
              <span class="form-error" data-error-for="email"></span>
            </div>

            <h3 class="checkout-form__heading checkout-form__heading--mt">Payment Method</h3>
            <div class="payment-methods">
              ${paymentMethods.map((method, i) => `
                <label class="payment-method ${i === 0 ? "is-selected" : ""}" data-payment-method>
                  <input type="radio" name="payment" value="${method.value}" ${i === 0 ? "checked" : ""} required />
                  <i class="fas ${method.icon}"></i>
                  <span>${method.label}</span>
                </label>
              `).join("")}
            </div>

            <div id="cardFields">
              <div class="form-group">
                <label for="cardNumber" class="form-label">Card Number</label>
                <input type="text" id="cardNumber" class="form-input" placeholder="1234 5678 9012 3456" maxlength="19" inputmode="numeric" />
                <span class="form-error" data-error-for="cardNumber"></span>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="cardExpiry" class="form-label">Expiry</label>
                  <input type="text" id="cardExpiry" class="form-input" placeholder="MM/YY" maxlength="5" />
                  <span class="form-error" data-error-for="cardExpiry"></span>
                </div>
                <div class="form-group">
                  <label for="cardCvc" class="form-label">CVC</label>
                  <input type="text" id="cardCvc" class="form-input" placeholder="123" maxlength="3" inputmode="numeric" />
                  <span class="form-error" data-error-for="cardCvc"></span>
                </div>
              </div>
            </div>

            <div class="checkout-form__order-summary" id="checkoutOrderSummary">
              <h3 class="checkout-form__heading">Order Summary</h3>
              <div class="checkout-order-item">
                ${cartItems.map(item => `
                  <div class="checkout-order-item__row">
                    <span class="checkout-order-item__title">${item.movie.title} × ${item.quantity}</span>
                    <span>${formatPrice(item.movie.price * item.quantity)}</span>
                  </div>
                `).join("")}
              </div>
              <div class="checkout-order-item__totals">
                <div class="checkout-order-item__row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
                <div class="checkout-order-item__row"><span>Tax (5%)</span><span>${formatPrice(tax)}</span></div>
                <div class="checkout-order-item__row checkout-order-item__row--total"><span>Total</span><span>${formatPrice(total)}</span></div>
              </div>
            </div>

            <button type="submit" class="btn btn--primary btn--block btn--lg" id="placeOrderBtn">
              <i class="fas fa-check-circle"></i> Place Order — ${formatPrice(total)}
            </button>
          </div>
        </div>
      </form>
    </section>
  `;
}

// --- View: Order Confirmation ---

function viewConfirmation(order) {
  const orderItems = order.items
    .map(item => {
      const movie = MOVIES.find(m => m.id === item.id);
      return movie ? { ...item, movie } : null;
    })
    .filter(Boolean);

  return `
    <section class="confirmation">
      <div class="confirmation__icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h1 class="confirmation__title">Order Confirmed!</h1>
      <p class="confirmation__message">Thank you, ${order.name}. Your rental order has been placed successfully.</p>
      <div class="confirmation__details">
        <div class="confirmation__row"><span>Order #</span><span>${order.orderNumber}</span></div>
        <div class="confirmation__row"><span>Email</span><span>${order.email}</span></div>
        <div class="confirmation__row"><span>Payment</span><span>${order.paymentLabel}</span></div>
        <div class="confirmation__row"><span>Date</span><span>${new Date(order.date).toLocaleString()}</span></div>
        <div class="confirmation__row confirmation__row--total"><span>Total</span><span>${formatPrice(order.total)}</span></div>
      </div>
      <div class="confirmation__items">
        <h3 class="confirmation__items-title">Your Movies</h3>
        <div class="confirmation__item-list">
          ${orderItems.map(item => `
            <div class="confirmation__item">
              <div class="confirmation__item-poster" style="background-image: url('${item.movie.poster}')"></div>
              <div>
                <strong>${item.movie.title}</strong>
                <p>${item.movie.year} • ${item.movie.genre} × ${item.quantity}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="confirmation__actions">
        <button class="btn btn--primary" data-action="go-browse">
          <i class="fas fa-film"></i> Continue Browsing
        </button>
        <button class="btn btn--ghost" data-action="go-home">
          <i class="fas fa-home"></i> Back to Home
        </button>
      </div>
    </section>
  `;
}

// --- View: 404 ---

function viewNotFound() {
  return emptyState(
    "fa-compass",
    "Page Not Found",
    "The page you're looking for doesn't exist.",
    `<button class="btn btn--primary" data-action="go-home">Go Home</button>`
  );
}