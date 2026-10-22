/* =========================================================================
   Jennete Rent — site.js
   Script bersama untuk halaman yang memuat gambar dari assets/img/
   (dipakai oleh halaman di /solusi-bisnis/*). Diturunkan dari script inline
   solusi-bisnis.html & index.html; setiap bagian aman bila section-nya
   tidak ada di halaman.
   ========================================================================= */
(function(){
  /* path root situs, dihitung dari lokasi file ini → bekerja di folder sedalam apa pun */
  const ROOT=(document.currentScript&&document.currentScript.src||'').replace(/assets\/js\/site\.js.*$/,'');
  const IMG=ROOT+'assets/img/';
  const imgPath=id=>id.indexOf('fleetImg')===0?IMG+'fleet/'+id.slice(8)+'.jpg':IMG+'site/'+id+'.jpg';
  const url=u=>!u?ROOT+'armada/':/^(https?:|#|tel:|mailto:)/.test(u)?u:ROOT+u;

  /* gambar lama yang memakai data-from="heroImg1" dsb. */
  document.querySelectorAll('img[data-from]').forEach(im=>{if(!im.getAttribute('src'))im.src=imgPath(im.dataset.from)});

  /* mega menu */
  const megaBtns=[...document.querySelectorAll('[data-mega]')];
  const hoverMQ=window.matchMedia('(hover:hover) and (min-width:1101px)');
  const close=(except)=>document.querySelectorAll('[aria-controls^="m-"]').forEach(b=>{if(b!==except&&!(except&&b.getAttribute('aria-controls')===except.getAttribute('aria-controls'))){b.setAttribute('aria-expanded','false');document.getElementById(b.getAttribute('aria-controls')).classList.remove('open')}});
  megaBtns.forEach(b=>b.addEventListener('click',e=>{
    e.stopPropagation();const panel=document.getElementById(b.getAttribute('aria-controls'));
    if(hoverMQ.matches&&panel.classList.contains('open'))return;
    const open=b.getAttribute('aria-expanded')==='true';close(b);
    b.setAttribute('aria-expanded',String(!open));panel.classList.toggle('open',!open);
  }));
  document.querySelectorAll('.mega').forEach(m=>m.addEventListener('click',e=>e.stopPropagation()));
  document.addEventListener('click',()=>close());
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const o=megaBtns.find(b=>b.getAttribute('aria-expanded')==='true');close();if(o)o.focus()}});
  const burger=document.getElementById('burger'),nav=document.getElementById('mainnav');
  if(burger&&nav){
    burger.addEventListener('click',()=>{const o=nav.classList.toggle('drawer');burger.setAttribute('aria-expanded',o);burger.textContent=o?'Tutup':'Menu';document.body.style.overflow=o?'hidden':'';document.body.classList.toggle('menu-open',o)});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{close();if(nav.classList.contains('drawer')){nav.classList.remove('drawer');burger.setAttribute('aria-expanded','false');burger.textContent='Menu';document.body.style.overflow='';document.body.classList.remove('menu-open')}}));
  }

  /* header: transparan di atas hero, frosted saat scroll */
  const header=document.querySelector('header.site');
  const syncSolid=()=>header&&header.classList.toggle('solid',!!document.querySelector('.mega.open')||(nav&&nav.classList.contains('drawer')));
  if(header){
    const onScroll=()=>header.classList.toggle('scrolled',window.scrollY>24||document.body.dataset.header==='light');
    onScroll();window.addEventListener('scroll',onScroll,{passive:true});
    document.addEventListener('click',()=>setTimeout(syncSolid,0));
    document.addEventListener('keydown',()=>setTimeout(syncSolid,0));
  }

  /* mega menu: buka saat hover / fokus di desktop */
  document.querySelectorAll('.nav-item').forEach(li=>{
    const panel=li.querySelector('.mega');if(!panel)return;li.classList.add('has-mega');
    const ctrls=()=>document.querySelectorAll('[aria-controls="'+panel.id+'"]');
    let t=null;
    const show=()=>{if(!hoverMQ.matches)return;clearTimeout(t);close(li.querySelector('[aria-controls]'));ctrls().forEach(x=>x.setAttribute('aria-expanded','true'));panel.classList.add('open');syncSolid()};
    const hide=(now)=>{if(!hoverMQ.matches)return;clearTimeout(t);const go=()=>{ctrls().forEach(x=>x.setAttribute('aria-expanded','false'));panel.classList.remove('open');syncSolid()};now?go():(t=setTimeout(go,180))};
    li.addEventListener('mouseenter',show);li.addEventListener('mouseleave',()=>hide());
    li.addEventListener('focusin',show);li.addEventListener('focusout',e=>{if(!li.contains(e.relatedTarget))hide(true)});
  });

  /* layanan showcase (tab + panel gambar) */
  const svcItems=[...document.querySelectorAll('.svc-item')];
  if(svcItems.length){
    const svcTabs=svcItems.map(x=>x.querySelector('.svc-tab')),svcPanels=[...document.querySelectorAll('.svc-panel')],n=svcItems.length;
    const svcGo=(k,focus)=>{svcItems.forEach((it,i)=>{const a=i===k;it.classList.toggle('is-active',a);svcTabs[i].setAttribute('aria-selected',String(a));svcTabs[i].tabIndex=a?0:-1;if(svcPanels[i]){svcPanels[i].classList.toggle('is-active',a);svcPanels[i].hidden=!a}});if(focus)svcTabs[k].focus()};
    svcItems.forEach((it,i)=>{it.addEventListener('click',e=>{if(!e.target.closest('a'))svcGo(i)});it.addEventListener('mouseenter',()=>{if(window.matchMedia('(min-width:901px)').matches)svcGo(i)})});
    svcTabs.forEach((t,i)=>t.addEventListener('keydown',e=>{const k={ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1}[e.key];if(k){e.preventDefault();svcGo((i+k+n)%n,true)}}));
  }

  /* cara sewa: animasi saat terlihat */
  const how=document.querySelector('.how');
  if(how){if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){how.classList.add('in-view');io.disconnect()}}),{threshold:.35});io.observe(how)}else how.classList.add('in-view')}

  /* testimoni carousel */
  (function(){
    const box=document.querySelector('.testi');if(!box)return;
    const sl=[...box.querySelectorAll('.t-slide')],dots=[...box.querySelectorAll('.t-dots button')];let i=0,timer;
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function go(n){i=(n+sl.length)%sl.length;sl.forEach((s,k)=>{s.classList.toggle('is-active',k===i);k===i?s.removeAttribute('aria-hidden'):s.setAttribute('aria-hidden','true')});dots.forEach((d,k)=>d.setAttribute('aria-selected',String(k===i)));auto()}
    function auto(){clearTimeout(timer);if(!reduce&&sl.length>1)timer=setTimeout(()=>go(i+1),8000)}
    dots.forEach((d,k)=>d.addEventListener('click',()=>go(k)));
    const p=box.querySelector('.t-prev'),nx=box.querySelector('.t-next');
    if(p)p.addEventListener('click',()=>go(i-1));if(nx)nx.addEventListener('click',()=>go(i+1));
    box.addEventListener('mouseenter',()=>clearTimeout(timer));box.addEventListener('mouseleave',auto);
    box.addEventListener('focusin',()=>clearTimeout(timer));
    let sx=null;box.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
    box.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)go(i+(dx<0?1:-1));sx=null});
    auto();
  })();

  /* reveal */
  const rv=[...document.querySelectorAll('.rv')];if('IntersectionObserver' in window){const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');ro.unobserve(e.target)}}),{threshold:.15});rv.forEach(x=>ro.observe(x))}else rv.forEach(x=>x.classList.add('on'));


  /* listing armada: filter kategori + bahan bakar + urutan, tersinkron ke URL (?kategori=&bb=&urut=).
     Chip ber-data-goto ditangani halaman lain (Listrik/PHEV → /armada/mobil/listrik/, Premium → /armada/mobil/premium/):
     memilihnya pindah halaman dengan filter lain ikut dibawa. */
  (function(){
    const ls=document.querySelector('[data-listing]');if(!ls)return;
    const grid=ls.querySelector('.fleet-grid'),cards=[...grid.querySelectorAll('.vcard')],cnt=ls.querySelector('[data-count]'),empty=ls.querySelector('.ls-empty'),sort=ls.querySelector('select[name="urut"]');
    const order=cards.slice();
    const altLink=ls.querySelector('[data-alt-link]');
    const radio=(n,v)=>ls.querySelector('input[name="'+n+'"][value="'+v+'"]');
    const val=n=>{const r=ls.querySelector('input[name="'+n+'"]:checked');return r?r.value:''};
    /* nilai default tiap grup = chip yang checked di HTML (mis. "Premium" di halaman premium) */
    const DEF={};['kategori','bb'].forEach(n=>{const r=ls.querySelector('input[name="'+n+'"][checked]');DEF[n]=r?r.value:''});
    const pick=(n,v)=>{const r=radio(n,v);if(r&&!r.dataset.goto){r.checked=true;return true}return false};
    function sync(){
      const q=new URLSearchParams(location.search);
      ['kategori','bb'].forEach(n=>{if(!(q.get(n)&&pick(n,q.get(n))))pick(n,DEF[n])});
      if(sort)sort.value=q.get('urut')||'';
    }
    function apply(push){
      const k=val('kategori'),b=val('bb'),u=sort?sort.value:'';let n=0;
      cards.forEach(c=>{const ok=(!k||c.dataset.kategori===k||(k==='Premium'&&c.dataset.premium==='1'))&&(!b||c.dataset.bb===b);c.hidden=!ok;if(ok)n++});
      /* harga mobil (per hari) & motor (per minggu) tidak dibandingkan: urut per jenis dulu */
      const J={mobil:0,motor:1};
      const list=u?order.slice().sort((a,c)=>{const j=(J[a.dataset.jenis]||0)-(J[c.dataset.jenis]||0);if(j)return j;const pa=+a.dataset.harga||Infinity,pc=+c.dataset.harga||Infinity;return u==='harga-turun'?((pc===Infinity?-1:pc)-(pa===Infinity?-1:pa)):pa-pc}):order;
      list.forEach(c=>grid.appendChild(c));
      if(cnt)cnt.textContent=n;if(empty)empty.hidden=n>0;grid.hidden=n===0;
      if(altLink){
        const kk=k!==DEF.kategori?k:'',p=new URLSearchParams();if(kk)p.set('kategori',kk);if(b)p.set('bb',b);
        const show=n===0&&(kk||b);altLink.hidden=!show;
        if(show){altLink.href=ls.dataset.alt+'?'+p;altLink.textContent='Lihat '+[kk,b].filter(Boolean).join(' ')+' '+ls.dataset.altLabel}
      }
      if(push){const p=new URLSearchParams(location.search);[['kategori',k!==DEF.kategori?k:''],['bb',b],['urut',u]].forEach(([x,v])=>v?p.set(x,v):p.delete(x));const s=p.toString();history.replaceState(null,'',location.pathname+(s?'?'+s:''))}
    }
    ls.addEventListener('change',e=>{
      const t=e.target,go=t.dataset&&t.dataset.goto;
      if(go){
        const p=new URLSearchParams(),u=sort?sort.value:'';
        ['kategori','bb'].forEach(n=>{const v=n===t.name?t.value:val(n);if(v&&v!==DEF[n]||n===t.name&&v)p.set(n,v)});
        if(u)p.set('urut',u);
        location.href=go+(p.toString()?'?'+p:'');return;
      }
      apply(true);
    });
    ls.querySelectorAll('[data-reset]').forEach(b=>b.addEventListener('click',()=>{pick('kategori',DEF.kategori);pick('bb',DEF.bb);if(sort)sort.value='';apply(true)}));
    /* kembali lewat tombol Back (bfcache): pulihkan pilihan sesuai URL, bukan chip yang sempat diklik */
    window.addEventListener('pageshow',()=>{sync();apply(false)});
    sync();apply(true);
  })();

  /* data armada (sama dengan halaman lain; dari rent.jennete.com) */
  const mobil=[
    {b:'Wuling',n:'Cortez Darion',img:1,url:'wuling-cortez-darion.html',cat:'MPV',ic:'mpv',fuel:'Listrik',d:'MPV keluarga dan operasional, 7 kursi, otomatis',p:1500000,u:'hari'},
    {b:'Chery',n:'Tiggo 8 CSH',img:2,cat:'SUV',ic:'suv',fuel:'PHEV',d:'SUV 7 kursi, 1.500 cc PHEV, otomatis',p:1500000,u:'hari'},
    {b:'BYD',n:'Sealion 7',img:3,cat:'SUV',ic:'suv',fuel:'Listrik',d:'SUV premium, 5 kursi, baterai 82,5 kWh',p:2500000,u:'hari'},
    {b:'Jetour',n:'T2',img:4,cat:'SUV',ic:'suv',fuel:'Bensin',d:'SUV 5 kursi, 2.000 cc turbo, otomatis XWD',p:1750000,u:'hari'},
    {b:'Jaecoo',n:'J5 EV',img:5,cat:'SUV',ic:'suv',fuel:'Listrik',d:'SUV kompak, 5 kursi, baterai 60,9 kWh',p:1250000,u:'hari'},
    {b:'Chery',n:'J6 iWD',img:6,cat:'SUV',ic:'suv',fuel:'Listrik',d:'SUV 5 kursi, baterai 82,5 kWh, otomatis',p:1750000,u:'hari'},
    {b:'BYD',n:'Atto 1',img:7,cat:'City Car',ic:'city',fuel:'Listrik',d:'City car 5 kursi, baterai 33,8 kWh',p:950000,u:'hari'},
    {b:'Wuling',n:'AIRA EV',img:8,cat:'City Car',ic:'city',fuel:'Listrik',d:'City car 5 kursi, listrik 30 kW',p:750000,u:'hari'},
  ];
  const motor=[
    {b:'Yamaha',n:'Aerox 155 VVA',img:'m-aerox',cat:'Matic',ic:'moto',fuel:'Bensin',d:'Matic sport, 155 cc, otomatis',p:750000,u:'minggu'},
    {b:'Suzuki',n:'NEX II 115 Fi',img:'m-suzuki-next',cat:'Matic',ic:'moto',fuel:'Bensin',d:'Matic harian, 115 cc, otomatis',p:500000,u:'minggu'},
    {b:'Yamaha',n:'Fino 125',img:'m-fino',cat:'Matic',ic:'moto',fuel:'Bensin',d:'Matic klasik, 125 cc, otomatis',p:500000,u:'minggu'},
    {b:'Yamaha',n:'X-Ride 125',img:'m-xride',cat:'Matic',ic:'moto',fuel:'Bensin',d:'Matic adventure, 125 cc, otomatis',p:500000,u:'minggu'},
    {b:'Yamaha',n:'Jupiter MX 150',img:'m-jupitermx',cat:'Bebek',ic:'moto',fuel:'Bensin',d:'Bebek, 150 cc, manual',p:475000,u:'minggu'},
    {b:'Yamaha',n:'Jupiter Z1 CW 115',img:'m-jupiter',cat:'Bebek',ic:'moto',fuel:'Bensin',d:'Bebek, 115 cc, manual',p:450000,u:'minggu'},
    {b:'Yamaha',n:'Vega Force 115 CW',img:'m-vega',cat:'Bebek',ic:'moto',fuel:'Bensin',d:'Bebek, 115 cc, manual',p:350000,u:'minggu'},
  ];
  const prem=[
    {b:'Toyota',n:'Alphard',ic:'mpv',u:'hari',img:'x-alphard'},{b:'Toyota',n:'Voxy',ic:'mpv',u:'hari',img:'x-voxy'},{b:'Honda',n:'Odyssey',ic:'mpv',u:'hari',img:'x-odyssey'},
    {b:'Toyota',n:'Camry',ic:'sedan',u:'hari'},{b:'Honda',n:'Accord',ic:'sedan',u:'hari'},{b:'Hyundai',n:'Palisade',ic:'suv',u:'hari'}];
  const rp=n=>'Rp'+n.toLocaleString('id-ID');
  const fsrc=k=>IMG+'fleet/'+k+'.jpg';

  /* fleet mega menu */
  const CAT_URL={'MPV':'mobil/?kategori=MPV','Premium':'mobil/premium/','SUV':'mobil/?kategori=SUV','City Car':'mobil/?kategori=City%20Car','Mobil listrik':'mobil/listrik/','Motor':'motor/'};
  const catsEl=document.getElementById('megaCats'),prevEl=document.getElementById('megaPreview');
  if(catsEl&&prevEl){
    const megaCats={'MPV':[...mobil.filter(c=>c.cat==='MPV'),...prem.slice(0,3)],'Premium':prem,'SUV':mobil.filter(c=>c.cat==='SUV'),'City Car':[...mobil.filter(c=>c.cat==='City Car'),{b:'Honda',n:'City',ic:'sedan',u:'hari',img:'x-hondacity'}],'Mobil listrik':mobil.filter(c=>c.fuel!=='Bensin'),'Motor':motor};
    catsEl.innerHTML=Object.keys(megaCats).map((k,i)=>`<button role="tab" aria-selected="${i===0}" data-k="${k}">${k}<svg aria-hidden="true"><use href="#i-right"/></svg></button>`).join('');
    const preview=k=>{
      prevEl.innerHTML=megaCats[k].slice(0,3).map(c=>`<a class="prev-tile" href="${url(c.url)}"><div class="pic">${c.img?`<img src="${fsrc(c.img)}" alt="" style="width:100%;height:100%;object-fit:cover">`:`<svg class="car" aria-hidden="true"><use href="#c-${c.ic}"/></svg>`}</div><strong>${c.b} ${c.n}</strong><span>${c.p?'Mulai '+rp(c.p)+'/'+c.u:'Harga sesuai penawaran'}</span></a>`).join('')+`<a class="prev-tile all" href="${ROOT}armada/${CAT_URL[k]||''}"><div class="pic"><span class="link">Lihat semua ${k}<svg aria-hidden="true"><use href="#i-arrow"/></svg></span></div></a>`;
    };
    catsEl.querySelectorAll('button').forEach(b=>{
      const act=()=>{catsEl.querySelectorAll('button').forEach(x=>x.setAttribute('aria-selected',String(x===b)));preview(b.dataset.k)};
      b.addEventListener('click',act);b.addEventListener('mouseenter',act);b.addEventListener('focus',act);
    });
    preview('MPV');
    prevEl.addEventListener('click',()=>close());
  }

  /* ---------- formulir pesan (/pesan/) ----------
     Integrasi backend: isi atribut data-endpoint pada <form id="orderForm"> dengan URL API.
     Terisi  → data dikirim sebagai POST JSON (skema: docs/integrasi-pesan.md), lalu ke /terima-kasih/.
     Kosong  → pesan disusun dan dibuka di WhatsApp, lalu ke /terima-kasih/. */
  (function(){
    const f=document.querySelector('form[data-order]');if(!f)return;
    const $=s=>f.querySelector(s),$$=s=>[...f.querySelectorAll(s)];
    const all=[...mobil.map(c=>({...c,t:'mobil'})),...prem.map(c=>({...c,t:'mobil'})),{b:'Honda',n:'City',ic:'sedan',img:'x-hondacity',t:'mobil'},...motor.map(c=>({...c,t:'motor'}))];
    const slug=c=>(c.b+' '+c.n).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    const brand=$('#o-brand'),model=$('#o-model'),qty=$('#o-qty'),drv=$('#o-driver'),drvWrap=$('#o-driver-wrap');
    const start=$('#o-start'),end=$('#o-end'),err=f.querySelector('.ps-err');
    const jalur=()=>$('input[name="jalur"]:checked').value,jenis=()=>$('input[name="jenis"]:checked').value;
    const dur=()=>{const r=$('input[name="dur"]:checked');return r?r.value:''};
    const v=id=>$(id).value.trim();
    function fillBrands(keep){
      const bs=[...new Set(all.filter(c=>c.t===jenis()).map(c=>c.b))].sort();
      brand.innerHTML='<option value="">Minta rekomendasi</option>'+bs.map(b=>`<option>${b}</option>`).join('');
      if(keep&&bs.includes(keep))brand.value=keep;fillModels();
    }
    function fillModels(keep){
      const ms=all.filter(c=>c.t===jenis()&&c.b===brand.value);
      model.innerHTML=ms.length?'<option value="">Pilih model</option>'+ms.map(c=>`<option>${c.n}</option>`).join(''):'<option value="">—</option>';
      model.disabled=!ms.length;if(keep)model.value=keep;
    }
    const unit=()=>all.find(c=>c.t===jenis()&&c.b===brand.value&&c.n===model.value);
    const fmtDT=x=>x?new Date(x).toLocaleString('id-ID',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'';
    const fmtM=x=>x?new Date(x+'-01').toLocaleDateString('id-ID',{month:'long',year:'numeric'}):'';
    function lines(){
      const p=jalur(),L=[['Jalur',p==='perusahaan'?'Perusahaan / instansi':'Perorangan / harian'],['Jenis',jenis()==='mobil'?'Mobil':'Motor']];
      if(p==='perusahaan'){L.push(['Jumlah unit',(parseInt(qty.value)||1)+' unit'],['Durasi',dur()+' bulan']);if(jenis()==='mobil')L.push(['Sopir',drv.checked?'Termasuk':'Tanpa sopir']);if(v('#o-city'))L.push(['Lokasi',v('#o-city')]);if(v('#o-month'))L.push(['Mulai',fmtM(v('#o-month'))])}
      else{if(start.value)L.push(['Jemput',fmtDT(start.value)]);if(end.value)L.push(['Kembali',fmtDT(end.value)])}
      return L;
    }
    function summary(){
      const u=unit(),img=f.querySelector('[data-sum-img]'),ph=f.querySelector('[data-sum-ph]');
      f.querySelector('[data-sum-title]').textContent=u?u.b+' '+u.n:(brand.value?brand.value+' (pilih model)':'Unit belum dipilih');
      f.querySelector('[data-sum-sub]').textContent=u?(u.p?'Mulai '+rp(u.p)+'/'+u.u:'Harga sesuai penawaran'):'Tim kami bantu memilihkan';
      if(u&&u.img){img.src=fsrc(u.img);img.hidden=false;ph.style.display='none'}else{img.hidden=true;ph.style.display='';ph.querySelector('use').setAttribute('href','#c-'+(u?u.ic:(jenis()==='motor'?'moto':'mpv')))}
      const dl=f.querySelector('[data-sum-lines]');dl.innerHTML='';
      lines().forEach(([a,b])=>{const d=document.createElement('div'),t=document.createElement('dt'),dd=document.createElement('dd');t.textContent=a;dd.textContent=b;d.append(t,dd);dl.append(d)});
    }
    function setPath(){
      const p=jalur();$$('[data-for]').forEach(el=>el.hidden=el.dataset.for!==p);
      $('#o-email').placeholder=p==='perusahaan'?'nama@perusahaan.co.id':'nama@email.com';
    }
    function setJenis(keepB,keepM){
      const moto=jenis()==='motor';drv.disabled=moto;if(moto)drv.checked=false;drvWrap.classList.toggle('is-off',moto);
      fillBrands(keepB);if(keepM)fillModels(keepM);
    }
    function setErr(el,msg){
      const id=el.id+'-err';let e=document.getElementById(id);
      if(msg){if(!e){e=document.createElement('span');e.className='fm-err';e.id=id;el.closest('.fm-field').appendChild(e)}e.textContent=msg;el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby',id)}
      else{if(e)e.remove();el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby')}
      return !msg;
    }
    const phoneOk=x=>/^(\+62|62|0)8\d{7,12}$/.test(x.replace(/[\s-]/g,''));
    const mailOk=x=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x);
    const localNow=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,16)};

    /* prefill dari URL: ?jalur= &unit=slug | &jenis= &merek= &model= &jumlah= &durasi= &sopir=1 */
    const q=new URLSearchParams(location.search);
    const pickR=(n,val)=>{const r=$('input[name="'+n+'"][value="'+val+'"]');if(r)r.checked=true};
    if(q.get('jalur'))pickR('jalur',q.get('jalur'));
    let pre=q.get('unit')?all.find(c=>slug(c)===q.get('unit')):null;
    if(!pre&&q.get('merek'))pre=all.find(c=>c.b===q.get('merek')&&(!q.get('model')||c.n===q.get('model')))||{b:q.get('merek'),t:q.get('jenis')||'mobil'};
    if(pre)pickR('jenis',pre.t);else if(q.get('jenis'))pickR('jenis',q.get('jenis'));
    if(q.get('jumlah'))qty.value=Math.min(500,Math.max(1,parseInt(q.get('jumlah'))||1));
    if(q.get('durasi'))pickR('dur',q.get('durasi'));
    if(q.get('sopir')==='1')drv.checked=true;
    setPath();setJenis(pre&&pre.b,pre&&pre.n);
    start.min=localNow();end.min=localNow();
    summary();

    f.addEventListener('change',e=>{
      const n=e.target.name;
      if(n==='jalur')setPath();
      if(n==='jenis')setJenis();
      if(e.target===brand)fillModels();
      if(e.target===start)end.min=start.value||localNow();
      summary();
    });
    f.addEventListener('input',e=>{if(e.target.closest('.fm-field')&&e.target.getAttribute('aria-invalid'))setErr(e.target,'');summary()});
    f.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{qty.value=Math.min(500,Math.max(1,(parseInt(qty.value)||1)+ +b.dataset.step));summary()}));

    f.addEventListener('submit',async e=>{
      e.preventDefault();err.hidden=true;
      const p=jalur();let ok=true;
      if(brand.value)ok=setErr(model,model.value?'':'Pilih model, atau pilih "Minta rekomendasi" di merek')&&ok;else setErr(model,'');
      if(p==='perusahaan'){
        ok=setErr(qty,(parseInt(qty.value)||0)>=1?'':'Minimal 1 unit')&&ok;
        ok=setErr($('#o-company'),v('#o-company')?'':'Isi nama perusahaan atau instansi')&&ok;
      }else{
        ok=setErr($('#o-addr'),v('#o-addr').length>=10?'':'Isi alamat penjemputan lengkap')&&ok;
        const now=Date.now()-60000;
        ok=setErr(start,!start.value?'Pilih tanggal dan jam penjemputan':new Date(start.value)<now?'Waktu penjemputan sudah lewat':'')&&ok;
        ok=setErr(end,!end.value?'Pilih tanggal dan jam pengembalian':(start.value&&new Date(end.value)<=new Date(start.value))?'Harus setelah waktu penjemputan':'')&&ok;
      }
      ok=setErr($('#o-name'),v('#o-name')?'':'Isi nama Anda')&&ok;
      ok=setErr($('#o-phone'),!v('#o-phone')?'Isi nomor telepon':phoneOk(v('#o-phone'))?'':'Gunakan format nomor Indonesia, misalnya 0812 3456 7890')&&ok;
      const em=v('#o-email');
      ok=setErr($('#o-email'),p==='perusahaan'&&!em?'Isi alamat email':em&&!mailOk(em)?'Format email belum benar, contoh nama@perusahaan.co.id':'')&&ok;
      if(!ok){const first=f.querySelector('[aria-invalid="true"]');first.focus();first.scrollIntoView({block:'center'});return}

      const u=unit(),veh=u?u.b+' '+u.n:(brand.value||'Minta rekomendasi');
      const data={jalur:p,kendaraan:{jenis:jenis(),merek:brand.value||null,model:model.value||null},
        kebutuhan:p==='perusahaan'?{jumlah:parseInt(qty.value)||1,durasi_bulan:+dur(),sopir:jenis()==='mobil'&&drv.checked,lokasi:v('#o-city')||null,mulai:v('#o-month')||null}
                                 :{alamat:v('#o-addr'),jemput:start.value,kembali:end.value},
        catatan:v('#o-note')||null,kontak:{nama:v('#o-name'),telepon:v('#o-phone'),email:em||null,perusahaan:p==='perusahaan'?v('#o-company'):null},
        sumber:location.href,dikirim:new Date().toISOString()};
      const L=lines();
      const msg=['Halo Jennete Rent, saya ingin '+(p==='perusahaan'?'minta penawaran sewa.':'reservasi kendaraan.'),'',
        'Nama: '+data.kontak.nama,...(data.kontak.perusahaan?['Perusahaan: '+data.kontak.perusahaan]:[]),'Telepon: '+data.kontak.telepon,...(em?['Email: '+em]:[]),
        'Kendaraan: '+veh,...L.slice(1).map(([a,b])=>a+': '+b),...(p==='perorangan'?['Alamat penjemputan: '+data.kebutuhan.alamat]:[]),...(data.catatan?['Catatan: '+data.catatan]:[]),'','Terima kasih.'].join('\n');
      const wa='https://wa.me/628881111508?text='+encodeURIComponent(msg);
      const store=mode=>{try{sessionStorage.setItem('jr-order',JSON.stringify({mode,jalur:p,kendaraan:veh,lines:L.slice(1),email:em,wa}))}catch(_){}};
      const ep=f.dataset.endpoint,btn=f.querySelector('[data-submit]');
      if(ep){
        btn.disabled=true;btn.textContent='Mengirim…';
        try{const r=await fetch(ep,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!r.ok)throw new Error(r.status);store('api');location.href=f.dataset.thanks}
        catch(_){btn.disabled=false;btn.textContent='Kirim permintaan';err.innerHTML='';err.append('Permintaan belum terkirim. Coba lagi, atau ');const a=document.createElement('a');a.href=wa;a.target='_blank';a.rel='noopener';a.textContent='kirim lewat WhatsApp';err.append(a,'.');err.hidden=false}
      }else{
        store('wa');window.open(wa,'_blank','noopener');location.href=f.dataset.thanks;
      }
    });
  })();

  /* ---------- formulir kontak (/kontak/) ----------
     Sama seperti /pesan/: data-endpoint kosong → WhatsApp; terisi → POST JSON (docs/integrasi-pesan.md). */
  (function(){
    const f=document.querySelector('form[data-contact]');if(!f)return;
    const $=s=>f.querySelector(s),v=id=>$(id).value.trim(),err=f.querySelector('.ps-err'),hint=f.querySelector('.kt-hint');
    const topik=()=>{const r=f.querySelector('input[name="topik"]:checked');return r?r.value:''};
    const q=new URLSearchParams(location.search).get('topik');
    if(q){const r=f.querySelector('input[name="topik"][value="'+q+'"]');if(r)r.checked=true}
    const sync=()=>{if(hint)hint.hidden=topik()!=='Penawaran sewa'};sync();
    function setErr(el,msg){
      const id=el.id+'-err';let e=document.getElementById(id);
      if(msg){if(!e){e=document.createElement('span');e.className='fm-err';e.id=id;(el.closest('.fm-field')||el.parentNode).appendChild(e)}e.textContent=msg;el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby',id)}
      else{if(e)e.remove();el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby')}
      return !msg;
    }
    f.addEventListener('change',sync);
    f.addEventListener('input',e=>{if(e.target.getAttribute('aria-invalid'))setErr(e.target,'')});
    f.addEventListener('submit',async e=>{
      e.preventDefault();err.hidden=true;let ok=true;
      const ph=v('#k-phone'),em=v('#k-email');
      ok=setErr($('#k-name'),v('#k-name')?'':'Isi nama Anda')&&ok;
      ok=setErr($('#k-phone'),!ph?'Isi nomor telepon':/^(\+62|62|0)8\d{7,12}$/.test(ph.replace(/[\s-]/g,''))?'':'Gunakan format nomor Indonesia, misalnya 0812 3456 7890')&&ok;
      ok=setErr($('#k-email'),em&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)?'Format email belum benar':'')&&ok;
      ok=setErr($('#k-msg'),v('#k-msg').length>=10?'':'Tulis pesan minimal 10 karakter')&&ok;
      if(!ok){f.querySelector('[aria-invalid="true"]').focus();return}
      const data={jenis:'kontak',topik:topik(),pesan:v('#k-msg'),kontak:{nama:v('#k-name'),telepon:ph,email:em||null,perusahaan:v('#k-company')||null},sumber:location.href,dikirim:new Date().toISOString()};
      const msg=['Halo Jennete Rent, saya ingin bertanya.','','Topik: '+data.topik,'Nama: '+data.kontak.nama,...(data.kontak.perusahaan?['Perusahaan: '+data.kontak.perusahaan]:[]),'Telepon: '+ph,...(em?['Email: '+em]:[]),'','Pesan:',data.pesan].join('\n');
      const wa='https://wa.me/628881111508?text='+encodeURIComponent(msg);
      const store=mode=>{try{sessionStorage.setItem('jr-order',JSON.stringify({mode,jalur:'kontak',kendaraan:'Pesan: '+data.topik,lines:[['Nama',data.kontak.nama],['Telepon',ph]],email:em,wa}))}catch(_){}};
      const ep=f.dataset.endpoint,btn=f.querySelector('[type="submit"]');
      if(ep){
        btn.disabled=true;btn.textContent='Mengirim…';
        try{const r=await fetch(ep,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!r.ok)throw new Error(r.status);store('api');location.href=f.dataset.thanks}
        catch(_){btn.disabled=false;btn.textContent='Kirim pesan';err.textContent='';err.append('Pesan belum terkirim. Coba lagi, atau ');const a=document.createElement('a');a.href=wa;a.target='_blank';a.rel='noopener';a.textContent='kirim lewat WhatsApp';err.append(a,'.');err.hidden=false}
      }else{store('wa');window.open(wa,'_blank','noopener');location.href=f.dataset.thanks}
    });
  })();

  /* ---------- halaman terima kasih ---------- */
  (function(){
    const t=document.querySelector('[data-ty-title]');if(!t)return;
    let o=null;try{o=JSON.parse(sessionStorage.getItem('jr-order')||'null')}catch(_){}
    if(!o)return;
    const lead=document.querySelector('[data-ty-lead]'),box=document.querySelector('[data-ty-sum]'),wa=document.querySelector('[data-ty-wa]');
    if(o.jalur==='kontak'&&o.mode==='api'){t.textContent='Pesan Anda sudah kami terima';lead.textContent='Tim kami membalas melalui kontak yang Anda isi pada jam kantor.'}
    else if(o.mode==='api'){t.textContent='Permintaan Anda sudah kami terima';lead.textContent=o.jalur==='perusahaan'&&o.email?'Tim kami menindaklanjuti melalui kontak yang Anda isi. Penawaran resmi dikirim ke '+o.email+'.':'Tim kami menindaklanjuti melalui kontak yang Anda isi.'}
    else{t.textContent='Satu langkah lagi: kirim pesan di WhatsApp';lead.textContent='Pesan berisi permintaan Anda sudah kami siapkan. Tekan Kirim di WhatsApp agar tim kami menerimanya.';wa.href=o.wa;wa.hidden=false}
    const h=document.createElement('b');h.textContent=o.kendaraan;box.append(h);
    (o.lines||[]).forEach(([a,b])=>{const d=document.createElement('span');d.textContent=a+': '+b;box.append(d)});
    box.hidden=false;
  })();

  /* ---------- pencarian FAQ (/bantuan/) ---------- */
  (function(){
    const inp=document.querySelector('[data-faq-search]');if(!inp)return;
    const groups=[...document.querySelectorAll('.bt-group')],empty=document.querySelector('.bt-empty'),cnt=document.querySelector('[data-faq-count]');
    const norm=x=>x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    function run(){
      const q=norm(inp.value.trim()),words=q.split(/\s+/).filter(Boolean);let n=0;let first=null;
      groups.forEach(g=>{let gn=0;g.querySelectorAll('details').forEach(d=>{const ok=!words.length||words.every(w=>norm(d.textContent).includes(w));d.hidden=!ok;if(ok){gn++;n++}if(words.length&&ok&&!first)first=d});g.hidden=gn===0});if(first)first.open=true;
      if(empty)empty.hidden=n>0;if(cnt)cnt.textContent=words.length?n+' jawaban ditemukan':'';
    }
    inp.addEventListener('input',run);
    const q=new URLSearchParams(location.search).get('q');if(q){inp.value=q;run()}
  })();

  /* ---------- topik aktif saat scroll (/bantuan/, halaman legal) ---------- */
  (function(){
    const links=[...document.querySelectorAll('.bt-faq-side nav a[href^="#"],[data-spy] a[href^="#"]')];if(!links.length)return;
    const items=links.map(a=>({a,g:document.getElementById(a.getAttribute('href').slice(1))})).filter(x=>x.g);
    const shown=x=>{const g=x.g.closest('.bt-group');return !g||!g.hidden};
    let raf=0;
    function spy(){
      raf=0;const line=innerHeight*.4;let cur=null;
      items.forEach(x=>{if(shown(x)&&x.g.getBoundingClientRect().top<=line)cur=x});
      if(!cur){const f=items.find(shown);const sec=f&&f.g.closest('section');if(sec&&sec.getBoundingClientRect().top<line)cur=f}
      items.forEach(x=>{const on=x===cur;x.a.classList.toggle('is-active',on);on?x.a.setAttribute('aria-current','true'):x.a.removeAttribute('aria-current')});
    }
    addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(spy)},{passive:true});
    addEventListener('resize',spy);document.addEventListener('input',e=>{if(e.target.matches('[data-faq-search]'))spy()});spy();
  })();

  /* ---------- filter kategori artikel (/artikel/) ---------- */
  (function(){
    const box=document.querySelector('[data-posts]');if(!box)return;
    const posts=[...box.querySelectorAll('[data-kategori]')];
    const val=()=>{const r=box.querySelector('input[name="kategori"]:checked');return r?r.value:''};
    const grid=box.querySelector('[data-page]'),more=box.querySelector('[data-more]'),empty=box.querySelector('.ar-empty');
    const step=grid?+grid.dataset.page||6:0;let limit=step;
    function page(){
      if(!grid)return;const k=val();let n=0,shown=0;
      grid.querySelectorAll('[data-kategori]').forEach(p=>{const ok=!k||p.dataset.kategori===k;if(ok)n++;p.hidden=!ok||n>limit;if(!p.hidden)shown++});
      if(more)more.hidden=n<=limit;if(empty)empty.hidden=shown>0||box.querySelector('.ar-feature:not([hidden])')!==null;
    }
    if(more)more.addEventListener('click',()=>{const first=[...grid.querySelectorAll('[data-kategori]')].find(p=>p.hidden&&(!val()||p.dataset.kategori===val()));limit+=step;page();if(first){const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;let on=false;grid.querySelectorAll('[data-kategori]').forEach(p=>{if(p===first)on=true;if(on&&!p.hidden&&!calm){p.classList.remove('is-new');void p.offsetWidth;p.classList.add('is-new')}});first.scrollIntoView({behavior:calm?'auto':'smooth',block:'start'});first.focus({preventScroll:true})}});
    function apply(push){
      const k=val();posts.forEach(p=>p.hidden=!!k&&p.dataset.kategori!==k);limit=step;page();
      if(push){const p=new URLSearchParams(location.search);k?p.set('kategori',k):p.delete('kategori');const s=p.toString();history.replaceState(null,'',location.pathname+(s?'?'+s:''))}
    }
    const q=new URLSearchParams(location.search).get('kategori');
    if(q){const r=box.querySelector('input[name="kategori"][value="'+q+'"]');if(r)r.checked=true}
    box.addEventListener('change',()=>apply(true));apply(false);
  })();

  /* ---------- popup forms ---------- */
  const qForm=document.getElementById('quoteForm'),rForm=document.getElementById('resvForm');
  if(!qForm||!rForm)return;
  const catalog={mobil:{},motor:{}};
  const addCat=(t,list)=>list.forEach(c=>{(catalog[t][c.b]=catalog[t][c.b]||[]).includes(c.n)||catalog[t][c.b].push(c.n)});
  addCat('mobil',mobil);addCat('mobil',prem);addCat('motor',motor);
  addCat('mobil',[{b:'Lexus',n:'LM 350h'},{b:'Honda',n:'City'}]);
  function vehicleSelect(form,p){
    const brand=form.querySelector('#'+p+'-brand'),model=form.querySelector('#'+p+'-model');
    const type=()=>form.querySelector('input[name="'+p+'-type"]:checked').value;
    const fillBrands=()=>{const b=Object.keys(catalog[type()]).sort();brand.innerHTML='<option value="">Pilih merek</option>'+b.map(x=>`<option>${x}</option>`).join('');fillModels()};
    const fillModels=()=>{const m=catalog[type()][brand.value]||[];model.innerHTML=m.length?'<option value="">Pilih model</option>'+m.map(x=>`<option>${x}</option>`).join(''):'<option value="">Pilih merek dulu</option>';model.disabled=!m.length};
    form.querySelectorAll('input[name="'+p+'-type"]').forEach(r=>r.addEventListener('change',()=>{fillBrands();form.dispatchEvent(new Event('typechange'))}));
    brand.addEventListener('change',fillModels);
    fillBrands();
    return {type,brand,model};
  }
  const qV=vehicleSelect(qForm,'q');
  const drvWrap=document.getElementById('q-driver-wrap'),drv=document.getElementById('q-driver');
  qForm.querySelectorAll('[data-full-form]').forEach(l=>l.addEventListener('click',()=>{
    const p=new URLSearchParams({jalur:'perusahaan',jenis:qV.type()});
    if(qV.brand.value)p.set('merek',qV.brand.value);if(qV.model.value)p.set('model',qV.model.value);
    const d=qForm.querySelector('input[name="dur"]:checked');if(d)p.set('durasi',d.value);
    const n=parseInt(document.getElementById('q-qty').value);if(n>1)p.set('jumlah',n);if(drv.checked)p.set('sopir','1');
    l.href=l.getAttribute('href').split('?')[0]+'?'+p;
  }));
  qForm.addEventListener('typechange',()=>{const moto=qV.type()==='motor';drv.disabled=moto;if(moto)drv.checked=false;drvWrap.classList.toggle('is-off',moto)});
  const qty=document.getElementById('q-qty');
  qForm.querySelectorAll('[data-qty]').forEach(b=>b.addEventListener('click',()=>{qty.value=Math.min(500,Math.max(1,(parseInt(qty.value)||1)+ +b.dataset.qty))}));

  function setErr(el,msg){
    const id=el.id+'-err';let e=document.getElementById(id);
    if(msg){if(!e){e=document.createElement('span');e.className='fm-err';e.id=id;el.closest('.fm-field').appendChild(e)}e.textContent=msg;el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby',id)}
    else{if(e)e.remove();el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby')}
    return !msg;
  }
  const phoneOk=v=>/^(\+62|62|0)8\d{7,12}$/.test(v.replace(/[\s-]/g,''));
  const WA='628881111508';
  const waUrl=t=>'https://wa.me/'+WA+'?text='+encodeURIComponent(t);
  const fmtDT=v=>new Date(v).toLocaleString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'});

  let lastTrigger=null;
  const open=(id)=>{const d=document.getElementById(id);const f=d.querySelector('form');f.classList.remove('is-done');d.querySelector('.fm-done').hidden=true;d.showModal();setTimeout(()=>d.querySelector('input,select,textarea').focus(),50)};
  const prefill=a=>{if(a.dataset.open!=='quote'){resvUnit(a);return}if(!a.dataset.brand)return;const q=a.dataset.open==='quote',p=q?'q':'r',f=document.getElementById(q?'quoteForm':'resvForm');
    const r=f.querySelector(`input[name="${p}-type"][value="${a.dataset.type||'mobil'}"]`);if(r&&!r.checked){r.checked=true;r.dispatchEvent(new Event('change',{bubbles:true}))}
    const br=f.querySelector('#'+p+'-brand');br.value=a.dataset.brand;br.dispatchEvent(new Event('change'));f.querySelector('#'+p+'-model').value=a.dataset.model||''};
  document.querySelectorAll('[data-open]').forEach(a=>a.addEventListener('click',e=>{if(typeof HTMLDialogElement==='undefined')return;e.preventDefault();lastTrigger=a;close();open(a.dataset.open==='quote'?'quoteModal':'resvModal');prefill(a)}));
  document.querySelectorAll('dialog.modal').forEach(d=>{
    d.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>d.close()));
    d.addEventListener('click',e=>{if(e.target===d)d.close()});
    d.addEventListener('close',()=>{if(lastTrigger)lastTrigger.focus()});
  });

  qForm.addEventListener('submit',e=>{
    e.preventDefault();
    const name=qForm.querySelector('#q-name'),phone=qForm.querySelector('#q-phone');
    let ok=true;
    ok=setErr(name,name.value.trim()?'':'Isi nama Anda')&&ok;
    ok=setErr(phone,!phone.value.trim()?'Isi nomor telepon':phoneOk(phone.value)?'':'Gunakan format nomor Indonesia, misalnya 0812 3456 7890')&&ok;
    const email=qForm.querySelector('#q-email'),company=qForm.querySelector('#q-company');
    ok=setErr(email,!email.value.trim()?'Isi alamat email':/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())?'':'Format email belum benar, contoh nama@perusahaan.co.id')&&ok;
    const q=parseInt(qty.value);ok=setErr(qty,q>=1?'':'Minimal 1 unit')&&ok;
    ok=setErr(qV.brand,qV.brand.value?'':'Pilih merek')&&ok;
    ok=setErr(qV.model,qV.model.value?'':'Pilih model')&&ok;
    if(!ok){qForm.querySelector('[aria-invalid="true"]').focus();return}
    const dur=qForm.querySelector('input[name="dur"]:checked').value;
    const sum=`${q} unit ${qV.brand.value} ${qV.model.value}, kontrak ${dur} bulan${qV.type()==='mobil'?(drv.checked?', termasuk sopir':', tanpa sopir'):''}`;
    qForm.querySelector('.fm-sum').textContent=(company.value.trim()?company.value.trim()+': ':'')+sum;
    qForm.querySelector('.fm-mail').textContent=email.value.trim();
    document.getElementById('qWa').href=waUrl(`Halo Jennete Rent, saya ingin minta penawaran sewa.\n\nNama: ${name.value.trim()}${company.value.trim()?'\nPerusahaan: '+company.value.trim():''}\nTelepon: ${phone.value.trim()}\nEmail: ${email.value.trim()}\nKebutuhan: ${sum}\n\nTerima kasih.`);
    qForm.classList.add('is-done');qForm.querySelector('.fm-done').hidden=false;qForm.querySelector('.fm-done h3').setAttribute('tabindex','-1');qForm.querySelector('.fm-done h3').focus();
  });

  /* popup V1: pilih topik, lalu nama + email */
  const rGoal=rForm.querySelector('#r-goal'),rPanes=rForm.querySelectorAll('[data-step-pane]');
  function rStep(n,goal){
    rForm.dataset.step=n;rPanes.forEach(p=>p.hidden=p.dataset.stepPane!=String(n));
    if(goal){rGoal.value=goal;rForm.querySelector('[data-goal-label]').textContent=goal}
    setTimeout(()=>{const t=n===2?rForm.querySelector('#r-name'):rForm.querySelector('.wc-topic');if(t)t.focus()},60);
  }
  rForm.querySelectorAll('.wc-topic').forEach(b=>b.addEventListener('click',()=>rStep(2,b.dataset.goal)));
  rForm.querySelector('[data-change-topic]').addEventListener('click',()=>rStep(1));
  function resvUnit(a){
    const u=a&&a.dataset.brand?(a.dataset.brand+' '+(a.dataset.model||'')).trim():'',n=rForm.querySelector('.fm-unit');
    rForm.dataset.unit=u;n.hidden=!u;n.querySelector('b').textContent=u;
    u?rStep(2,'Cek ketersediaan'):rStep(1);
  }
  /* status jam kantor (WIB): Senin-Jumat 08.00-18.00, Sabtu 08.00-15.00 */
  (function(){
    const st=rForm.querySelector('[data-wc-status]'),note=rForm.querySelector('[data-wc-note]');if(!st)return;
    const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Jakarta',weekday:'short',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
    const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],d=days.indexOf(p.weekday),m=+p.hour*60+ +p.minute;
    const close=d===0?0:d===6?15*60:18*60,open=d!==0&&m>=480&&m<close;
    let when;if(d!==0&&m<480)when='hari ini';else when=(d===6)?'Senin':'besok';
    st.classList.toggle('is-on',open);
    st.querySelector('span').textContent=open?'Jam kantor · tim kami siap membalas':'Di luar jam kantor · buka '+when+' 08.00 WIB';
    note.hidden=open;
  })();
  rForm.addEventListener('submit',e=>{
    e.preventDefault();
    if(rForm.dataset.step!=='2'){rStep(1);return}
    const name=rForm.querySelector('#r-name'),email=rForm.querySelector('#r-email');
    let ok=true;
    ok=setErr(name,name.value.trim()?'':'Isi nama Anda')&&ok;
    ok=setErr(email,!email.value.trim()?'Isi alamat email':/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())?'':'Format email belum benar, contoh nama@perusahaan.co.id')&&ok;
    if(!ok){rForm.querySelector('[aria-invalid="true"]').focus();return}
    const lines=['Halo Jennete Rent,','','Tujuan: '+rGoal.value,'Nama: '+name.value.trim(),'Email: '+email.value.trim()];
    if(rForm.dataset.unit)lines.push('Unit: '+rForm.dataset.unit);
    lines.push('','Terima kasih.');
    const url=waUrl(lines.join('\n'));document.getElementById('rWa').href=url;
    rForm.classList.add('is-done');rForm.querySelector('.fm-done').hidden=false;
    window.open(url,'_blank','noopener');
  });
})();
