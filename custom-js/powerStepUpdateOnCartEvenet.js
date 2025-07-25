(function(open) {
    const mediaQueryDesktop = window.matchMedia('(min-width: 1000px)');
    const productIds = new Set(JSON.parse(localStorage.getItem('productIds')) || []);

    function updateLocalStorage() {
        localStorage.setItem('productIds', JSON.stringify(Array.from(productIds)));
    }

    function appendSpanToElement(container, productIds) {
        if (!container) {
            console.error('Container is undefined or not found for appending span.');
            return;
        }

        const spanElement = document.createElement('span');
        spanElement.className = 'clerk_init';
        spanElement.setAttribute('data-products', JSON.stringify(Array.from(productIds)));
        spanElement.setAttribute('data-template', '@cart-drawer-2-others-also-bought');
        container.appendChild(spanElement);
        Clerk('content', '.clerk_init');
    }

    function appendSpanToCartElement(productId) {
        const cartElement = document.querySelector('.cart-toggle-singleprod ul.t-striped');

        if (!cartElement) {
            console.error('ul.t-striped not found. Retrying...');
            return;
        }

        /*
            const existingSpan = cartElement.querySelector(`span[data-products*="${productId}]"]`);
            if (existingSpan) {
                console.log(`Span element for product ID ${productId}] already exists.`);
                return;
            }
        */
        setTimeout(() => {
            const spanElement = document.createElement('span');
            spanElement.className = 'clerk_init';
            spanElement.setAttribute('data-products', `[${productId}]`);
            spanElement.setAttribute('data-template', '@cart-drawer-2-others-also-bought');
            cartElement.appendChild(spanElement);

            Clerk('content', '.clerk_init');
        }, 1500);
    }

    setTimeout(() => {
        const basketHolder = document.querySelector('.basket');
        if (!basketHolder) {
            console.error('.basket element not found.');
            return;
        }

        const basketIcon = basketHolder.querySelector('.cart_link');
        if (!basketIcon) {
            console.error('.cart_link element not found within .basket.');
            return;
        }

        basketIcon.addEventListener('click', () => {
            const stripedElement = basketHolder.querySelector('ul.t-striped');
            if (stripedElement) {
                appendSpanToElement(stripedElement, productIds);
            } else {
                console.error('ul.t-striped element not found in basketHolder.');
            }
        });
    }, 1500);

    if (!mediaQueryDesktop.matches) {
        setTimeout(() => {
            const mobileCartOpenButtons = document.querySelectorAll('.mobile-cart .open_cart');
            if (mobileCartOpenButtons.length > 1) {
                mobileCartOpenButtons[1].addEventListener('click', () => {
                    const stripedElement = document.querySelectorAll('.mobile-cart ul.t-striped')[1];
                    if (stripedElement) {
                        appendSpanToElement(stripedElement, productIds);
                    } else {
                        console.error('Second ul.t-striped element not found in mobile cart.');
                    }
                });
            } else {
                console.error('Not enough mobile cart open buttons found.');
                return;
            }

            const mobileMenuOpenButton = document.querySelector('.mobile-menu .open_cart');
            if (!mobileMenuOpenButton) {
                console.error('.open_cart element not found in mobile menu.');
                return;
            }

            mobileMenuOpenButton.addEventListener('click', () => {
                const stripedElements = document.querySelectorAll('.mobile-menu ul.t-striped');
                if (stripedElements.length > 0) {
                    appendSpanToElement(stripedElements[0], productIds);
                } else {
                    console.error('ul.t-striped elements not found in mobile menu.');
                }
            });
        }, 1500);
    }

    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        const xhr = this;

        if (url.includes('/actions/cart/add')) {
            this.addEventListener('load', function() {
                const response = JSON.parse(xhr.responseText);
                if (!response.itemId || response.itemId.length === 0) {
                    console.error('No itemId found in the add to cart response.');
                    return;
                }

                const productId = response.itemId[0].product;
                productIds.add(productId);
                updateLocalStorage();
                appendSpanToCartElement(productId);
            });
        } else if (url.includes('/actions/cart/remove')) {
            this.addEventListener('load', function() {
                const response = JSON.parse(xhr.responseText);
                if (!response.itemId) {
                    console.error('No itemId found in the remove from cart response.');
                    return;
                }

                const productId = response.itemId.product;
                productIds.delete(productId);
                updateLocalStorage();
            });
        }

        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);
