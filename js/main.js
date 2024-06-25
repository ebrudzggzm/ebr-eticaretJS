const categoryImage = document.querySelector(".cards");
const productsList = document.querySelector(".productCards");
const modal = document.querySelector(".modal-wrapper");
const openBtn = document.getElementById("open-btn");
const closeBtn = document.getElementById("close-btn");
const modalBasket = document.querySelector(".modal-list");
const modalInfo = document.querySelector("#modal-info");
//console.log(modal,closeBtn,openBtn); kontrol et

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
});

const fetchCategories = () => {
  fetch("https://api.escuelajs.co/api/v1/categories")
    .then((response) => response.json())
    .then((data) =>
      data.slice(0, 4).forEach((element) => {
        console.log(element, "element");
        const { image, name } = element;
        const categoryDiv = document.createElement("div");
        console.log("Image URL:", element.image);
        categoryDiv.innerHTML = `<img src="${image}" alt="categoryImage"/>
                    <button>${name}</button>`;
        categoryImage.appendChild(categoryDiv);
      })
    )
    .catch((err) => console.log(err));
};

function fetchProducts() {
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 25).forEach((item) => {
        const productsDiv = document.createElement("div");
        productsDiv.classList.add("productCard");
        //const edittedUrl = item.images[0].replace(".jpeg", "");
        productsDiv.innerHTML = `
                    <div>
                        <img src="${item.image}" alt="productImage"/>
                    </div>
                    <p>${item.title}</p>
                    <p>${item.category}</p>                    
                    <div>
                        <p>${item.price} $</p>
                        <button onclick="addToBasket({id:${item.id},title:'${item.title}',price:'${item.price}',img:'${item.image}',amount:1})">Sepete Ekle</button>
                    </div>
                `;
        productsList.appendChild(productsDiv);
      })
    )
    .catch((err) => console.log(err));
}

//sepet
let basket = [];
let total = 0;
//açma ve kapatma

openBtn.addEventListener("click", () => {
  modal.classList.add("active");
  addList();
  //sepet açıldı toplam bilgisin güncelle
  modalInfo.innerText = total;
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  //sepeti kapatınca içi temizlensin ki yeniden açınca ürünleri çoklamasın.
  modalBasket.innerHTML = "";
  //sepet açıldı toplam bilgisin sıfırla
  total = 0;
});
modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-wrapper")) {
    modal.classList.remove("active");
  }
});
//sepete ürünleri listeleme
const addList = () => {
  basket.forEach((basketItem) => {
    console.log(basketItem, "basketıtem");
    const modalListDiv = document.createElement("div");
    modalListDiv.classList.add("list-item");
    modalListDiv.innerHTML = `
                        <img src="${basketItem.img}" alt="">
                        <h2>${basketItem.title}</h2>
                        <h2>${basketItem.price} $</h2>
                        <p>Miktar : ${basketItem.amount}</p>
                        <button id="delete" onclick="deleteFromBasket({id:${basketItem.id},price:${basketItem.price},amount:${basketItem.amount}})">Sil</button>
                    `;

    modalBasket.appendChild(modalListDiv);
    //toplam değişkenini güncelle.
    total += basketItem.price * basketItem.amount;
  });
};

//sepete ekleme işlemi
const addToBasket = (product) => {
  const foundProduct = basket.find(
    (basketElement) => basketElement.id === product.id
  );

  console.log(basket, "basket-1");
  console.log(foundProduct, "product");
  if (foundProduct) {
    foundProduct.amount++;
    console.log(foundProduct, "found");
  } else {
    basket.push(product);
  }
  console.log(basket, "basket-2");
};

const deleteFromBasket = (deletingItem) => {
  console.log(deletingItem, "deletingItem");
  basket = basket.filter((item) => item.id !== deletingItem.id);
  //silinen elemanın fiyatını totalden çıkartma
  total -= deletingItem.price * deletingItem.amount;

  modalInfo.innerText = total;
};

// silinen elemanı htmlden kaldırma
modalBasket.addEventListener("click", (e) => {
  console.log(e.target, "e");
  if (e.target.id === "delete") {
    e.target.parentElement.remove();
  }
});
