const PRODUCTS = [
  {id:'classic-sand',price:3090,name:'Classic Sand',sub:'Textured Weave',cat:'Everyday',img:'assets/p-classic-sand.jpg',
   desc:'A refined sand-toned jacket in a tactile woven fabric with a mandarin collar, zip front and slanted welt pockets. The effortless everyday essential. Crafted in a cotton-linen blend with a fusing of lycra for comfortable stretch, and lined in silk acetate fabric.'},
  {id:'heritage-bloom',price:3140,name:'Heritage Bloom',sub:'Traditional Charm',cat:'Festive',img:'assets/p-heritage-bloom.jpg',
   desc:'Botanical motifs scattered across a warm fawn base — a nod to classic Indian block prints, tailored with a modern zip front. Crafted in a cotton-linen blend with a fusing of lycra for comfortable stretch, and lined in silk acetate fabric.'},
  {id:'geometric-play',price:3020,name:'Geometric Play',sub:'Modern Edge',cat:'Modern',img:'assets/p-geometric-play.jpg',
   desc:'Deep charcoal with an asymmetric geometric embroidery line across the shoulder: contemporary pattern-play in a heritage silhouette. Crafted in a cotton-linen blend with a fusing of lycra for comfortable stretch, and lined in silk acetate fabric.'},
  {id:'classic-stripes',price:3030,name:'Classic Stripes',sub:'Clean & Contemporary',cat:'Everyday',img:'assets/p-classic-stripes.jpg',
   desc:'Fine pinstripes on an ivory ground with contrast black piping. Sharp and versatile, from office to evening. Crafted in a cotton-linen blend with a fusing of lycra for comfortable stretch, and lined in silk acetate fabric.'},
  {id:'angrakha-inspired',price:3260,name:'Angrakha Inspired',sub:'Tradition Reimagined',cat:'Festive',img:'assets/p-angrakha-inspired.jpg',
   desc:'Deep teal with a gold-thread embroidered panel inspired by the Angrakha. Statement festive wear with a quiet, modern finish. Crafted in a cotton-linen blend with a fusing of lycra for comfortable stretch, and lined in silk acetate fabric.'},
  {id:'ethnic-stripe',price:3090,name:'Ethnic Stripe',sub:'Culture with Style',cat:'Festive',img:'assets/p-ethnic-stripe.jpg',
   desc:'Deep maroon with a woven ethnic border running down the front, finished with a mandarin collar and zip closure. Crafted in a cotton-linen blend with a fusing of lycra for comfortable stretch, and lined in silk acetate fabric.'},
  {id:'jacquard-charm',price:3440,name:'Jacquard Charm',sub:'Rich & Regal',cat:'Modern',img:'assets/p-jacquard-charm.jpg',
   desc:'Midnight-blue jacquard with a tonal paisley weave that catches the light. Crafted in a cotton-linen blend with a fusing of lycra for comfortable stretch, and lined in silk acetate fabric.'}
];
const fmt=n=>'₹'+n.toLocaleString('en-IN');
const SIZES=['S','M','L','XL','XXL'];
const $=s=>document.querySelector(s);
let cart=[];
try{cart=JSON.parse(localStorage.getItem('virasat-cart'))||[]}catch(e){}
cart=cart.filter(c=>PRODUCTS.some(p=>p.id===c.id));
const save=()=>{try{localStorage.setItem('virasat-cart',JSON.stringify(cart))}catch(e){}};

/* loader */
window.addEventListener('load',()=>setTimeout(()=>$('#loader').classList.add('done'),600));
setTimeout(()=>$('#loader').classList.add('done'),2500);

/* nav */
const nav=$('#nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>20),{passive:true});
const menuBtn=$('#menuBtn'),navLinks=$('#navLinks');
menuBtn.onclick=()=>{menuBtn.classList.toggle('open');navLinks.classList.toggle('open')};
navLinks.querySelectorAll('a').forEach(a=>a.onclick=()=>{menuBtn.classList.remove('open');navLinks.classList.remove('open')});

/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
const observe=()=>document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));
observe();

/* grid */
function renderGrid(f='all'){
  const list=PRODUCTS.filter(p=>f==='all'||p.cat===f);
  $('#grid').innerHTML=list.map((p,i)=>`
    <article class="card" data-id="${p.id}" style="animation-delay:${i*90}ms" tabindex="0">
      <div class="card-img">
        <span class="tag">${p.cat}</span>
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.alt?`<img class="alt" src="${p.alt}" alt="${p.name} alternate view" loading="lazy">`:''}
        <span class="quick">Quick View</span>
      </div>
      <div class="card-info"><div><h3>${p.name}</h3><p>${p.sub}</p></div><span class="price">${fmt(p.price)}</span></div>
    </article>`).join('');
  document.querySelectorAll('.card').forEach(c=>{
    const open=()=>openModal(c.dataset.id);
    c.onclick=open;c.onkeydown=e=>{if(e.key==='Enter')open()};
  });
}
$('#filters').onclick=e=>{
  const b=e.target.closest('.chip');if(!b)return;
  document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active',c===b));
  renderGrid(b.dataset.f);
};
renderGrid();

/* modal */
let sel=null;
function openModal(id){
  const p=PRODUCTS.find(x=>x.id===id);sel=null;
  $('#modalCard').innerHTML=`
    <button class="icon-btn x" id="mx" aria-label="Close">✕</button>
    <div class="modal-img"><img src="${p.img}" alt="${p.name}"></div>
    <div class="modal-body">
      <p class="eyebrow">${p.cat}</p>
      <h2>${p.name}</h2><span class="price">${fmt(p.price)}</span><p class="sub">${p.sub}</p>
      <p class="desc">${p.desc}</p>
      <span class="label">Select size</span>
      <div class="sizes">${SIZES.map(s=>`<button class="size" data-s="${s}">${s}</button>`).join('')}</div>
      <p class="size-err" id="sizeErr"></p>
      <button class="btn full" id="addBtn">Add to Bag</button>
      <ul class="features"><li>Mandarin collar, zip front</li><li>Slanted welt pockets</li><li>Cotton-linen blend with lycra fusing</li><li>Silk acetate lining</li><li>Free alterations on first order</li></ul>
    </div>`;
  $('#modal').classList.add('show');document.body.style.overflow='hidden';
  $('#mx').onclick=closeModal;
  $('.sizes').onclick=e=>{const b=e.target.closest('.size');if(!b)return;sel=b.dataset.s;$('#sizeErr').textContent='';
    document.querySelectorAll('.size').forEach(x=>x.classList.toggle('sel',x===b))};
  $('#addBtn').onclick=()=>{
    if(!sel){$('#sizeErr').textContent='Please select a size.';return}
    addToCart(p.id,sel);closeModal();setTimeout(openCart,350);
  };
}
function closeModal(){$('#modal').classList.remove('show');document.body.style.overflow=''}
$('#modal').onclick=e=>{if(e.target.id==='modal')closeModal()};

/* cart */
function addToCart(id,size){
  const it=cart.find(c=>c.id===id&&c.size===size);
  it?it.qty++:cart.push({id,size,qty:1});
  update();
  const b=$('#cartCount');b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');
}
function update(){
  save();
  $('#cartCount').textContent=cart.reduce((a,c)=>a+c.qty,0);
  const body=$('#cartItems');
  if(!cart.length){body.innerHTML='<p class="empty">Your bag is empty</p>'}
  else body.innerHTML=cart.map((c,i)=>{const p=PRODUCTS.find(x=>x.id===c.id);return `
    <div class="ci">
      <img src="${p.img}" alt="${p.name}">
      <div><h4>${p.name}</h4><p class="meta">Size ${c.size}</p>
        <div class="qty"><button data-a="dec" data-i="${i}" aria-label="Decrease">−</button><span>${c.qty}</span><button data-a="inc" data-i="${i}" aria-label="Increase">+</button></div></div>
      <div><b class="price">${fmt(p.price*c.qty)}</b><button class="rm" data-a="rm" data-i="${i}">Remove</button></div>
    </div>`}).join('');
  $('#subtotal').textContent=fmt(cart.reduce((a,c)=>a+PRODUCTS.find(x=>x.id===c.id).price*c.qty,0));
}
$('#cartItems').onclick=e=>{
  const b=e.target.closest('button[data-a]');if(!b)return;
  const i=+b.dataset.i,a=b.dataset.a;
  if(a==='inc')cart[i].qty++;
  else if(a==='dec'){if(--cart[i].qty<1)cart.splice(i,1)}
  else cart.splice(i,1);
  update();
};
const openCart=()=>{$('#drawer').classList.add('open');$('#overlay').classList.add('show');document.body.style.overflow='hidden'};
const closeCart=()=>{$('#drawer').classList.remove('open');$('#overlay').classList.remove('show');document.body.style.overflow=''};
$('#cartBtn').onclick=openCart;$('#closeCart').onclick=closeCart;$('#overlay').onclick=closeCart;
addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();closeModal()}});
update();

function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),3200)}
$('#checkout').onclick=()=>toast(cart.length?'Demo store — checkout is not connected yet.':'Your bag is empty.');
$('#newsForm').onsubmit=e=>{e.preventDefault();$('#newsNote').textContent='Thank you — welcome to the Virasat circle.';e.target.reset()};
