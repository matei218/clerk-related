<?php
// Ensure WooCommerce is active before running price-related code
if (class_exists('WooCommerce')) {
  $product_id = 109274; // Replace with your product ID
  $product = wc_get_product($product_id);

  if ($product) {
      $price = wc_get_price_including_tax($product, array('price' => $product->get_price()));
      $list_price = wc_get_price_including_tax($product, array('price' => $product->get_regular_price()));

      $price_excl_tax = wc_get_price_excluding_tax($product, array('price' => $product->get_price()));
      $list_price_excl_tax = wc_get_price_excluding_tax($product, array('price' => $product->get_regular_price()));

      echo '<div id="product-price-' . esc_attr($product_id) . '" class="product-price-info" style="background: #fff; padding: 15px; margin: 20px 0; border: 1px solid #ddd;">';
      echo "<h2>Product Pricing Information</h2>";
      echo "<p><strong>Product:</strong> " . esc_html($product->get_name()) . "</p>";
      echo "<p><strong>Price (Incl. Tax):</strong> <span id='price-incl-tax'>" . wc_price($price) . "</span></p>";
      echo "<p><strong>Regular Price (Incl. Tax):</strong> <span id='list-price-incl-tax'>" . wc_price($list_price) . "</span></p>";
      echo "<p><strong>Price (Excl. Tax):</strong> <span id='price-excl-tax'>" . wc_price($price_excl_tax) . "</span></p>";
      echo "<p><strong>Regular Price (Excl. Tax):</strong> <span id='list-price-excl-tax'>" . wc_price($list_price_excl_tax) . "</span></p>";
      echo '</div>';
  } else {
      echo '<p style="color: red;">Product not found. Please check the Product ID.</p>';
  }
} else {
  echo '<p style="color: red;">WooCommerce is not active. Please activate WooCommerce to see product prices.</p>';
}
?>
