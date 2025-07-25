$(function () {
  const addedProducts = new Set()

  console.log(55)

  if (typeof Clerk != undefined && Clerk != undefined) {
    // handle all rendered events
    Clerk("on", "rendered", function (content, data) {
      console.log(content.id)

      createQuantitySpin()

      $(".add-to-cart-form").on("submit", function (e) {
        console.log(9455)
        //alert(1);
        //return false;
        e.preventDefault()
      })

      // Function to add a product to the cart
      function addToCartClerk(productId, qty = 1) {
        if (addedProducts.has(productId)) {
          console.log(`Product ${productId} is already being processed.`)
          return // Exit if already processing this product_id
        }

        addedProducts.add(productId) // Mark this product_id as being processed

        // Your function logic here
        console.log(`Processing product_id: ${productId}`)

        if (qty < 1 || qty == null || qty == undefined) qty = 1

        console.log("Qty: " + qty)

        const token = prestashop.static_token
        const url = prestashop.urls.pages.cart

        const query =
          "controller=cart&add=1&action=update&ajax=true&token=" +
          token +
          "&id_product=" +
          productId +
          "&id_customization=0&qty=" +
          qty

        console.log(url + query)

        $.post(url, query, null, "json")
          .then((resp) => {
            /*prestashop.emit('updateCart', {
								reason: {
									idCustomization: resp.id_customization,
									idProduct: resp.id_product,
									idProductAttribute: resp.id_product_attribute,
									linkAction: "add-to-cart"						
								},
								resp: resp
							});*/
            console.log(resp)

            addedProducts.delete(productId) // Allow processing again after completion
            console.log(`Finished processing product_id: ${productId}`)
          })
          .fail((resp) => {
            //console.log('failed');
            //console.log(resp);
            prestashop.emit("handleError", {
              eventType: "addProductToCart",
              resp: resp,
            })

            addedProducts.delete(productId) // Allow processing again after completion
            console.log(`Finished processing product_id: ${productId}`)
          })
      }

      /*
					$('#live-search .add-to-cart-clerk').on('click', function (e) {

						// Get the quantity input field for the product
						//var quantityInput = document.getElementById('quantity_' + productId);
						//if (quantityInput) {
							//qty = parseInt(quantityInput.value);
						//}

						//alert('add');
						var $product_id = $(this).data('product-id');

						addToCart($product_id, 2);

						//e.preventDefault();
					});
					*/

      $(".add-to-cart-clerk").on("click", function (e) {
        console.log("add-to-cart-clerk-click")

        var $product_id = $(this).data("product-id")
        //addToCart($product_id, 2);
        if ($(this).closest("form").find(".hi-quantity").length > 0) {
          var $qty = $(this).closest("form").find(".hi-quantity").val()
        } else {
          var $qty = 1
        }

        //alert(2);
        //console.log($product_id+' - '+$qty);

        //addToCartClerk($product_id, $qty);

        //alert(2);
        //console.log(567);

        var $this = $(this),
          $this_text = $this.html(),
          form = $this.closest("form"),
          id_product = form.find('input[name="id_product"]').val(),
          id_customization = form.find('input[name="id_customization"]').val()

        $this.data("btn-text", $this_text)

        //$this.text('Sto aggiungendo...');
        $this.html(
          '<img src="/images/mammapack-loader-mp.gif?v=0.1" style="height: 30px; width: 46px;">',
        )

        $this.addClass("btn-add-to-cart-" + id_product + "-" + id_customization)

        //e.preventDefault();
      })

      if (content.id == "jolly-products") {
        var $shipping_value = $("#cart-subtotal-shipping .value").text().trim()

        //console.log($shipping_value);

        if (
          $shipping_value == "Gratis" ||
          $shipping_value == "gratis" ||
          $shipping_value == "Free" ||
          $shipping_value == "free"
        ) {
          $("#" + content.id)
            .closest(".jolly-products-wrap")
            .slideUp(250)
        } else {
          $("#" + content.id)
            .closest(".jolly-products-wrap")
            .slideDown(350)
        }

        $(data.products).each(function (index, element) {
          var $this = element

          /*console.log($this.sku);					
							console.log((()));					
							console.log();*/

          if ($this.sku in free_shipping_products) {
            $(
              '<span class="label-qty">' +
                free_shipping_products[$this.sku] +
                "x</span><br>",
            ).prependTo(
              $("#" + content.id).find(
                ".clerk-item-" + $this.sku + " .clerk_product_name",
              ),
            )

            $("#" + content.id)
              .find(".clerk-item-" + $this.sku + " .hi-quantity")
              .val(free_shipping_products[$this.sku])
          }
        })

        prestashop.on("updateCart", function (event) {
          var $shipping_value = $("#cart-subtotal-shipping .value")
            .text()
            .trim()

          if (
            $shipping_value == "Gratis" ||
            $shipping_value == "gratis" ||
            $shipping_value == "Free" ||
            $shipping_value == "free"
          ) {
            //alert(1);
            $("#" + content.id)
              .closest(".jolly-products-wrap")
              .slideUp(250)
          } else {
            //alert(2);
            $("#" + content.id)
              .closest(".jolly-products-wrap")
              .slideDown(350)
          }
        })
      }
    })
  } // Se Clerk è definito
})

// handle rendered events but only for popular products
/*
		Clerk('on', 'rendered', '#popular', function(content, data) {
		console.log('Clerk.io3467 content rendered with', data);
		});
		*/
