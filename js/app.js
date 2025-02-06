import { cartUI } from './ui/cartUI.js';
import { productsUI } from './ui/productsUI.js';

// Clase principal de la aplicación
class App {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        // Inicializar componentes
        this.cartUI = cartUI;
        this.productsUI = productsUI;

        // Añadir funcionalidad de menú móvil
        this.setupMobileMenu();
    }

    setupMobileMenu() {
        const menuButton = document.createElement('button');
        menuButton.className = 'nav__toggle';
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        
        const nav = document.querySelector('.nav');
        const menu = document.querySelector('.nav__menu');
        
        nav.insertBefore(menuButton, menu);

        menuButton.addEventListener('click', () => {
            menu.classList.toggle('show');
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('show');
            });
        });

        // Añadir estilos para el menú móvil si no existen
        if (!document.getElementById('mobileStyles')) {
            const styles = document.createElement('style');
            styles.id = 'mobileStyles';
            styles.textContent = `
                .nav__toggle {
                    display: none;
                    font-size: 1.25rem;
                    cursor: pointer;
                    color: var(--text-color);
                    transition: .3s;
                }

                @media screen and (max-width: 768px) {
                    .nav__toggle {
                        display: block;
                    }

                    .nav__menu {
                        position: fixed;
                        top: 4rem;
                        left: -100%;
                        width: 80%;
                        height: 100vh;
                        padding: 2rem;
                        background-color: var(--bg-color);
                        box-shadow: 2px 0 4px rgba(0,0,0,.1);
                        transition: .4s;
                    }

                    .nav__menu.show {
                        left: 0;
                    }

                    .nav__list {
                        flex-direction: column;
                    }

                    .nav__item {
                        margin: 1.5rem 0;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
