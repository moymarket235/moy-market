const WA_NUMBER = '996507668866';
let category = 'Баары';
let query = '';
let cart = [];
let wish = [];
try { cart = JSON.parse(localStorage.getItem('moy_cart') || '[]'); if (!Array.isArray(cart)) cart=[]; } catch(e){ cart=[]; }
try { wish = JSON.parse(localStorage.getItem('moy_wish') || '[]'); if (!Array.isArray(wish)) wish=[]; } catch(e){ wish=[]; }
const $ = (s) => document.querySelector(s);
function save(){ localStorage.setItem('moy_cart', JSON.stringify(cart)); localStorage.setItem('moy_wish', JSON.stringify(wish)); updateCounts(); }
function updateCounts(){ const c=$('#cartCount'), w=$('#wishCount'); if(c)c.textContent=cart.reduce((a,x)=>a+(Number(x.qty)||0),0); if(w)w.textContent=wish.length; }
function cats(){
 const cs=['Баары', ...new Set(products.map(p=>p.category))];
 $('#chips').innerHTML=cs.map(c=>`<button class="${c===category?'active':''}" data-cat="${encodeURIComponent(c)}">${c}</button>`).join('');
 $('#sideCats').innerHTML=cs.map(c=>`<button class="sidecat ${c===category?'active':''}" data-cat="${encodeURIComponent(c)}">${c}</button>`).join('');
}
function setCat(c){ category=c; cats(); render(); }
function render(){
 const list=products.filter(p=>(category==='Баары'||p.category===category)&&p.name.toLowerCase().includes(query.toLowerCase()));
 $('#grid').innerHTML=list.map(p=>{const i=products.indexOf(p), wi=wish.includes(i);return `<article class="card"><div class="pic"><img src="${p.image}" alt="${p.name}" loading="lazy"><button class="heart ${wi?'active':''}" data-wish="${i}" aria-label="Тандалгандар">${wi?'♥':'♡'}</button></div><div class="card-body"><span class="cat">${p.category}</span><h3>${p.name}</h3><div class="bottom"><span class="price">${p.price} сом</span><button class="add" data-cart="${i}">+ Себет</button></div></div></article>`}).join('');
 $('#resultCount').textContent=`${list.length} товар`; $('#empty').hidden=list.length!==0;
}
function toggleWish(i){ i=Number(i); wish=wish.includes(i)?wish.filter(x=>x!==i):[...wish,i]; save(); render(); }
function addCart(i){ i=Number(i); const found=cart.find(x=>Number(x.id)===i); if(found) found.qty=(Number(found.qty)||0)+1; else cart.push({id:i,qty:1}); save(); openDrawer('Себет'); }
function changeQty(i,d){ i=Number(i); const x=cart.find(x=>Number(x.id)===i); if(!x)return; x.qty=(Number(x.qty)||0)+d; if(x.qty<=0)cart=cart.filter(x=>Number(x.id)!==i); save(); openDrawer('Себет'); }
function waLink(message='Саламатсызбы! Мой Маркеттен заказ бергим келет.') { return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`; }
function openDrawer(title){
 const drawer=$('#drawer'), body=$('#drawerBody'); if(!drawer||!body)return;
 $('#drawerTitle').textContent=title;
 if(title==='Себет'){
  if(!cart.length) body.innerHTML='<p class="muted">Себет азырынча бош.</p>';
  else { let total=0; body.innerHTML=cart.map(x=>{const p=products[Number(x.id)]; if(!p)return ''; total+=p.price*x.qty; return `<div class="cart-row"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><span class="muted">${p.price} сом × ${x.qty}</span></div><div class="qty"><button data-minus="${x.id}">−</button><b>${x.qty}</b><button data-plus="${x.id}">+</button></div></div>`}).join('')+`<div class="total"><span>Жалпы:</span><span>${total} сом</span></div><a class="checkout" target="_blank" rel="noopener" href="${waLink('Саламатсызбы! Мой Маркеттен заказ бергим келет.\n\n'+cart.map(x=>products[Number(x.id)].name+' — '+x.qty+' шт.').join('\n'))}">WhatsApp аркылуу заказ берүү</a>`; }
 } else { body.innerHTML=wish.length?wish.map(i=>`<p>${products[i].name} — <b>${products[i].price} сом</b></p>`).join(''):'<p class="muted">Тандалган товар жок.</p>'; }
 drawer.classList.add('open'); document.body.classList.add('drawer-open');
}
function closeDrawer(){ $('#drawer')?.classList.remove('open'); document.body.classList.remove('drawer-open'); }
document.addEventListener('click', e=>{
 const cat=e.target.closest('[data-cat]'); if(cat){setCat(decodeURIComponent(cat.dataset.cat));return;}
 const w=e.target.closest('[data-wish]'); if(w){toggleWish(w.dataset.wish);return;}
 const a=e.target.closest('[data-cart]'); if(a){addCart(a.dataset.cart);return;}
 const m=e.target.closest('[data-minus]'); if(m){changeQty(m.dataset.minus,-1);return;}
 const pl=e.target.closest('[data-plus]'); if(pl){changeQty(pl.dataset.plus,1);return;}
 if(e.target.closest('#cartBtn')){openDrawer('Себет');return;}
 if(e.target.closest('#wishBtn')){openDrawer('Тандалгандар');return;}
 if(e.target.closest('#closeDrawer')||e.target.closest('#drawerBg')){closeDrawer();return;}
});
$('#search').addEventListener('input',e=>{query=e.target.value;render();});
$('#clear').addEventListener('click',()=>{query='';$('#search').value='';category='Баары';cats();render();});
$('#waMain').href=waLink();
cats(); render(); updateCounts();
