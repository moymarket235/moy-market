const products=[
{id:1,name:"Идиш-аяк",cat:"Идиш-аяк",price:50,icon:"🍽️"},
{id:2,name:"Конфетница",cat:"Идиш-аяк",price:150,icon:"🍬"},
{id:3,name:"Бокалдар",cat:"Идиш-аяк",price:120,icon:"🥂"},
{id:4,name:"Бытовая техника",cat:"Бытовая техника",price:1300,icon:"⚡"},
{id:5,name:"Казан",cat:"Казан-кастрюль",price:500,icon:"🍲"},
{id:6,name:"Кастрюля",cat:"Казан-кастрюль",price:700,icon:"🥘"},
{id:7,name:"Набор кашык",cat:"Үй тиричилик",price:360,icon:"🥄"},
{id:8,name:"Үй тиричилик буюмдары",cat:"Үй тиричилик",price:100,icon:"🧹"}
];
let cart=[],active="Баары";
const fmt=n=>n.toLocaleString("ru-RU");
function cats(){let a=["Баары",...new Set(products.map(x=>x.cat))];document.querySelector("#categories").innerHTML=a.map(x=>`<button class="cat ${x==active?"active":""}" onclick="setCat('${x}')">${x}</button>`).join("")}
function render(){let q=document.querySelector("#search").value.toLowerCase();let a=products.filter(x=>(active=="Баары"||x.cat==active)&&x.name.toLowerCase().includes(q));document.querySelector("#products").innerHTML=a.map(x=>`<article class="card"><div class="pic">${x.icon}</div><div class="info"><h3>${x.name}</h3><span class="tag">${x.cat}</span><div class="price">от ${fmt(x.price)} сом</div><button class="add" onclick="add(${x.id})">Себетке кошуу</button></div></article>`).join("")||"<p>Товар табылган жок.</p>"}
function setCat(x){active=x;cats();render()}
function add(id){let x=cart.find(i=>i.id==id);x?x.qty++:cart.push({id,qty:1});drawCart();openCart()}
function change(id,d){let x=cart.find(i=>i.id==id);if(!x)return;x.qty+=d;if(x.qty<1)cart=cart.filter(i=>i.id!=id);drawCart()}
function drawCart(){document.querySelector("#count").textContent=cart.reduce((s,x)=>s+x.qty,0);let total=0;document.querySelector("#items").innerHTML=cart.map(i=>{let p=products.find(x=>x.id==i.id);total+=p.price*i.qty;return `<div class="cartItem"><div><b>${p.name}</b><br>${fmt(p.price)} сом × ${i.qty}</div><div class="qty"><button onclick="change(${p.id},-1)">−</button> <button onclick="change(${p.id},1)">+</button></div></div>`}).join("")||"<p>Себет азырынча бош.</p>";document.querySelector("#total").textContent=fmt(total)}
function openCart(){document.querySelector("#cart").classList.add("open");document.querySelector("#shade").classList.add("open")}
function toggleCart(){document.querySelector("#cart").classList.toggle("open");document.querySelector("#shade").classList.toggle("open")}
document.querySelector("#search").addEventListener("input",render);
document.querySelector("#order").addEventListener("submit",e=>{e.preventDefault();if(!cart.length)return alert("Алгач товар тандаңыз.");let name=customer.value,phone=document.querySelector("#phone").value,note=document.querySelector("#note").value;let lines=cart.map(i=>{let p=products.find(x=>x.id==i.id);return `${p.name} × ${i.qty} = ${fmt(p.price*i.qty)} сом`}).join("\n");let total=cart.reduce((s,i)=>s+products.find(p=>p.id==i.id).price*i.qty,0);let text=`Саламатсызбы! Мой Маркеттен заказ берейин.\n\nАты: ${name}\nТелефон: ${phone}\n\n${lines}\n\nЖалпы: ${fmt(total)} сом${note?`\nКомментарий: ${note}`:""}`;window.open("https://wa.me/?text="+encodeURIComponent(text),"_blank")});
cats();render();drawCart();
