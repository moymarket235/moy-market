const WHATSAPP="996507668866";
const products=[
{id:1,name:"Идиш-аяк",cat:"Идиш-аяк",price:50,icon:"🍽️",desc:"Үйгө керектүү идиш-аяктар"},
{id:2,name:"Конфетница",cat:"Конфетницалар",price:150,icon:"🍬",desc:"Таттууларды кооз сактоо үчүн"},
{id:3,name:"Бокалдар",cat:"Бокалдар",price:120,icon:"🥂",desc:"Күнүмдүк жана майрамдык дасторкон үчүн"},
{id:4,name:"Бытовая техника",cat:"Бытовая техника",price:1300,icon:"⚡",desc:"Үйгө керектүү техника"},
{id:5,name:"Казан",cat:"Казан-кастрюль",price:500,icon:"🍲",desc:"Тамак жасоого ыңгайлуу"},
{id:6,name:"Кастрюля",cat:"Казан-кастрюль",price:700,icon:"🥘",desc:"Сапаттуу ашкана буюму"},
{id:7,name:"Набор кашык",cat:"Үй тиричилик",price:360,icon:"🥄",desc:"Кашык топтому"},
{id:8,name:"Үй тиричилик буюмдары",cat:"Үй тиричилик",price:100,icon:"🧹",desc:"Үйдү таза жана ыңгайлуу кармоо үчүн"}
];
let cart=JSON.parse(localStorage.getItem("moyMarketCart")||"[]"),active="Баары";
const fmt=n=>n.toLocaleString("ru-RU");

function cats(){
  const a=["Баары",...new Set(products.map(x=>x.cat))];
  document.querySelector("#categories").innerHTML=a.map(x=>`<button class="cat ${x===active?"active":""}" onclick='setCat(${JSON.stringify(x)})'>${x}</button>`).join("");
}
function render(){
  const q=document.querySelector("#search").value.trim().toLowerCase();
  const a=products.filter(x=>(active==="Баары"||x.cat===active)&&(x.name+" "+x.desc).toLowerCase().includes(q));
  document.querySelector("#products").innerHTML=a.map(x=>`
    <article class="card">
      <div class="pic">${x.icon}</div>
      <div class="info">
        <span class="tag">${x.cat}</span>
        <h3>${x.name}</h3>
        <p>${x.desc}</p>
        <div class="price">от ${fmt(x.price)} сом</div>
        <button class="add" onclick="add(${x.id})">Себетке кошуу</button>
      </div>
    </article>`).join("")||"<div class='empty'>Товар табылган жок. Башка сөз менен издеп көрүңүз.</div>";
}
function setCat(x){active=x;cats();render();document.querySelector("#catalog").scrollIntoView({behavior:"smooth"});}
function save(){localStorage.setItem("moyMarketCart",JSON.stringify(cart));}
function add(id){let x=cart.find(i=>i.id===id);x?x.qty++:cart.push({id,qty:1});drawCart();openCart();}
function change(id,d){let x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<1)cart=cart.filter(i=>i.id!==id);drawCart();}
function drawCart(){
  document.querySelector("#count").textContent=cart.reduce((s,x)=>s+x.qty,0);
  let total=0;
  document.querySelector("#items").innerHTML=cart.map(i=>{
    let p=products.find(x=>x.id===i.id); total+=p.price*i.qty;
    return `<div class="cartItem"><div><b>${p.name}</b><br><small>${fmt(p.price)} сом × ${i.qty}</small></div><div class="qty"><button onclick="change(${p.id},-1)">−</button><b>${i.qty}</b><button onclick="change(${p.id},1)">+</button></div></div>`;
  }).join("")||"<p class='empty'>Себет азырынча бош.</p>";
  document.querySelector("#total").textContent=fmt(total); save();
}
function openCart(){document.querySelector("#cart").classList.add("open");document.querySelector("#shade").classList.add("open");}
function toggleCart(){document.querySelector("#cart").classList.toggle("open");document.querySelector("#shade").classList.toggle("open");}

document.querySelector("#search").addEventListener("input",render);
document.querySelector("#order").addEventListener("submit",e=>{
  e.preventDefault();
  if(!cart.length){alert("Алгач товар тандаңыз.");return;}
  const name=document.querySelector("#customer").value.trim();
  const phone=document.querySelector("#phone").value.trim();
  const note=document.querySelector("#note").value.trim();
  const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `• ${p.name} × ${i.qty} = ${fmt(p.price*i.qty)} сом`;}).join("\n");
  const total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
  const text=`Саламатсызбы! Мой Маркеттен заказ берейин.\n\nАты: ${name}\nКардардын телефону: ${phone}\n\n${lines}\n\nЖалпы: ${fmt(total)} сом${note?"\nКомментарий: "+note:""}\n\nДүкөн: Жибек-Жолу 235, Бишкек`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`,"_blank");
});
cats();render();drawCart();
