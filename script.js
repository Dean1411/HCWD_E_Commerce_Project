let cart = [];
let total =0;

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function () {
        let productContainer = this.closest(".product");

        let itemName = this.getAttribute("data-name");
        let itemPrice = parseFloat(this.getAttribute("data-price"));

        let sizeSelect = productContainer.querySelector(".product-size");
        let selectedSize = sizeSelect ? sizeSelect.value : "";

        let colorSelect = productContainer.querySelector(".product-color");
        let selectedColor = colorSelect ? colorSelect.value : "";

        if (!selectedSize || selectedSize === "Select Size") {
            alert("Please select a size before adding to cart.");
            sizeSelect.style.border = "2px solid red";
            return;
        } else {
            sizeSelect.style.border = "";
        }

        if (colorSelect && (selectedColor === "" || selectedColor === "Select Color")) {
            alert("Please select a color before adding to cart.");
            colorSelect.style.border = "2px solid red";
            return;
        } else if (colorSelect) {
            colorSelect.style.border = "";
        }

        let itemKey = `${itemName} (Size: ${selectedSize}${selectedColor ? `, Color: ${selectedColor}` : ""})`;

        let existingItemIndex = cart.findIndex(item => item.name === itemKey);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ 
                name: itemKey, 
                price: itemPrice,
                quantity: 1
            });
        }
        total += itemPrice;

        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("total", total);

        updateCart();
    });
});


function updateProductImage(productId) {
    const colorSelect = document.getElementById(`color-${productId}`);
    const selectedColor = colorSelect.value;

    const productDiv = colorSelect.closest('.product');
    const productImage = productDiv.querySelector('img');

    const imageSrc = colorSelect.getAttribute(`data-img-${selectedColor.toLowerCase()}`);

    if (imageSrc) {
        productImage.src = imageSrc;
    }
}



window.onload = function() {
    let savedCart = localStorage.getItem("cart");
    let savedTotal = localStorage.getItem("total");

    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    if (savedTotal) {
        total = parseFloat(savedTotal);
    }

    updateCart();
};


function updateCart(){
    let cartList = document.getElementById("cart-list");
    let cartTotal = document.getElementById("cart-total");
    let cartCount = document.getElementById("cart-count");

    cartList.innerHTML = "";
    cart.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${item.name} - R${(item.price * item.quantity).toFixed(2)}
            <br>
            <button onclick="decreaseQuantity(${index})">–</button>
            <span> ${item.quantity} </span>
            <button onclick="increaseQuantity(${index})">+</button>
            <button onclick="removeItem(${index})">X</button>
        `;
        cartList.appendChild(li);
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.length;
}
function increaseQuantity(index) {
    cart[index].quantity += 1;
    total += cart[index].price;

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("total", total);
    updateCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        total -= cart[index].price;
    } else {
        removeItem(index);
        return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("total", total);
    updateCart();
}


function removeItem(index){
    total -= cart[index].price;
    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));  
    localStorage.setItem("total", total);  

    updateCart();
}

function clearCart(){
    cart = [];
    total = 0;

    localStorage.removeItem("cart");  
    localStorage.removeItem("total");  
    
    updateCart();
}


function toggleCart() {
    let cartDropdown = document.getElementById("cart-dropdown");
    cartDropdown.style.display = (cartDropdown.style.display === "block") ? "none" : "block";
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let summary = "You're checking out the following items:\n\n";
    cart.forEach(item => {
        summary += `${item.name} - R${item.price.toFixed(2)}\n`;
    });
    summary += `\nTotal: R${total.toFixed(2)}\n`;

    if (confirm(summary + "\nDo you want to proceed to checkout?")) {

        alert("Thank you for your purchase!");

        clearCart();
    }
}

document.addEventListener("click", function(event){
    let cartDropdown = document.getElementById("cart-dropdown");
    let cartContainer = document.querySelector(".cart-container");

    if (!cartContainer.contains(event.target)){
        cartDropdown.style.display = "none";
    }
});
