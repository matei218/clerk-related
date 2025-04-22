			<?php
				// Ensure WooCommerce is active before running price-related code
				if (class_exists('WooCommerce')) {
					$product_id = 109274; // Replace with your product ID
					$product = wc_get_product($product_id);

					if ($product) {
						$price = wc_get_price_including_tax($product, array('price' => $product->get_price()));
						$list_price = wc_get_price_including_tax($product, array('price' => $product->get_regular_price()));
						$sale_price = wc_get_price_including_tax($product, array('price' => $product->get_sale_price()));

						$price_excl_tax = wc_get_price_excluding_tax($product, array('price' => $product->get_price()));
						$list_price_excl_tax = wc_get_price_excluding_tax($product, array('price' => $product->get_regular_price()));
						$sale_price_excl_tax = wc_get_price_excluding_tax($product, array('price' => $product->get_sale_price()));

						$discount = method_exists($product, 'get_discount') ? $product->get_discount() : 0;
						$discounted_price = method_exists($product, 'get_discounted_price') ? $product->get_discounted_price() : $sale_price;
						$discounted_price_cents = method_exists($product, 'get_discounted_price_in_cents') ? $product->get_discounted_price_in_cents() : 0;
						$discounts = method_exists($product, 'get_discounts') ? $product->get_discounts() : [];

						$has_discount = $discount > 0 ? 'Yes' : 'No';
						
						// Calculate original sale price before discount
						$sale_price_before_discount = ($discount > 0) ? $discounted_price / (1 - ($discount / 100)) : $sale_price;

						echo '<div id="product-price-' . esc_attr($product_id) . '" class="product-price-info" style="background: #fff; padding: 15px; margin: 20px 0; border: 1px solid #ddd;">';
						echo "<h2>Product Pricing Information</h2>";
						echo "<p><strong>Product:</strong> " . esc_html($product->get_name()) . "</p>";
						echo "<p><strong>Price (Incl. Tax):</strong> <span id='price-incl-tax'>" . wc_price($price) . "</span></p>";
						echo "<p><strong>Regular Price (Incl. Tax):</strong> <span id='list-price-incl-tax'>" . wc_price($list_price) . "</span></p>";
						echo "<p><strong>Sale Price (Incl. Tax):</strong> <span id='sale-price-incl-tax'>" . wc_price($sale_price) . "</span></p>";
						echo "<p><strong>Price (Excl. Tax):</strong> <span id='price-excl-tax'>" . wc_price($price_excl_tax) . "</span></p>";
						echo "<p><strong>Regular Price (Excl. Tax):</strong> <span id='list-price-excl-tax'>" . wc_price($list_price_excl_tax) . "</span></p>";
						echo "<p><strong>Sale Price (Excl. Tax):</strong> <span id='sale-price-excl-tax'>" . wc_price($sale_price_excl_tax) . "</span></p>";
						echo "<p><strong>Formatted Price HTML:</strong> " . $product->get_price_html() . "</p>";
						echo "<p><strong>Discount:</strong> " . esc_html($discount) . "</p>";
						echo "<p><strong>Discounted Price:</strong> " . wc_price($discounted_price) . "</p>";
						echo "<p><strong>Discounted Price (Cents):</strong> " . esc_html($discounted_price_cents) . " cents</p>";
						echo "<p><strong>Has Discount:</strong> " . esc_html($has_discount) . "</p>";
						echo "<p><strong>Original Sale Price Before Discount (Incl. Tax):</strong> <span id='sale-price-before-discount'>" . wc_price($sale_price_before_discount) . "</span></p>";
						echo "<p><strong>All Discounts:</strong></p><ul>";
						if (!empty($discounts)) {
							foreach ($discounts as $key => $value) {
								echo "<li><strong>" . esc_html($key) . ":</strong> " . esc_html($value) . "</li>";
							}
						} else {
							echo "<li>No discounts available.</li>";
						}
						echo "</ul>";
						echo '</div>';
					} else {
						echo '<p style="color: red;">Product not found. Please check the Product ID.</p>';
					}
				} else {
					echo '<p style="color: red;">WooCommerce is not active. Please activate WooCommerce to see product prices.</p>';
				}
				?>
