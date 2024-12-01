// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 249.99,
        description: "Premium over-ear headphones with advanced noise cancellation technology.",
        image: "images/headphones.webp",
        category: "Audio"
    },
    {
        id: 2,
        name: "Smart 4K Ultra HD Television",
        price: 599.99,
        description: "55-inch OLED TV with HDR and smart home integration.",
        image: "images/tv.avif",
        category: "Electronics"
    },
    {
        id: 3,
        name: "Fitness Smartwatch",
        price: 179.99,
        description: "Advanced fitness tracker with heart rate monitoring and GPS.",
        image: "images/smartwatch.jpg",
        category: "Wearables"
    },
    {
        id: 4,
        name: "Portable Bluetooth Speaker",
        price: 89.99,
        description: "Waterproof speaker with 360-degree sound and 12-hour battery life.",
        image: "images/speaker.jpg",
        category: "Audio"
    },
    {
        id: 5,
        name: "Professional Camera",
        price: 1299.99,
        description: "Mirrorless digital camera with 4K video capability.",
        image: "images/camera.jpg",
        category: "Electronics"
    },
    {
        id: 6,
        name: "Gaming Console",
        price: 499.99,
        description: "Next-gen gaming console with 4K gaming and ray tracing.",
        image: "images/console.avif",
        category: "Gaming"
    },
    {
        id: 7,
        name: "Wireless Earbuds",
        price: 159.99,
        description: "True wireless earbuds with active noise cancellation.",
        image: "images/earbuds.webp",
        category: "Audio"
    },
    {
        id: 8,
        name: "Tablet Pro",
        price: 799.99,
        description: "12.9-inch tablet with high-resolution display and stylus support.",
        image: "images/tablet.png",
        category: "Electronics"
    },
    {
        id: 9,
        name: "Smart Home Security Camera",
        price: 129.99,
        description: "1080p wireless security camera with night vision.",
        image: "images/security-camera.jpg",
        category: "Smart Home"
    },
    {
        id: 10,
        name: "Mechanical Keyboard",
        price: 149.99,
        description: "RGB mechanical gaming keyboard with custom switches.",
        image: "images/keyboard.jpg",
        category: "Gaming"
    },
    {
        id: 11,
        name: "Wireless Mouse",
        price: 79.99,
        description: "Ergonomic wireless mouse with precision tracking.",
        image: "images/mouse.avif",
        category: "Electronics"
    },
    {
        id: 12,
        name: "Smart Display",
        price: 229.99,
        description: "10-inch smart display with voice assistant integration.",
        image: "images/smart-display.avif",
        category: "Smart Home"
    }
];

// State Management
let cart = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const productModal = document.getElementById('productModal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close-btn');
const cartIcon = document.querySelector('.cart-icon');
const cartElement = document.getElementById('cart');
const closeCartBtn = document.querySelector('.close-cart');

// Cart Toggle
cartIcon.addEventListener('click', () => {
    cartElement.classList.toggle('visible');
});

closeCartBtn.addEventListener('click', () => {
    cartElement.classList.remove('visible');
});

// Render Products
function renderProducts(productsToRender) {
    productGrid.innerHTML = '';
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img 
                src="${product.image}" 
                alt="${product.name}" 
                class="product-image"
            >
            <div class="product-details">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button 
                    class="add-to-cart" 
                    aria-label="Add ${product.name} to cart"
                >Add to Cart</button>
            </div>
        `;

        // Add click event to the entire card (except the Add to Cart button)
        productCard.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                showProductDetails(product);
            }
        });

        productCard.querySelector('.add-to-cart').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent modal from opening when clicking Add to Cart
            addToCart(product);
        });

        productGrid.appendChild(productCard);
    });
}

// Add to Cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }

    updateCart();
}

// Update Cart
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span class="material-icons empty-cart-icon">shopping_cart</span>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img 
                    src="${item.image}" 
                    alt="${item.name}" 
                    class="cart-item-image"
                >
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <span class="cart-item-quantity">Quantity: ${item.quantity}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease" aria-label="Decrease quantity">
                        <span class="material-icons">remove</span>
                    </button>
                    <button class="quantity-btn increase" aria-label="Increase quantity">
                        <span class="material-icons">add</span>
                    </button>
                    <button class="remove-item" aria-label="Remove ${item.name} from cart">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            `;

            // Add event listeners for quantity buttons
            cartItem.querySelector('.decrease').addEventListener('click', () => {
                removeFromCart(item.id);
            });

            cartItem.querySelector('.increase').addEventListener('click', () => {
                addToCart(item);
            });

            cartItem.querySelector('.remove-item').addEventListener('click', () => {
                cart = cart.filter(cartItem => cartItem.id !== item.id);
                updateCart();
            });

            cartItems.appendChild(cartItem);
            total += item.price * item.quantity;
        });
    }

    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
    updateCartCount();
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Remove from Cart
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else {
            cart.splice(itemIndex, 1);
        }
        updateCart();
    }
}

// Show Product Details
function showProductDetails(product) {
    modalContent.innerHTML = `
        <div class="modal-grid">
            <div class="modal-image-container">
                <img src="${product.image}" alt="${product.name}" class="modal-image">
            </div>
            <div class="modal-details">
                <h2>${product.name}</h2>
                <p class="modal-description">${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button 
                    class="add-to-cart" 
                    aria-label="Add ${product.name} to cart"
                >Add to Cart</button>
            </div>
        </div>
    `;

    modalContent.querySelector('.add-to-cart').addEventListener('click', () => {
        addToCart(product);
    });

    productModal.style.display = 'block';
}

// Search Functionality
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.category.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
});

// Close Modal
closeBtn.addEventListener('click', () => {
    productModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
});

// Initial Render
renderProducts(products);