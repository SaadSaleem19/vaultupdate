// ==========================================
// VAULT — Central Product & Order Data Store
// ==========================================

// Global Cloud Sync Configuration (Firebase Realtime Database / REST)
// When endpoint is set, all visitors on Netlify fetch live products automatically!
const DEFAULT_CLOUD_CONFIG = {
  type: 'firebase',
  endpoint: 'https://vault-archive-8416f-default-rtdb.europe-west1.firebasedatabase.app',
  apiKey: ''
};

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Nike Dunk High "Panda" Retro',
    brand: 'Nike',
    category: 'Footwear',
    price: 13999,
    originalPrice: 48000,
    size: 'US 9.5 (EU 43)',
    condition: '9.5/10 Near Mint',
    conditionDetails: {
      upper: '10/10 Flawless leather',
      midsole: '9.5/10 Bright white, no scuffs',
      outsole: '9.2/10 Minimal star wear',
      insole: 'Original clean, branded logo visible',
      box: 'Vault Archive Replacement Box'
    },
    image: 'images/shoe_1.png',
    images: ['images/shoe_1.png', 'images/collection_shoes.png'],
    badge: '1-of-1 Grail',
    tag: 'Authentic Brand',
    inStock: true,
    description: 'Iconic monochrome high-top grail sourced from a Japanese archive lot. Features full-grain leather panels, original padded tongue, and iconic contrast swoosh. Completely deep-cleaned, sanitized with hospital-grade UV light, and treated with premium leather balm. Ready to wear.'
  },
  {
    id: 2,
    name: 'Nike Dunk Low "Phantom White"',
    brand: 'Nike',
    category: 'Footwear',
    price: 12499,
    originalPrice: 42000,
    size: 'US 10 (EU 44)',
    condition: '9.8/10 Like New',
    conditionDetails: {
      upper: '10/10 Pristine clean',
      midsole: '10/10 Flawless',
      outsole: '9.8/10 Factory stars 100% visible',
      insole: 'Zero foot imprint, crisp Nike print',
      box: 'Vault Archive Replacement Box'
    },
    image: 'images/shoe_2.png',
    images: ['images/shoe_2.png', 'images/collection_shoes.png'],
    badge: '1-of-1 Grail',
    tag: 'Authentic Brand',
    inStock: true,
    description: 'Ultra-clean low profile Dunk Low in crisp tonal white. Worn just once for a photoshoot, practically deadstock condition. Sourced from a UK private collection. 100% verified original materials and tags.'
  },
  {
    id: 3,
    name: 'New Balance 2002R Archive Runner',
    brand: 'New Balance',
    category: 'Footwear',
    price: 11999,
    originalPrice: 38000,
    size: 'US 9 (EU 42.5)',
    condition: '9.0/10 Pristine',
    conditionDetails: {
      upper: '9.2/10 Soft pigskin suede & mesh',
      midsole: '9.0/10 ABZORB foam resilient',
      outsole: '9.0/10 High traction, minimal tread wear',
      insole: 'Clean, sanitized original insole',
      box: 'Vault Archive Replacement Box'
    },
    image: 'images/shoe_3.png',
    images: ['images/shoe_3.png', 'images/collection_shoes.png'],
    badge: '1-of-1 Grail',
    tag: 'Authentic Brand',
    inStock: true,
    description: 'One of the most comfortable retro runners ever crafted. Featuring ABZORB and N-ergy shock absorption pods in the heel with premium pigskin suede overlays and breathable mesh. Sourced from a European vintage collector.'
  },
  {
    id: 1793285663324,
    name: 'nike sb',
    brand: 'Jordan Archive',
    category: 'Footwear',
    price: 1899,
    originalPrice: 12000,
    size: '8.5',
    condition: '9.5/10 Near Mint',
    conditionDetails: {
      upper: '9.5/10 Clean archival panels & knit',
      midsole: '9.5/10 Solid cushioning, no scuffs',
      outsole: '9.5/10 Full tread traction',
      insole: 'Sanitized, crisp original insole',
      box: 'Vault Archive Box'
    },
    image: 'images/shoe_nike_sb.jpg',
    images: ['images/shoe_nike_sb.jpg', 'images/shoe_nike_sb_2.jpg', 'images/shoe_nike_sb_3.jpg'],
    badge: '1-of-1 Grail',
    tag: 'Authentic Brand',
    inStock: true,
    description: 'good jordan'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'VLT-7821',
    date: '2026-10-27',
    customer: {
      name: 'Hamza Khan',
      phone: '+92 300 1234567',
      email: 'hamza.k@gmail.com',
      address: 'House 42, Street 8, Phase 6, DHA',
      city: 'Karachi'
    },
    items: [
      {
        id: 1,
        name: 'Nike Dunk High "Panda" Retro',
        price: 13999,
        size: 'US 9.5 (EU 43)',
        image: 'images/shoe_1.png'
      }
    ],
    subtotal: 13999,
    shipping: 0,
    total: 13999,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Confirmed'
  }
];

// Helper functions for LocalStorage & Cloud DB
function VaultDB() {
  const storage = {
    getItem: function (key) {
      try {
        return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
      } catch (e) {
        return null;
      }
    },
    setItem: function (key, value) {
      try {
        if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      } catch (e) {
        console.error('LocalStorage write failed:', e);
        if (e && (e.name === 'QuotaExceededError' || e.code === 22)) {
          if (typeof window !== 'undefined' && typeof window.alert === 'function') {
            window.alert('Browser storage is full! Please upload fewer or smaller photos.');
          }
        }
      }
    },
    removeItem: function (key) {
      try {
        if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      } catch (e) {}
    }
  };

  function getProducts() {
    const data = storage.getItem('vault_products');
    if (!data) {
      storage.setItem('vault_products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        storage.setItem('vault_products', JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return parsed;
    } catch (e) {
      storage.setItem('vault_products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
  }

  function resetToInitialProducts() {
    storage.setItem('vault_products', JSON.stringify(INITIAL_PRODUCTS));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vaultProductsUpdated', { detail: INITIAL_PRODUCTS }));
    }
    syncToCloud(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }

  function getProductById(id) {
    const products = getProducts();
    return products.find(p => String(p.id) === String(id)) || null;
  }

  function saveProducts(products) {
    storage.setItem('vault_products', JSON.stringify(products));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vaultProductsUpdated', { detail: products }));
    }
    syncToCloud(products);
  }

  function saveProduct(product) {
    const products = getProducts();
    if (product.id) {
      const idx = products.findIndex(p => String(p.id) === String(product.id));
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...product };
      } else {
        products.push(product);
      }
    } else {
      product.id = Date.now();
      products.push(product);
    }
    saveProducts(products);
    return product;
  }

  function deleteProduct(id) {
    let products = getProducts();
    products = products.filter(p => String(p.id) !== String(id));
    saveProducts(products);
  }

  function getOrders() {
    const data = storage.getItem('vault_orders');
    if (!data) {
      storage.setItem('vault_orders', JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_ORDERS;
    }
  }

  function saveOrder(order) {
    const orders = getOrders();
    orders.unshift(order);
    storage.setItem('vault_orders', JSON.stringify(orders));
    return order;
  }

  function updateOrderStatus(orderId, newStatus) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      storage.setItem('vault_orders', JSON.stringify(orders));
    }
    return order;
  }

  // WhatsApp Configuration & Ordering
  const DEFAULT_WHATSAPP = '923700120493';

  function getWhatsAppNumber() {
    const saved = storage.getItem('vault_whatsapp');
    if (!saved || saved === '923000000000') {
      storage.setItem('vault_whatsapp', DEFAULT_WHATSAPP);
      return DEFAULT_WHATSAPP;
    }
    return saved;
  }

  function setWhatsAppNumber(num) {
    const cleaned = String(num || '').replace(/[^0-9]/g, '');
    const finalNum = cleaned || DEFAULT_WHATSAPP;
    storage.setItem('vault_whatsapp', finalNum);
    return finalNum;
  }

  function formatWhatsAppOrderLink(items, note = '') {
    const waNumber = getWhatsAppNumber();
    if (!items || items.length === 0) {
      return `https://wa.me/${waNumber}?text=${encodeURIComponent('Assalam-o-Alaikum VAULT! I want to inquire about a thrifted sneaker.')}`;
    }

    const total = items.reduce((sum, it) => sum + (Number(it.price) || 0), 0);
    let msg = `*Assalam-o-Alaikum VAULT!* 👟🔥\n`;
    msg += `I want to place an order via WhatsApp (Cash on Delivery):\n\n`;
    msg += `📦 *ORDER ITEMS:*\n`;
    msg += `─────────────────────\n`;
    items.forEach((item, idx) => {
      msg += `*${idx + 1}. ${item.name}*\n`;
      msg += `   • Size: ${item.size || '1-of-1'}\n`;
      if (item.condition) {
        msg += `   • Condition: ${item.condition}\n`;
      }
      msg += `   • Price: PKR ${Number(item.price).toLocaleString('en-PK')}\n`;
    });
    msg += `─────────────────────\n`;
    msg += `🛍️ *Total Items:* ${items.length}\n`;
    msg += `💵 *Total Payable:* PKR ${total.toLocaleString('en-PK')}\n`;
    msg += `🚚 *Payment:* Cash on Delivery (COD)\n\n`;
    if (note) {
      msg += `📝 *Note:* ${note}\n\n`;
    }
    msg += `Please confirm my order and share delivery details!`;

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  }

  // Cloud Database Sync Configuration
  function getCloudConfig() {
    try {
      const cfg = storage.getItem('vault_cloud_sync');
      if (cfg) {
        const parsed = JSON.parse(cfg);
        if (parsed && parsed.endpoint) return parsed;
      }
    } catch (e) {}
    if (typeof DEFAULT_CLOUD_CONFIG !== 'undefined' && DEFAULT_CLOUD_CONFIG && DEFAULT_CLOUD_CONFIG.endpoint) {
      return DEFAULT_CLOUD_CONFIG;
    }
    return null;
  }

  function setCloudConfig(config) {
    if (!config || !config.endpoint) {
      storage.removeItem('vault_cloud_sync');
      return null;
    }
    storage.setItem('vault_cloud_sync', JSON.stringify(config));
    return config;
  }

  async function syncFromCloud() {
    const cfg = getCloudConfig();
    if (!cfg || !cfg.endpoint) return null;

    try {
      let headers = {};
      let fetchUrl = cfg.endpoint.trim();

      if (cfg.type === 'firebase') {
        fetchUrl = fetchUrl.replace(/\/+$/, '');
        if (!fetchUrl.endsWith('.json')) {
          fetchUrl += '/products.json';
        }
      } else if (cfg.type === 'jsonbin') {
        if (cfg.apiKey) headers['X-Master-Key'] = cfg.apiKey.trim();
        if (!fetchUrl.includes('/latest')) {
          fetchUrl = fetchUrl.replace(/\/?$/, '/latest');
        }
      }

      const res = await fetch(fetchUrl, { headers, cache: 'no-store' });
      if (!res.ok) throw new Error('Cloud fetch failed with status ' + res.status);
      const data = await res.json();

      let remoteProducts = null;
      if (Array.isArray(data)) {
        remoteProducts = data.filter(Boolean);
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.record)) {
          remoteProducts = data.record.filter(Boolean);
        } else {
          remoteProducts = Object.values(data).filter(Boolean);
        }
      }

      if (Array.isArray(remoteProducts) && remoteProducts.length > 0) {
        storage.setItem('vault_products', JSON.stringify(remoteProducts));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vaultProductsUpdated', { detail: remoteProducts }));
        }
        return remoteProducts;
      }
    } catch (err) {
      console.warn('[VAULT Cloud Sync] Local cache active. Cloud info:', err.message);
    }
    return null;
  }

  async function syncToCloud(productsToSave) {
    const cfg = getCloudConfig();
    if (!cfg || !cfg.endpoint) return { synced: false, reason: 'No cloud sync configured' };

    try {
      const list = productsToSave || getProducts();
      let fetchUrl = cfg.endpoint.trim();
      let method = 'PUT';
      let headers = { 'Content-Type': 'application/json' };

      if (cfg.type === 'firebase') {
        fetchUrl = fetchUrl.replace(/\/+$/, '');
        if (!fetchUrl.endsWith('.json')) {
          fetchUrl += '/products.json';
        }
      } else if (cfg.type === 'jsonbin') {
        if (cfg.apiKey) headers['X-Master-Key'] = cfg.apiKey.trim();
        fetchUrl = fetchUrl.replace(/\/latest\/?$/, '');
      }

      const res = await fetch(fetchUrl, {
        method,
        headers,
        body: JSON.stringify(list)
      });

      if (!res.ok) throw new Error('Cloud upload status ' + res.status);
      return { synced: true };
    } catch (err) {
      console.warn('[VAULT Cloud Sync] Cloud upload failed:', err.message);
      return { synced: false, error: err.message };
    }
  }

  // Export full products.js ready to replace on disk & push to Netlify
  function exportProductsJS() {
    const products = getProducts();
    const orders = getOrders();
    const wa = getWhatsAppNumber();
    const cloudCfg = getCloudConfig() || { type: 'firebase', endpoint: '', apiKey: '' };

    return `// ==========================================
// VAULT — Central Product & Order Data Store
// Automatically exported from Admin Panel
// Ready for 100% live deployment on Netlify
// ==========================================

const DEFAULT_CLOUD_CONFIG = ${JSON.stringify(cloudCfg, null, 2)};

const INITIAL_PRODUCTS = ${JSON.stringify(products, null, 2)};

const INITIAL_ORDERS = ${JSON.stringify(orders, null, 2)};

${VaultDB.toString()}

if (typeof window !== 'undefined') {
  window.vaultDB = VaultDB();
  if (typeof window.vaultDB.syncFromCloud === 'function') {
    window.vaultDB.syncFromCloud().catch(() => {});
  }
} else if (typeof module !== 'undefined') {
  module.exports = VaultDB();
}
`;
  }

  return {
    getProducts,
    getProductById,
    saveProducts,
    saveProduct,
    deleteProduct,
    resetToInitialProducts,
    getOrders,
    saveOrder,
    updateOrderStatus,
    getWhatsAppNumber,
    setWhatsAppNumber,
    formatWhatsAppOrderLink,
    getCloudConfig,
    setCloudConfig,
    syncFromCloud,
    syncToCloud,
    exportProductsJS
  };
}

if (typeof window !== 'undefined') {
  window.vaultDB = VaultDB();
  if (typeof window.vaultDB.syncFromCloud === 'function') {
    window.vaultDB.syncFromCloud().catch(() => {});
  }
} else if (typeof module !== 'undefined') {
  module.exports = VaultDB();
}
