export class CartService {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.subscribers = [];
    }

    // Obtener items del carrito
    getItems() {
        return this.cart;
    }

    // Obtener el total del carrito
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Añadir item al carrito
    addItem(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity
            });
        }

        this.saveCart();
        this.notifySubscribers();
    }

    // Remover item del carrito
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.notifySubscribers();
    }

    // Actualizar cantidad de un item
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.notifySubscribers();
            }
        }
    }

    // Vaciar carrito
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.notifySubscribers();
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Sistema de suscripción para actualizar la UI
    subscribe(callback) {
        this.subscribers.push(callback);
        // Ejecutar callback inmediatamente con el estado actual
        callback(this.cart);
    }

    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.cart));
    }
}

// Exportar una única instancia del servicio
export const cartService = new CartService();
