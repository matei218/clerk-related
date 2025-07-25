function updatePricesAndDisplayFromPrice() {
    var productCards = document.querySelectorAll('.product-card');

    productCards.forEach(function(productElement, cardIndex) {
        console.log(`Processing product card #${cardIndex + 1}`);

        var type = productElement.getAttribute('data-clerk-product-type');
        var prices = productElement.getAttribute('data-clerk-product-b-pr');
        var statuses = productElement.getAttribute('data-clerk-product-c-st');
        var stocks = productElement.getAttribute('data-clerk-product-c-sto');
        var argangs = productElement.getAttribute('data-clerk-product-argangs');
        var cPrices = productElement.getAttribute('data-clerk-product-c-pr');
        var cat1021 = productElement.getAttribute('data-clerk-product-cat-1021');
        var packageQuantities = productElement.getAttribute('data-clerk-product-cat-1021');
        var childBichelQtys = productElement.getAttribute('data-clerk-product-child-bichel-qty');
        var norPrice = parseFloat(productElement.getAttribute('data-clerk-product-nor-peice')) || 0;

        if (statuses) statuses = statuses.split(',');
        if (stocks) stocks = stocks.split(',').map(Number);
        if (packageQuantities) packageQuantities = packageQuantities.split(',');
        if (childBichelQtys) childBichelQtys = childBichelQtys.split(',');

        console.log(`Type: ${type}, Prices: ${prices}, Child Bichel Qty: ${childBichelQtys}`);

        if (!type || (!prices && type === 'configurable') || (!argangs && type === 'simple')) return;

        if (type === 'simple') {
            cPrices = cPrices.split(',').map(Number);
            var smallestPrice = Math.min(...cPrices);
            console.log(`Smallest price for simple product: ${smallestPrice}`);

            var priceElement = productElement.querySelector('.product_price_number .final_price');
            if (priceElement) priceElement.textContent = `${smallestPrice} kr.`;

            var fromPriceElement = productElement.querySelector('.from_price');
            if (fromPriceElement) fromPriceElement.style.display = 'none';

            var fullPriceElement = productElement.querySelector('.full_price');
            if (fullPriceElement) {
                if (norPrice > smallestPrice) {
                    fullPriceElement.textContent = `${norPrice}`;
                    fullPriceElement.style.display = 'block';
                } else {
                    fullPriceElement.style.display = 'none';
                }
            }

        } else if (type === 'configurable') {
            prices = prices.split(',').map(Number);
            argangs = argangs.split(',').map(Number);
            cPrices = cPrices.split(',').map(Number);

            var allOutOfStock = stocks.every(stock => stock === 0);

            if (allOutOfStock) {
                var latestArgangIndex = argangs.indexOf(Math.max(...argangs));
                var latestPrice = prices[latestArgangIndex];
                console.log(`All out of stock. Latest price: ${latestPrice}`);

                var priceElement = productElement.querySelector('.product_price_number .final_price');
                if (priceElement) priceElement.textContent = `${latestPrice} kr.`;

                var fromPriceElement = productElement.querySelector('.from_price');
                if (fromPriceElement) fromPriceElement.style.display = 'none';

            } else {
                var validPrices = [];
                var validCPrices = [];
                var validBichelQtys = [];
                var activeAndInStockCount = 0;

                for (var i = 0; i < statuses.length; i++) {
                    if (statuses[i] === 'Aktiveret' && stocks[i] > 0) {
                        validPrices.push(prices[i]);
                        validCPrices.push(cPrices[i]);
                        validBichelQtys.push(childBichelQtys[i]);
                        activeAndInStockCount++;
                        console.log(`Active and in stock at index ${i}: Price: ${prices[i]}, Bichel Qty: ${childBichelQtys[i]}`);
                    }
                }

                var lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
                var highestPrice = validPrices.length > 0 ? Math.max(...validPrices) : null;
                var distinctPrices = [...new Set(validPrices)];

                var priceElement = productElement.querySelector('.product_price_number .final_price');
                if (priceElement && lowestPrice !== null) priceElement.textContent = `${lowestPrice} kr.`;

                var fromPriceElement = productElement.querySelector('.from_price');
                if (fromPriceElement) {
                    fromPriceElement.style.display = (distinctPrices.length > 1 && highestPrice > lowestPrice) ? 'block' : 'none';
                }

                var lowestPriceIndex = validPrices.indexOf(lowestPrice);
                var correspondingFullPrice = validCPrices[lowestPriceIndex];
                var correspondingBichelQty = validBichelQtys[lowestPriceIndex];
                console.log(`Lowest price: ${lowestPrice}, Corresponding full price: ${correspondingFullPrice}, Corresponding Bichel Qty: ${correspondingBichelQty}`);

                var fullPriceElement = productElement.querySelector('.full_price');
                if (fullPriceElement) {
                    if (correspondingFullPrice > lowestPrice) {
                        fullPriceElement.textContent = `${correspondingFullPrice}`;
                        fullPriceElement.style.display = 'block';
                    } else {
                        fullPriceElement.style.display = 'none';
                    }
                }

                var bichelQtyElement = productElement.querySelector('.bichel_qty');
                if (bichelQtyElement && correspondingBichelQty) {
                    bichelQtyElement.textContent = `Stykpris ved ${correspondingBichelQty} stk.`;
                    bichelQtyElement.style.display = 'block';
                    console.log(`Updated bichel_qty with: Stykpris ved ${correspondingBichelQty} stk.`);
                }
            }
        }

        if (cat1021) {
            var glassAmountElement = productElement.querySelector('.glass_amount');
            var bichelQtyElement = productElement.querySelector('.bichel_qty');

            if (!Array.isArray(statuses) || !Array.isArray(stocks) || !Array.isArray(packageQuantities)) return;

            var childIndexInStock = -1;
            for (var i = 0; i < statuses.length; i++) {
                if (statuses[i] === 'Aktiveret' && stocks[i] > 0) {
                    if (packageQuantities[i]) childIndexInStock = i;
                    break;
                }
            }

            if (childIndexInStock !== -1 && glassAmountElement && bichelQtyElement) {
                glassAmountElement.style.display = 'block';
                bichelQtyElement.style.display = 'none';
                glassAmountElement.innerText = packageQuantities[childIndexInStock];
                console.log(`Updated glass_amount with package quantity: ${packageQuantities[childIndexInStock]}`);
            }
        }
    });
}

updatePricesAndDisplayFromPrice();