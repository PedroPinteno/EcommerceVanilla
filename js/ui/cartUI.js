import { cartService } from '../services/cart.js';

export class CartUI {
    constructor() {
        // Elementos del DOM
        this.cartModal = document.getElementById('cartModal');
        this.cartItems = document.querySelector('.cart-modal__items');
        this.cartTotal = document.querySelector('.cart-modal__total-amount');
        this.cartCount = document.querySelector('.nav__cart-count');
        this.cartIcon = document.querySelector('.nav__cart');
        this.closeButton = document.querySelector('.cart-modal__close');

        // Bindings
        this.toggleCart = this.toggleCart.bind(this);
        this.updateCartUI = this.updateCartUI.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        // Event Listeners
        this.setupEventListeners();

        // Suscribirse a cambios en el carrito
        cartService.subscribe(this.updateCartUI);
    }

    setupEventListeners() {
        this.cartIcon.addEventListener('click', this.toggleCart);
        this.closeButton.addEventListener('click', this.toggleCart);
        document.addEventListener('click', this.handleClickOutside);

        // Delegación de eventos para los items del carrito
        this.cartItems.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const item = button.closest('.cart-item');
            const productId = parseInt(item.dataset.id);

            if (button.classList.contains('quantity-btn')) {
                const action = button.dataset.action;
                const currentItem = cartService.getItems().find(i => i.id === productId);
                
                if (action === 'increase') {
                    cartService.updateQuantity(productId, currentItem.quantity + 1);
                } else if (action === 'decrease') {
                    cartService.updateQuantity(productId, currentItem.quantity - 1);
                }
            } else if (button.classList.contains('remove-btn')) {
                cartService.removeItem(productId);
            }
        });
    }

    toggleCart() {
        this.cartModal.classList.toggle('show');
    }

    handleClickOutside(e) {
        if (this.cartModal.classList.contains('show') && 
            !this.cartModal.contains(e.target) && 
            !this.cartIcon.contains(e.target)) {
            this.toggleCart();
        }
    }

    updateCartUI(cart) {
        // Actualizar contador
        this.cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

        // Actualizar items
        this.cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item__image">
                <div class="cart-item__details">
                    <h4 class="cart-item__name">${item.name}</h4>
                    <p class="cart-item__price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item__quantity">
                        <button class="quantity-btn" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase">+</button>
                    </div>
                </div>
                <button class="remove-btn">&times;</button>
            </div>
        `).join('');

        // Actualizar total
        this.cartTotal.textContent = `$${cartService.getTotal().toFixed(2)}`;

        // Añadir estilos si no existen
        if (!document.getElementById('cartStyles')) {
            const styles = document.createElement('style');
            styles.id = 'cartStyles';
            styles.textContent = `
                .cart-item {
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    border-bottom: 1px solid var(--border-color);
                    position: relative;
                }

                .cart-item__image {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 0.5rem;
                    margin-right: 1rem;
                }

                .cart-item__details {
                    flex: 1;
                }

                .cart-item__name {
                    font-size: var(--normal-font-size);
                    margin-bottom: 0.25rem;
                }

                .cart-item__price {
                    color: var(--primary-color);
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }

                .cart-item__quantity {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .quantity-btn {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background-color: var(--bg-color-alt);
                    color: var(--text-color);
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: .3s;
                }

                .quantity-btn:hover {
                    background-color: var(--primary-color);
                    color: var(--bg-color);
                }

                .remove-btn {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    font-size: 1.25rem;
                    color: var(--text-color-light);
                    cursor: pointer;
                    transition: .3s;
                }

                .remove-btn:hover {
                    color: var(--accent-color);
                }
            `;
            document.head.appendChild(styles);
        }
    }
}

// Exportar una única instancia
export const cartUI = new CartUI();
