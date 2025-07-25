const formatters = {
    currency_converter: function (price) {
        const country = Shopify.country;
        const shopifyCurrency = Shopify.currency.code;
        const currencyRate = Shopify.currency.rate;

        let net_price = price / 1.25;
        let converted_price = net_price * currencyRate;

        const eurTaxRates = {
            FR: 0.20, DE: 0.19, IT: 0.22, ES: 0.21, FI: 0.255, IE: 0.23
        };
        const nokTaxRates = {
            CZ: 0.25, CR: 0.21, BG: 0.20, AT: 0.20, BE: 0.21, EE: 0.22,
            GR: 0.24, LV: 0.21, LT: 0.21, LU: 0.17, MT: 0.18, NL: 0.21,
            PT: 0.23, RO: 0.19, SK: 0.20, SI: 0.22
        };

        let taxRate = 0.25;
        let roundBy = 1;

        if (shopifyCurrency === 'EUR') {
            taxRate = eurTaxRates[country] || taxRate;
            converted_price *= (1 + taxRate);
            converted_price = Math.floor(converted_price) + 0.95;
        } else if (shopifyCurrency === 'DKK') {
            converted_price *= 1.25;
            converted_price = Math.ceil(converted_price);
        } else if (shopifyCurrency === 'PLN') {
            taxRate = 0.23;
            converted_price *= (1 + taxRate);
            converted_price = Math.ceil(converted_price);
        } else if (shopifyCurrency === 'SEK') {
            converted_price *= 1.25;
            converted_price = Math.ceil(converted_price);
        } else if (shopifyCurrency === 'HUF') {
            taxRate = 0.27;
            converted_price *= (1 + taxRate);
            converted_price = Math.ceil(converted_price / 100) * 100;
        } else if (shopifyCurrency === 'NOK') {
            taxRate = nokTaxRates[country] || taxRate;
            converted_price *= (1 + taxRate);
        } else {
            converted_price *= (1 + taxRate);
            converted_price = Math.ceil(converted_price / roundBy) * roundBy;
        }

        return converted_price.toFixed(2).toString();
    }
};

formatters: {
    currency_converter: function (price) {
        let roundBy;
        let taxRate;

        let net_price = price / 1.25;
        let converted_price = net_price * Shopify.currency.rate;

        const country = Shopify.country;

        switch (shopifyCurrency) {
         case 'EUR':
                switch (country) {
                    case 'FR':
                        taxRate = 0.20;
                        break;
                    case 'DE':
                        taxRate = 0.19;
                        break;
                    case 'IT':
                        taxRate = 0.22;
                        break;
                    case 'ES':
                        taxRate = 0.21;
                        break;
                    case 'FI':
                        taxRate = 0.255;
                        break;
                    case 'IE':
                        taxRate = 0.23;
                        break;
                    default:
                        taxRate = 0.25;
                        break;
                }
                converted_price = converted_price * (1 + taxRate);
                converted_price = Math.floor(converted_price) + 0.95;
                break;
            case 'DKK':
                taxRate = 0.25;
                roundBy = 1;
                converted_price = converted_price * (1 + taxRate);
                converted_price = Math.ceil(converted_price / roundBy) * roundBy;
                break;
            case 'PLN':
                taxRate = 0.23;
                roundBy = 1;
                converted_price = converted_price * (1 + taxRate);
                converted_price = Math.ceil(converted_price / roundBy) * roundBy;
                break;
            case 'SEK':
                taxRate = 0.25;
                roundBy = 1;
                converted_price = converted_price * (1 + taxRate);
                converted_price = Math.ceil(converted_price / roundBy) * roundBy;
                break;
            case 'HUF':
                taxRate = 0.27;
                roundBy = 100;
                converted_price = converted_price * (1 + taxRate);
                converted_price = Math.ceil(converted_price / roundBy) * roundBy;
                break;
            case 'NOK':
              switch (country) {
                  case 'CZ':
                      taxRate = 0.25;
                      break;
                  case 'CR':
                      taxRate = 0.21;
                      break;
                  case 'BG':
                      taxRate = 0.20;
                      break;
                  case 'AT':
                      taxRate = 0.20;
                      break;
                  case 'BE':
                      taxRate = 0.21;
                      break;
                  case 'EE':
                      taxRate = 0.22;
                      break;
                  case 'GR':
                      taxRate = 0.24;
                      break;
                  case 'LV':
                      taxRate = 0.21;
                      break;
                  case 'LT':
                      taxRate = 0.21;
                      break;
                  case 'LU':
                      taxRate = 0.17;
                      break;
                  case 'MT':
                      taxRate = 0.18;
                      break;
                  case 'NL':
                      taxRate = 0.21;
                      break;
                  case 'PT':
                      taxRate = 0.23;
                      break;
                  case 'RO':
                      taxRate = 0.19;
                      break;
                  case 'SK':
                      taxRate = 0.20;
                      break;
                  case 'SI':
                      taxRate = 0.22;
                      break;
                  default:
                      taxRate = 0.25;
                      break;
              }
                converted_price = converted_price * (1 + taxRate);
                break;
            default:
                taxRate = 0.25;
                roundBy = 1;
                converted_price = converted_price * (1 + taxRate);
                converted_price = Math.ceil(converted_price / roundBy) * roundBy;
                break;
        }

        return converted_price.toFixed(2).toString();
    }
}