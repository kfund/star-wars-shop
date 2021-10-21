const productsArea = document.querySelector('.product-area');
const productsItem = document.querySelector('.total-count');
const clearBtn = document.querySelector('.clear-cart');
const totalCount = document.querySelector('.total-count');
const popupContent = document.querySelector('.list-group');
const openCart = document.querySelector('.open-cart');
const successAddToCart = document.querySelector('.alert-success');
const succesOverlay = document.querySelector('.overlay');

let cart = [];
let totalQty = 0;
const mock = 'codebeautify.json';

var active = document.getElementById("burger");
// add Event Listener Click to Burger Icon Container
active.addEventListener("click", function() {
  //add or remove class "active" to Burger to start animation
  this.classList.toggle("active");
  //get menu-container by id
  var menuShow = document.getElementById("menu");
  //add or remove class "show" to show or hide menu and start its animations
  menuShow.classList.toggle("show");
});


class App {

  async getProducts() {
    try {
      let result = await fetch('codebeautify.json');
      let data = await result.json();
      let products = data.arrayOfProducts;
      return products

    }
    catch (error) {
      console.log(error)
    }
  }
  renderContent(products) {
    if (sessionStorage.getItem("shoppingCart") != null) {
      this.loadCart();
      totalCount.innerHTML = this.getTotalsCount(cart);
    }
    products.forEach(item => {
      productsArea.innerHTML += `
      <div class="col" style="margin-bottom: 20px;">
        <div class="p-3 border bg-light">
        <div class="card" style="padding-top: 10px;">
          <img style="width: 100%; max-width: 200px; margin: 0 auto;" src='${item.imgUrl}'> 
          <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text"> Price <span class="text-success fst-italic"> ${item.price}$</span></p>
              <button onclick="updateTotal()" data-name="${item.name}" data-price="${item.price}" id= "add-to-cart" type="button" class="shadow-none btn btn-success add-to-cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                </svg>
                Add to cart
              </button>
          </div>
        </div>
      </div>
    </div>`
    })
  }
  renderCart(cartItem) {
    if (cartItem.length === 0) {
      popupContent.innerHTML = `No item in cart`
    }
    else {
      popupContent.innerHTML = ``;
      cartItem.forEach(item => {
        popupContent.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
        <div style="width: 50%;">
        ${item.name} 
        </div>
        <div>
        <span class="fs-6 cart-price">${item.price}</span><span class="fs-6">$</span>
        </div>
        <div>
        <i class="fas fa-plus" onclick="plusCount(this)"></i>
        <span class="badge rounded-pill bg-success count-number" style="margin: 0 10px;">${item.count}</span>
        <i class="fas fa-minus" onclick="minusCount(this)"></i>
        </div>
      </li>`
      })
      updateTotal()
    }

  }
  loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }
  saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
  }
  updateCount() {
    
  }
  clearCart = function () {
    cart = [];
    this.saveCart();
    totalCount.innerHTML = this.getTotalsCount(cart);
    this.renderCart(cart);

    document.querySelector('.total-sum').innerHTML = 0
  }
  addItemToCart(name, price, count) {
    if (!name || !price || !count) {
      alert('not so fast'); return
    }
    for (var item in cart) {
      if (cart[item].name === name) {
        cart[item].count++;
        this.saveCart();

        return;
      }
    }
    const obj = { name, price, count }
    cart.push(obj);
    this.saveCart();
  }
  addToCart() {
    document.querySelectorAll('.add-to-cart').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        let currentData = e.target.dataset;
        if (!currentData) {
          e.target.disabled = true;
          return
        }
        e.target.disabled = false;
        this.addItemToCart(currentData.name, currentData.price, 1);
        totalCount.innerHTML = this.getTotalsCount(cart);
        this.addToCartPopupRender(currentData.name)
      })
    })
  }
  addToCartPopupRender(name) {
    successAddToCart.style.display = 'block';
    succesOverlay.style.display = 'block';
    setTimeout(()=>{
      successAddToCart.style.display = 'none';
      succesOverlay.style.display = 'none'
    }, 2000)
    successAddToCart.innerHTML = `Tnx, ${name} added to cart`
  }
  getTotalsCount(cartItem) {
    let currentQty = 0;
    cartItem.forEach(item => currentQty += item.count);

    return currentQty
  }
  addEventListeners() {
    clearBtn.addEventListener('click', () => {
      this.clearCart();
    })
    openCart.addEventListener('click', () => {
      this.renderCart(cart);
    })
  }

}

document.addEventListener('DOMContentLoaded', () => {
  const products = new App;
  products.getProducts()
    .then(data => products.renderContent(data))
    .then(() => products.addEventListeners())
    .then(() => products.addToCart())
    .then(() => products.renderCart(cart))
})

function updateTotal () {
  let sum = 0

  document.querySelectorAll('.cart-price').forEach(element => {
    sum = sum + Number(element.innerHTML)
  });

  document.querySelector('.total-sum').innerHTML = Number(sum)
}

function plusCount (element) {
  element.parentElement.querySelector('.badge').innerHTML++
  element.parentElement.parentElement.querySelector('.cart-price').innerHTML *= 2

  updateTotal()
}

function minusCount (element) {
  if ( Number(element.parentElement.querySelector('.count-number').innerHTML) >= 2 ) {
    element.parentElement.querySelector('.badge').innerHTML--
    element.parentElement.parentElement.querySelector('.cart-price').innerHTML /= 2
  }
  updateTotal()
}