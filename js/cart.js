/* =========================================================
   ORBIT — Cart logic
   All cart state lives in localStorage under ORBIT_CART_KEY
   as an array of { id, qty }. No backend/database is used.
   ========================================================= */

const ORBIT_CART_KEY = "orbit_cart";
const ORBIT_LAST_ORDER_KEY = "orbit_last_order";

const Cart = {
  getItems() {
    try {
      const raw = localStorage.getItem(ORBIT_CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  saveItems(items) {
    localStorage.setItem(ORBIT_CART_KEY, JSON.stringify(items));
  },

  add(productId, qty = 1) {
    const items = this.getItems();
    const existing = items.find((i) => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: productId, qty });
    }
    this.saveItems(items);
  },

  updateQty(productId, qty) {
    let items = this.getItems();
    if (qty <= 0) {
      items = items.filter((i) => i.id !== productId);
    } else {
      const existing = items.find((i) => i.id === productId);
      if (existing) existing.qty = qty;
    }
    this.saveItems(items);
  },

  remove(productId) {
    const items = this.getItems().filter((i) => i.id !== productId);
    this.saveItems(items);
  },

  clear() {
    localStorage.removeItem(ORBIT_CART_KEY);
  },

  count() {
    return this.getItems().reduce((sum, i) => sum + i.qty, 0);
  },

  detailedItems() {
    return this.getItems()
      .map((i) => {
        const product = getProductById(i.id);
        if (!product) return null;
        return { ...product, qty: i.qty, lineTotal: product.price * i.qty };
      })
      .filter(Boolean);
  },

  subtotal() {
    return this.detailedItems().reduce((sum, i) => sum + i.lineTotal, 0);
  },

  shipping() {
    const subtotal = this.subtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 5000 ? 0 : 99;
  },

  total() {
    return this.subtotal() + this.shipping();
  },

  saveLastOrder(order) {
    localStorage.setItem(ORBIT_LAST_ORDER_KEY, JSON.stringify(order));
  },

  getLastOrder() {
    try {
      const raw = localStorage.getItem(ORBIT_LAST_ORDER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
};
