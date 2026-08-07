// Yurexa App Entry Point
// Global event delegation and initialization.

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("nav__links--open");
      navToggle.querySelector("i").classList.toggle("fa-bars");
      navToggle.querySelector("i").classList.toggle("fa-times");
    });
  }

  // Close mobile nav when a link is clicked
  document.querySelectorAll(".nav__link").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("nav__links--open");
      navToggle.querySelector("i").classList.add("fa-bars");
      navToggle.querySelector("i").classList.remove("fa-times");
    });
  });

  // Global click delegation for data-action buttons
  document.addEventListener("click", handleActionClick);

  // Global keydown for Escape key (close mobile nav) and Enter on poster divs
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      navLinks.classList.remove("nav__links--open");
      navToggle.querySelector("i").classList.add("fa-bars");
      navToggle.querySelector("i").classList.remove("fa-times");
    }

    // Enter key on movie poster divs (role="button")
    if (e.key === "Enter") {
      const target = e.target.closest('[data-action="view-details"][role="button"]');
      if (target) {
        e.preventDefault();
        Router.navigate("movie", { id: target.getAttribute("data-id") });
      }
    }
  });

  // Handle initial render
  Router.render();
}

// Handle all clicks on data-action elements
function handleActionClick(e) {
  const target = e.target.closest("[data-action]");
  if (!target) return;

  const action = target.getAttribute("data-action");
  const id = target.getAttribute("data-id");
  const genre = target.getAttribute("data-genre");

  switch (action) {
    case "go-home":
      e.preventDefault();
      Router.navigate("home");
      break;

    case "go-browse":
      e.preventDefault();
      Router.navigate("browse");
      break;

    case "go-featured":
      e.preventDefault();
      Store.setFilter("All");
      Store.setSort("featured");
      Router.navigate("browse");
      break;

    case "go-checkout":
      e.preventDefault();
      Router.navigate("checkout");
      break;

    case "go-back":
      history.back();
      break;

    case "view-details":
      e.preventDefault();
      Router.navigate("movie", { id });
      break;

    case "add-to-cart":
      e.preventDefault();
      if (Store.addToCart(Number(id))) {
        showToast("Added to cart!", "success");
      }
      break;

    case "remove-from-cart":
      e.preventDefault();
      Store.removeFromCart(Number(id));
      showToast("Removed from cart", "info");
      Router.render();
      break;

    case "increase-qty":
      e.preventDefault();
      {
        const item = Store.state.cart.find(i => i.id === Number(id));
        if (item) {
          Store.updateCartQuantity(item.id, item.quantity + 1);
          Router.render();
        }
      }
      break;

    case "decrease-qty":
      e.preventDefault();
      {
        const item = Store.state.cart.find(i => i.id === Number(id));
        if (item) {
          if (item.quantity <= 1) {
            Store.removeFromCart(item.id);
            showToast("Removed from cart", "info");
          } else {
            Store.updateCartQuantity(item.id, item.quantity - 1);
          }
          Router.render();
        }
      }
      break;

    case "clear-cart":
      e.preventDefault();
      if (Store.state.cart.length > 0) {
        if (confirm("Are you sure you want to clear your cart?")) {
          Store.clearCart();
          showToast("Cart cleared", "info");
          Router.render();
        }
      }
      break;

    case "save-for-later":
      e.preventDefault();
      Store.saveForLater(Number(id));
      showToast("Saved for later", "info");
      Router.render();
      break;

    case "move-to-cart":
      e.preventDefault();
      Store.moveToCart(Number(id));
      showToast("Moved to cart!", "success");
      Router.render();
      break;

    case "remove-from-saved":
      e.preventDefault();
      Store.removeFromSaved(Number(id));
      showToast("Removed from saved items", "info");
      Router.render();
      break;

    case "add-all-to-cart":
      e.preventDefault();
      {
        const count = Store.addAllToCart();
        showToast(`${count} movie${count !== 1 ? "s" : ""} added to cart!`, "success");
        Router.render();
      }
      break;

    case "clear-watchlist":
      e.preventDefault();
      if (Store.state.watchlist.length > 0) {
        if (confirm("Are you sure you want to clear your entire watchlist?")) {
          const count = Store.clearWatchlist();
          showToast(`${count} movie${count !== 1 ? "s" : ""} removed from watchlist`, "info");
          Router.render();
        }
      }
      break;

    case "toggle-watchlist":
      e.preventDefault();
      {
        const added = Store.toggleWatchlist(Number(id));
        showToast(
          added ? "Added to watchlist!" : "Removed from watchlist",
          added ? "success" : "info"
        );
        // Re-render to update the button state
        Router.render();
      }
      break;

    case "filter-genre":
      e.preventDefault();
      Store.setFilter(genre);
      Router.navigate("browse");
      break;

    case "search-movies":
      // Handled by input listener in afterRender
      break;

    case "clear-search":
      e.preventDefault();
      Store.setSearch("");
      Router.render();
      break;

    case "clear-filters":
      e.preventDefault();
      Store.setFilter("All");
      Store.setSort("featured");
      Store.setSearch("");
      Router.render();
      break;
  }
}
