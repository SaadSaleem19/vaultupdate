// ==========================================
// VAULT — Core JavaScript (Thrift & Archive)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- LOADER ----
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loader-fill');
  if (loader && loaderFill) {
    let progress = 0;
    const loaderInterval = setInterval(() => {
      progress += Math.random() * 12 + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loaderInterval);
        setTimeout(() => {
          loader.classList.add('hide');
          document.body.style.overflow = '';
          triggerHeroAnimations();
        }, 250);
      }
      loaderFill.style.width = progress + '%';
    }, 70);
    document.body.style.overflow = 'hidden';
  }

  // ---- CUSTOM CURSOR ----
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (cursor && follower) {
    let mx = -100, my = -100, fx = -100, fy = -100;
    let hasMoved = false;
    cursor.style.opacity = '0';
    follower.style.opacity = '0';

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!hasMoved) {
        fx = mx;
        fy = my;
        hasMoved = true;
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
      }
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (hasMoved) {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
      }
    });

    function animateFollower() {
      if (hasMoved) {
        fx += (mx - fx) * 0.15;
        fy += (my - fy) * 0.15;
        follower.style.left = fx + 'px';
        follower.style.top = fy + 'px';
      }
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    function bindHover(elements) {
      elements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('hovered');
          follower.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('hovered');
          follower.classList.remove('hovered');
        });
      });
    }
    bindHover(document.querySelectorAll('a, button, .product-card, input, select'));
  }

  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else if (!document.querySelector('.product-page-main')) {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ---- HAMBURGER & MOBILE MENU ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  function openMobileMenu() {
    if (!mobileMenu) return;
    if (typeof closeCart === 'function') closeCart();
    mobileMenu.classList.add('open');
    if (menuOverlay) menuOverlay.classList.add('show');
    if (hamburger) hamburger.classList.add('active');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (menuOverlay) menuOverlay.classList.remove('show');
    if (hamburger) hamburger.classList.remove('active');
    document.body.classList.remove('menu-open');
    const cartSidebarEl = document.getElementById('cart-sidebar');
    if (!cartSidebarEl || !cartSidebarEl.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMobileMenu);
  }

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ---- HERO ANIMATIONS ----
  function triggerHeroAnimations() {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, i * 100);
    });
  }

  // ---- SCROLL REVEAL ----
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
  if (scrollRevealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const num = entry.target.querySelector('.stat-num');
          if (num) {
            animateCounter(num);
          }
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    scrollRevealElements.forEach(el => revealObserver.observe(el));
  }

  // ---- COUNTER ANIMATION ----
  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    const target = parseInt(el.dataset.target);
    if (isNaN(target)) return;
    const duration = 1400;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  // ---- GLOBAL CART & DRAWER ----
  const cartBtn = document.getElementById('cart-btn');
  const cartClose = document.getElementById('cart-close');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCount = document.getElementById('cart-count');
  const cartItemsEl = document.getElementById('cart-items');
  const cartFooter = document.getElementById('cart-footer');
  const cartTotalPrice = document.getElementById('cart-total-price');

  function openCart() {
    if (!cartSidebar) return;
    if (typeof closeMobileMenu === 'function') closeMobileMenu();
    cartSidebar.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (!cartSidebar) return;
    cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('vault_cart') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('vault_cart', JSON.stringify(cart));
  }

  function updateCartUI() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

    if (cartCount) {
      cartCount.textContent = cart.length;
      if (cart.length > 0) {
        cartCount.classList.add('visible');
      } else {
        cartCount.classList.remove('visible');
      }
    }

    if (cartFooter && cartTotalPrice) {
      if (cart.length > 0) {
        cartFooter.style.display = 'block';
        cartTotalPrice.textContent = 'PKR ' + total.toLocaleString('en-PK');
      } else {
        cartFooter.style.display = 'none';
      }
    }

    if (cartItemsEl) {
      if (cart.length === 0) {
        cartItemsEl.innerHTML = `
          <div class="cart-empty">
            <div class="cart-empty-icon">👟</div>
            <p>Your vault is empty</p>
            <span>Claim a 1-of-1 thrifted grail first</span>
          </div>`;
      } else {
        cartItemsEl.innerHTML = cart.map((item, i) => `
          <div class="cart-item">
            <img src="${item.image || 'images/shoe_1.png'}" alt="${item.name}" style="width:48px; height:48px; object-fit:contain; background:#fff; border-radius:4px; padding:2px;" />
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div style="font-size:0.7rem; color:var(--gray-300);">${item.size || '1-of-1'}</div>
              <div class="cart-item-price">PKR ${item.price.toLocaleString('en-PK')}</div>
            </div>
            <button class="cart-item-remove" data-index="${i}">✕</button>
          </div>
        `).join('');

        cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.index);
            const currentCart = getCart();
            currentCart.splice(idx, 1);
            saveCart(currentCart);
            updateCartUI();
          });
        });
      }
    }
  }

  // Bind Cart Drawer "Order on WhatsApp" Button (Zero Form Flow)
  const cartCheckoutWaBtn = document.getElementById('cart-checkout-wa-btn');
  if (cartCheckoutWaBtn) {
    cartCheckoutWaBtn.addEventListener('click', () => {
      const cart = getCart();
      if (!cart || cart.length === 0) {
        showToast('Your vault is empty! Add a grail first.');
        return;
      }

      // Generate order ID and save to database for admin tracking
      const orderId = 'VLT-' + Math.floor(1000 + Math.random() * 9000);
      const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
      if (window.vaultDB) {
        window.vaultDB.saveOrder({
          id: orderId,
          date: new Date().toISOString().split('T')[0],
          customer: {
            name: 'WhatsApp Customer',
            phone: 'Direct WhatsApp',
            email: '',
            address: 'To be provided on WhatsApp',
            city: 'Pakistan'
          },
          items: [...cart],
          subtotal,
          shipping: 0,
          total: subtotal,
          paymentMethod: 'Cash on Delivery (WhatsApp)',
          status: 'Pending'
        });
      }

      const waLink = window.vaultDB
        ? window.vaultDB.formatWhatsAppOrderLink(cart, `Cart Checkout (Order #${orderId})`)
        : `https://wa.me/923700120493`;

      showToast('Opening WhatsApp to place your order... 📱');
      closeCart();
      setTimeout(() => {
        window.open(waLink, '_blank');
      }, 350);
    });
  }

  // Update floating WhatsApp and social buttons
  const currentWaNum = window.vaultDB ? window.vaultDB.getWhatsAppNumber() : '923700120493';
  document.querySelectorAll('.whatsapp-float').forEach(btn => {
    btn.href = `https://wa.me/${currentWaNum}?text=${encodeURIComponent('Assalam-o-Alaikum VAULT! I want to inquire about a thrifted sneaker drop.')}`;
  });
  const waSocialLink = document.getElementById('wa-link');
  if (waSocialLink) {
    waSocialLink.href = `https://wa.me/${currentWaNum}?text=${encodeURIComponent('Assalam-o-Alaikum VAULT!')}`;
    waSocialLink.target = '_blank';
    waSocialLink.rel = 'noopener noreferrer';
  }

  const VAULT_SOCIALS = {
    instagram: 'https://www.instagram.com/vault92_?exln=aHdwZXp4M21xdnBr',
    tiktok: 'https://www.tiktok.com/@vault92_?_r=1&_t=ZS-9AwJBgUYPn3',
    facebook: 'https://www.facebook.com/share/1DsvDWXAj4/?mibextid=wwXIfr',
    handle: '@vault92_'
  };
  const igSocialLink = document.getElementById('ig-link');
  if (igSocialLink) {
    igSocialLink.href = VAULT_SOCIALS.instagram;
    igSocialLink.target = '_blank';
    igSocialLink.rel = 'noopener noreferrer';
  }
  const ttSocialLink = document.getElementById('tt-link');
  if (ttSocialLink) {
    ttSocialLink.href = VAULT_SOCIALS.tiktok;
    ttSocialLink.target = '_blank';
    ttSocialLink.rel = 'noopener noreferrer';
  }
  const fbSocialLink = document.getElementById('fb-link');
  if (fbSocialLink) {
    fbSocialLink.href = VAULT_SOCIALS.facebook;
    fbSocialLink.target = '_blank';
    fbSocialLink.rel = 'noopener noreferrer';
  }

  window.updateGlobalCart = updateCartUI;

  // Add to cart helper by ID
  window.quickAddToCart = function (productId) {
    if (!window.vaultDB) return;
    const p = window.vaultDB.getProductById(productId);
    if (!p) return;
    const cart = getCart();
    cart.push({ id: p.id, name: p.name, price: p.price, size: p.size, image: (p.images && p.images[0]) || p.image });
    saveCart(cart);
    updateCartUI();
    showToast(`${p.name} added to Vault!`);
    if (cartBtn) {
      cartBtn.style.transform = 'scale(1.25)';
      setTimeout(() => cartBtn.style.transform = '', 200);
    }
  };

  // ---- DYNAMIC PRODUCT GRID IN INDEX.HTML ----
  function renderHomePageProducts() {
    const homeProductsGrid = document.querySelector('.products-section .products-grid');
    if (homeProductsGrid && window.vaultDB) {
      const products = window.vaultDB.getProducts();
      if (products && products.length > 0) {
        homeProductsGrid.innerHTML = products.map((p, idx) => `
          <div class="product-card visible" 
               data-id="${p.id}" 
               onclick="window.location.href='product.html?id=${p.id}'"
               style="cursor:pointer; opacity:1 !important; transform:none !important;">
              <div class="product-img-wrap" style="${p.id === 2 ? 'background:#fff;' : ''}">
                  <span class="product-badge-thrift">${p.badge || '1-of-1 Grail'}</span>
                  <img src="${(p.images && p.images[0]) || p.image || 'images/shoe_1.png'}" alt="${p.name}" />
                  <div class="product-overlay">
                      <button class="btn-addcart" onclick="event.stopPropagation(); window.quickAddToCart('${p.id}')">Add to Cart</button>
                  </div>
              </div>
              <div class="product-info">
                  <div class="product-top">
                      <h3 class="product-name">${p.name}</h3>
                      <span class="product-tag">${p.tag || 'Authentic'}</span>
                  </div>
                  <div class="product-spec-row">
                      <span class="spec-pill size-pill">${p.size}</span>
                      <span class="spec-pill condition-pill">${p.condition}</span>
                  </div>
                  <div class="product-bottom">
                      <div class="price-wrap">
                          <span class="product-price">PKR ${Number(p.price).toLocaleString('en-PK')}</span>
                          ${p.originalPrice ? `<span class="product-orig-price">Retail PKR ${Number(p.originalPrice).toLocaleString('en-PK')}+</span>` : ''}
                      </div>
                      <span class="stock-status">● ${p.inStock !== false ? '1 In Stock' : 'Sold Out'}</span>
                  </div>
              </div>
          </div>
        `).join('');
      }
    }
  }

  renderHomePageProducts();
  window.addEventListener('vaultProductsUpdated', renderHomePageProducts);

  // Automatic Real-Time Live Sync from Cloud
  if (window.vaultDB && typeof window.vaultDB.syncFromCloud === 'function') {
    // Initial fetch on page load
    window.vaultDB.syncFromCloud().catch(() => {});

    // Periodic live sync every 15 seconds (catches new items & price drops in real-time)
    setInterval(() => {
      window.vaultDB.syncFromCloud().catch(() => {});
    }, 15000);

    // Immediate check whenever visitor switches back to the tab
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && window.vaultDB) {
        window.vaultDB.syncFromCloud().catch(() => {});
      }
    });
  }

  // ---- TOAST SYSTEM ----
  const toast = document.getElementById('toast');
  let toastTimeout;
  function showToast(msg) {
    if (!toast) return;
    clearTimeout(toastTimeout);
    toast.textContent = msg;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
  }
  window.showGlobalToast = showToast;

  // ---- NEWSLETTER ----
  const newsletterBtn = document.getElementById('newsletter-btn');
  const newsletterEmail = document.getElementById('newsletter-email');
  if (newsletterBtn && newsletterEmail) {
    newsletterBtn.addEventListener('click', () => {
      const email = newsletterEmail.value.trim();
      if (email && email.includes('@')) {
        showToast('Welcome to Drop Radar! You will get 15-min early access 🔒');
        newsletterEmail.value = '';
      } else {
        showToast('Please enter a valid email address');
      }
    });
  }

  // ---- PARALLAX HERO ----
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroImg = document.querySelector('.hero-image img');
    const heroBg = document.querySelector('.hero-bg-text');
    if (heroImg) heroImg.style.transform = `translateY(${scrollY * 0.12}px) rotate(-2deg)`;
    if (heroBg) heroBg.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.06}px))`;
  });

  // ---- SMOOTH SCROLL FOR IN-PAGE ANCHORS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Init cart state
  updateCartUI();
});
