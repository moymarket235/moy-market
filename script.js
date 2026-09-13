const WA="996507668866";
let cart=JSON.parse(localStorage.getItem("moy_cart")||"[]");
let wishlist=JSON.parse(localStorage.getItem("moy_wishlist")||"[]");

const $=s=>document.querySelector(s);
const grid=$("#grid"), search=$("#search"), empty=$("#empty");
const drawer=$("#drawer"), overlay=$("#overlay"), drawerTitle=$("#drawerTitle"), drawerBody=$("#drawerBody");
const productModal=$("#productModal"), modalContent=$("#modalContent");

function save(){localStorage.setItem("moy_cart",JSON.stringify(cart));localStorage.setItem("moy_wishlist",JSON.stringify(wishlist));updateCounts();}
function updateCounts(){
  $("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
  $("#wishCount").textContent=wishlist.length;
  const mc=$("#mobileCartCount"), mw=$("#mobileWishCount");
  if(mc)mc.textContent=cart.reduce((a,x)=>a+x.qty,0);
  if(mw)mw.textContent=wishlist.length;
}
function money(n){return n.toLocaleString("ru-RU")+" сом";}
function isWish(id){return wishlist.includes(id);}

function renderProducts(){
  const q=(search.value||"").toLowerCase().trim();
  const cat=document.querySelector(".chips button.active")?.dataset.cat||"all";
  const list=products.filter(p=>(cat==="all"||p.category===cat)&&p.name.toLowerCase().includes(q));
  grid.innerHTML=list.map(p=>`
    <article class="card">
      <div class="pic" data-view="${p.id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <button class="heart ${isWish(p.id)?"active":""}" data-wish="${p.id}" aria-label="Тандалгандар">${isWish(p.id)?"♥":"♡"}</button>
      </div>
      <div class="card-body">
        <h3>${p.name}</h3><div class="price">${money(p.price)}</div>
        <div class="card-actions">
          <button class="add" data-add="${p.id}">🛒 Себетке кошуу</button>
          <button class="view" data-view="${p.id}">Көрүү</button>
        </div>
      </div>
    </article>`).join("");
  empty.hidden=list.length!==0;
  updateCounts();
}

function addCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;
  else cart.push({id,qty:1});
  save(); openDrawer("cart");
}
function toggleWish(id){
  wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];
  save(); renderProducts();
  if(drawer.classList.contains("show")&&drawerTitle.textContent.includes("Тандалгандар")) openDrawer("wishlist");
}
function openDrawer(type){
  drawer.classList.add("show");overlay.classList.add("show");
  drawerTitle.textContent=type==="cart"?"Себет":"Тандалгандар";
  if(type==="cart") renderCart(); else renderWish();
}
function closeDrawer(){drawer.classList.remove("show");overlay.classList.remove("show");}
function renderCart(){
  if(!cart.length){drawerBody.innerHTML='<div class="empty-drawer">🛒<br><br>Себет азырынча бош.<br>Каталогдон товар тандаңыз.</div>';return;}
  let total=0;
  drawerBody.innerHTML=cart.map(i=>{
    const p=products.find(x=>x.id===i.id); if(!p)return "";
    total+=p.price*i.qty;
    return `<div class="drawer-item"><img src="${p.image}"><div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty"><button data-minus="${p.id}">−</button><b>${i.qty}</b><button data-plus="${p.id}">+</button><button class="remove" data-remove="${p.id}">Өчүрүү</button></div></div></div>`;
  }).join("")+`<div class="drawer-total"><span>Жалпы:</span><span>${money(total)}</span></div><button class="primary full" id="cartOrder">📲 WhatsApp аркылуу заказ</button>`;
}
function renderWish(){
  const list=wishlist.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  if(!list.length){drawerBody.innerHTML='<div class="empty-drawer">♡<br><br>Тандалган товарлар жок.</div>';return;}
  drawerBody.innerHTML=list.map(p=>`<div class="drawer-item"><img src="${p.image}"><div><h4>${p.name}</h4><p>${money(p.price)}</p><button class="add" data-add="${p.id}">🛒 Себетке</button></div></div>`).join("");
}
function cartOrder(){
  if(!cart.length)return;
  let text="Саламатсызбы! Мой Маркеттен заказ бергим келет:%0A";
  cart.forEach(i=>{const p=products.find(x=>x.id===i.id);if(p)text+=`• ${p.name} — ${i.qty} даана — ${p.price*i.qty} сом%0A`;});
  const total=cart.reduce((s,i)=>{const p=products.find(x=>x.id===i.id);return s+(p?p.price*i.qty:0)},0);
  text+=`%0AЖалпы: ${total} сом`;
  window.open(`https://wa.me/${WA}?text=${text}`,"_blank");
}
function quickOrder(){
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent("Саламатсызбы! Мой Маркеттен товар боюнча маалымат/заказ алгым келет.")}`,"_blank");
}
function showProduct(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  modalContent.innerHTML=`<div class="modal-product"><img src="${p.image}" alt="${p.name}"><div><span class="eyebrow">МОЙ МАРКЕТ</span><h2>${p.name}</h2><div class="price">${money(p.price)}</div><p>Үйүңүз үчүн пайдалуу жана кооз тандоо. Товар тууралуу толук маалымат алуу же заказ берүү үчүн бизге WhatsApp аркылуу жазыңыз.</p><div class="modal-actions"><button class="add" data-add="${p.id}">🛒 Себетке кошуу</button><button class="secondary" id="modalWA">WhatsApp заказ</button></div></div></div>`;
  $("#modalWA").onclick=()=>window.open(`https://wa.me/${WA}?text=${encodeURIComponent("Саламатсызбы! Мага «"+p.name+"» товарынан заказ керек. Баасы: "+p.price+" сом.")}`,"_blank");
  productModal.classList.add("show");
}
function closeModal(){productModal.classList.remove("show");}

document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]"); if(add){addCart(+add.dataset.add); if(productModal.classList.contains("show"))closeModal(); return;}
  const wish=e.target.closest("[data-wish]"); if(wish){e.stopPropagation();toggleWish(+wish.dataset.wish);return;}
  const view=e.target.closest("[data-view]"); if(view){showProduct(+view.dataset.view);return;}
  const plus=e.target.closest("[data-plus]"); if(plus){const i=cart.find(x=>x.id===+plus.dataset.plus);if(i)i.qty++;save();renderCart();return;}
  const minus=e.target.closest("[data-minus]"); if(minus){const i=cart.find(x=>x.id===+minus.dataset.minus);if(i){i.qty--;if(i.qty<=0)cart=cart.filter(x=>x.id!==i.id)}save();renderCart();return;}
  const rem=e.target.closest("[data-remove]"); if(rem){cart=cart.filter(x=>x.id!==+rem.dataset.remove);save();renderCart();return;}
  const cat=e.target.closest("[data-cat]"); if(cat){document.querySelectorAll("[data-cat]").forEach(x=>x.classList.toggle("active",x.dataset.cat===cat.dataset.cat));renderProducts();return;}
  const scroll=e.target.closest("[data-scroll]"); if(scroll){document.querySelector(scroll.dataset.scroll)?.scrollIntoView({behavior:"smooth"});return;}
  if(e.target.id==="cartOrder")cartOrder();
});
search.addEventListener("input",renderProducts);
$("#cartBtn").onclick=()=>openDrawer("cart");
$("#wishlistBtn").onclick=()=>openDrawer("wishlist");
$("#closeDrawer").onclick=closeDrawer;overlay.onclick=closeDrawer;
$("#closeModal").onclick=closeModal;productModal.addEventListener("click",e=>{if(e.target===productModal)closeModal()});
$("#menuBtn").onclick=()=>$("#mobileMenu").classList.toggle("show");
document.querySelectorAll("#mobileMenu a").forEach(a=>a.onclick=()=>$("#mobileMenu").classList.remove("show"));
$("#heroOrder").onclick=quickOrder;$("#quickOrder").onclick=quickOrder;$("#deliveryOrder").onclick=quickOrder;
$("#sendOrder").onclick=()=>{
  const n=$("#orderName").value.trim()||"Кардар";
  const ph=$("#orderPhone").value.trim()||"көрсөтүлгөн жок";
  const ad=$("#orderAddress").value.trim()||"Самовывоз";
  const msg=`Саламатсызбы! Мой Маркеттен заказ бергим келет.%0A%0AАты: ${encodeURIComponent(n)}%0AТелефон: ${encodeURIComponent(ph)}%0AДоставка/алуу: ${encodeURIComponent(ad)}%0A%0AТоварды тандап, заказымды ырастап бериңизчи.`;
  window.open(`https://wa.me/${WA}?text=${msg}`,"_blank");
};
renderProducts();
/* ===== SCROLL REVEAL + PREMIUM INTERACTION ===== */
document.addEventListener("DOMContentLoaded",()=>{
  const selectors=".section-head,.sidebar,.card,.service-grid article,.about-box,.contact-list>a,.contact-list>div,.order-panel,.quick button";
  document.querySelectorAll(selectors).forEach((el,i)=>{
    el.classList.add("reveal");
    el.style.transitionDelay=(Math.min(i%6,5)*.06)+"s";
  });
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("visible");io.unobserve(entry.target)}
    });
  },{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

  // Subtle parallax for the hero card while scrolling
  const heroCard=document.querySelector(".hero-card");
  window.addEventListener("scroll",()=>{
    if(!heroCard || window.innerWidth<700)return;
    const y=Math.min(window.scrollY*.08,24);
    heroCard.style.marginTop=y+"px";
  },{passive:true});

  // Header shadow appears after first scroll
  const topbar=document.querySelector(".topbar");
  window.addEventListener("scroll",()=>{
    if(topbar) topbar.style.boxShadow=window.scrollY>12?"0 10px 35px #0008":"none";
  },{passive:true});
});

document.addEventListener("DOMContentLoaded",()=>{
 const mc=document.getElementById("mobileCart"), mw=document.getElementById("mobileWish");
 if(mc)mc.onclick=()=>openDrawer("cart");
 if(mw)mw.onclick=()=>openDrawer("wishlist");
});
