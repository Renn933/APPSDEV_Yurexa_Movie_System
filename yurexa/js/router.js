// Yurexa Router
// Simple hash-based router for SPA navigation.

const Router = {
  routes: {
    home: { render: viewHome, title: "Yurexa — Movies" },
    browse: { render: viewBrowse, title: "Browse — Yurexa" },
    watchlist: { render: viewWatchlist, title: "Watchlist — Yurexa" },
    cart: { render: viewCart, title: "Cart — Yurexa" },
    checkout: { render: viewCheckout, title: "Checkout — Yurexa" },
    confirmation: { render: null, title: "Order Confirmed — Yurexa" },
    movie: { render: null, title: "Movie — Yurexa" },
    notfound: { render: viewNotFound, title: "Not Found — Yurexa" }
  },

  // Current route state
  current: {
    name: "home",
    params: {}
  },

  // Last order for confirmation view
  lastOrder: null,

  // Parse the hash into route name and params
  parseHash() {
    const hash = window.location.hash.replace(/^#\/?/, "");
    const parts = hash.split("/").filter(Boolean);

    if (parts.length === 0) return { name: "home", params: {} };
    if (parts[0] === "movie" && parts[1]) {
      return { name: "movie", params: { id: parts[1] } };
    }
    if (parts[0] === "confirmation") {
      return { name: "confirmation", params: {} };
    }
    if (this.routes[parts[0]]) {
      return { name: parts[0], params: {} };
    }
    return { name: "notfound", params: {} };
  },

  // Navigate to a route
  navigate(name, params = {}) {
    let hash = `#/${name}`;
    if (name === "movie" && params.id) {
      hash = `#/movie/${params.id}`;
    }
    if (name === "confirmation") {
      hash = `#/confirmation`;
    }
    window.location.hash = hash;
  },

  // Render the current route
  render() {
    const main = document.getElementById("mainContent");
    if (!main) return;

    const { name, params } = this.parseHash();
    this.current = { name, params };

    const route = this.routes[name] || this.routes.notfound;
    document.title = route.title;

    // Special handling for routes with dynamic render functions
    let html;
    if (name === "movie") {
      html = viewMovieDetails(params.id);
    } else if (name === "confirmation") {
      html = this.lastOrder
        ? viewConfirmation(this.lastOrder)
        : emptyState(
            "fa-receipt",
            "No order found",
            "You haven't placed an order yet.",
            `<button class="btn btn--primary" data-action="go-browse">Browse Movies</button>`
          );
    } else {
      html = route.render();
    }

    // Add fade-in transition
    main.classList.remove("fade-in");
    void main.offsetWidth; // restart animation
    main.innerHTML = html;
    main.classList.add("fade-in");

    // Update active nav link
    this.updateActiveNav(name);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Bind post-render behaviors
    this.afterRender(name);
  },

  // Update which nav link is highlighted
  updateActiveNav(name) {
    const links = document.querySelectorAll(".nav__link");
    links.forEach(link => {
      const navTarget = link.getAttribute("data-nav");
      link.classList.toggle("active", navTarget === name);
    });
  },

  // Post-render hooks (event binding for dynamic elements)
  afterRender(name) {
    if (name === "browse") {
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        // Debounced search
        let debounceTimer;
        searchInput.addEventListener("input", (e) => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            Store.setSearch(e.target.value);
            this.render();
          }, 300);
        });
      }

      // Sort select change event
      const sortSelect = document.querySelector('[data-action="sort-movies"]');
      if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
          Store.setSort(e.target.value);
          this.render();
        });
      }
    }

    if (name === "checkout") {
      this.bindCheckout();
    }
  },

  // Bind checkout form behaviors
  bindCheckout() {
    const form = document.getElementById("checkoutForm");
    if (!form) return;

    // Payment method selection
    const paymentMethods = document.querySelectorAll("[data-payment-method]");
    const cardFields = document.getElementById("cardFields");
    paymentMethods.forEach(method => {
      method.addEventListener("click", () => {
        paymentMethods.forEach(m => m.classList.remove("is-selected"));
        method.classList.add("is-selected");
        // Hide card fields for non-credit payment methods
        const radio = method.querySelector('input[name="payment"]');
        if (cardFields) {
          cardFields.style.display = radio && radio.value === "credit" ? "block" : "none";
        }
      });
    });

    // Card number auto-formatting
    const cardNumber = document.getElementById("cardNumber");
    if (cardNumber) {
      cardNumber.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "").slice(0, 16);
        e.target.value = value.replace(/(.{4})/g, "$1 ").trim();
      });
    }

    // Expiry auto-formatting
    const cardExpiry = document.getElementById("cardExpiry");
    if (cardExpiry) {
      cardExpiry.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "").slice(0, 4);
        if (value.length >= 3) {
          value = value.slice(0, 2) + "/" + value.slice(2);
        }
        e.target.value = value;
      });
    }

    // Form validation on submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.validateCheckoutForm()) {
        this.placeOrder();
      }
    });
  },

  // Validate checkout form fields
  validateCheckoutForm() {
    let isValid = true;
    const form = document.getElementById("checkoutForm");

    // Clear previous errors
    form.querySelectorAll(".form-error").forEach(el => (el.textContent = ""));
    form.querySelectorAll(".form-input").forEach(el => el.classList.remove("is-invalid"));

    // Full name validation
    const fullName = document.getElementById("fullName");
    if (!fullName.value.trim() || fullName.value.trim().length < 2) {
      this.showFieldError("fullName", "Please enter your full name (at least 2 characters).");
      isValid = false;
    }

    // Email validation
    const email = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      this.showFieldError("email", "Please enter a valid email address.");
      isValid = false;
    }

    // Card validation (only if credit card is selected)
    const selectedPayment = form.querySelector('input[name="payment"]:checked');
    if (selectedPayment && selectedPayment.value === "credit") {
      const cardNumber = document.getElementById("cardNumber");
      const cardDigits = cardNumber.value.replace(/\s/g, "");
      if (cardDigits.length !== 16) {
        this.showFieldError("cardNumber", "Card number must be 16 digits.");
        isValid = false;
      }

      const cardExpiry = document.getElementById("cardExpiry");
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryRegex.test(cardExpiry.value)) {
        this.showFieldError("cardExpiry", "Use MM/YY format.");
        isValid = false;
      } else {
        // Check expiry is in the future
        const [month, year] = cardExpiry.value.split("/").map(Number);
        const now = new Date();
        const expiryDate = new Date(2000 + year, month, 0);
        if (expiryDate < now) {
          this.showFieldError("cardExpiry", "Card has expired.");
          isValid = false;
        }
      }

      const cardCvc = document.getElementById("cardCvc");
      if (!/^\d{3}$/.test(cardCvc.value)) {
        this.showFieldError("cardCvc", "CVC must be 3 digits.");
        isValid = false;
      }
    }

    if (!isValid) {
      showToast("Please fix the errors in the form.", "error");
    }

    return isValid;
  },

  // Show a field error message
  showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.querySelector(`[data-error-for="${fieldId}"]`);
    if (input) input.classList.add("is-invalid");
    if (errorEl) errorEl.textContent = message;
  },

  // Place the order (simulated)
  placeOrder() {
    const form = document.getElementById("checkoutForm");
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const selectedPayment = form.querySelector('input[name="payment"]:checked');
    const paymentLabel = selectedPayment
      ? form.querySelector(`input[value="${selectedPayment.value}"]`).closest(".payment-method").querySelector("span").textContent
      : "Credit Card";

    const subtotal = Store.getCartTotal();
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    // Generate order number
    const orderNumber = "YX-" + Date.now().toString().slice(-8);

    const order = {
      orderNumber,
      name: fullName,
      email,
      paymentLabel,
      date: new Date().toISOString(),
      items: [...Store.state.cart],
      subtotal,
      tax,
      total
    };

    // Simulate processing delay (loading state)
    const btn = document.getElementById("placeOrderBtn");
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    setTimeout(() => {
      // Save order and clear cart
      this.lastOrder = order;
      Store.clearCart();
      btn.disabled = false;
      btn.innerHTML = originalHTML;
      this.navigate("confirmation");
      showToast("Order placed successfully!", "success");
    }, 1200);
  }
};

// Listen for hash changes
window.addEventListener("hashchange", () => {
  Router.render();
});