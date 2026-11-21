(function(){
"use strict";
var d=document,b=d.body,$=function(s,c){return (c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};

/* ---- karnety na łuku (jak napis MAKAJUTO wokół anioła w logo) ---- */
var arc=$("#arc"),heroIn=$("#heroIn"),cards=$$(".hc",arc),RATIO=600/415;
function place(){
  var W=arc.clientWidth,H=arc.clientHeight,desk=innerWidth>=900;
  if(!W||!H)return;
  var list,n,cw,ch,cx,cy,rx,ry,span;
  if(desk){
    list=cards; n=list.length;
    ch=Math.max(150,Math.min(H*0.27,330)); cw=ch/RATIO;
    if(cw>W*0.105){cw=W*0.105;ch=cw*RATIO}
    cx=W/2; ry=H*0.62-ch*0.55; cy=H-ch*0.56-ry; rx=Math.min(W*0.43,W/2-cw*0.62); span=Math.PI/2+0.26;
    var hb=heroIn.offsetHeight, cTop=cy+ry-ch/2, top=Math.max(Math.min(cTop-28-hb, (cy+ry*0.15)-hb*0.45), H*0.05);
    heroIn.style.setProperty("--ty",Math.round(top)+"px");
  }else{
    list=W<520?cards.slice(3,8):cards.slice(2,9); n=list.length;
    ch=Math.min(H*0.74,228); cw=ch/RATIO;
    var cmax=Math.min(W*0.38,158); if(cw>cmax){cw=cmax;ch=cw*RATIO}
    span=1.0; cx=W/2; rx=W*0.50; ry=Math.max(20,Math.min((H-ch)*0.55,90));
    cy=H/2-ry*(1+Math.cos(span))/2;
  }
  cards.forEach(function(c){c.classList.toggle("off",list.indexOf(c)<0)});
  list.forEach(function(c,i){
    var s=n>1?(i/(n-1))*2-1:0,t=s*span;
    var x=cx+rx*Math.sin(t),y=cy+ry*Math.cos(t);
    var rot=desk?(-t*180/Math.PI)*0.62:(-t*180/Math.PI)*0.42;
    c.style.setProperty("--cw",cw.toFixed(1)+"px");
    c.style.setProperty("--x",(x-cw/2).toFixed(1)+"px");
    c.style.setProperty("--y",(y-ch/2).toFixed(1)+"px");
    c.style.setProperty("--r",rot.toFixed(2)+"deg");
    c.style.zIndex=String(10-Math.round(Math.abs(s)*5));
    c.classList.add("on");
  });
}
if(arc){place();addEventListener("resize",function(){clearTimeout(place.t);place.t=setTimeout(place,80)});if(d.fonts&&d.fonts.ready)d.fonts.ready.then(place);addEventListener("load",place)}

/* ---- menu mobilne ---- */
var burger=$("#burger");
function menu(open){b.classList.toggle("menu-open",open);burger.setAttribute("aria-expanded",open?"true":"false")}
burger.addEventListener("click",function(){menu(!b.classList.contains("menu-open"))});
$$("#mnav a").forEach(function(a){a.addEventListener("click",function(){menu(false)})});
addEventListener("keydown",function(e){if(e.key==="Escape")menu(false)});

/* ---- wszystkie kategorie (rozwijane menu na komputerze) ---- */
var mmB=$("#mmBtn"),mm=$("#mm");
if(mmB&&mm){
  var mmSet=function(open){if(open)mm.removeAttribute("hidden");else mm.setAttribute("hidden","");mmB.setAttribute("aria-expanded",open?"true":"false")};
  var mmPick=function(i){$$(".mm-t",mm).forEach(function(t){t.classList.toggle("on",t.getAttribute("data-mm")===i)});$$(".mm-p",mm).forEach(function(p){if(p.getAttribute("data-mmp")===i)p.removeAttribute("hidden");else p.setAttribute("hidden","")})};
  mmB.addEventListener("click",function(e){e.stopPropagation();mmSet(mm.hasAttribute("hidden"))});
  $$(".mm-t",mm).forEach(function(t){
    var i=t.getAttribute("data-mm");
    t.addEventListener("mouseenter",function(){mmPick(i)});
    t.addEventListener("focus",function(){mmPick(i)});
    t.addEventListener("click",function(e){if(!t.classList.contains("on")){e.preventDefault();mmPick(i)}else mmSet(false)});
  });
  $$(".mm-right a",mm).forEach(function(a){a.addEventListener("click",function(){mmSet(false)})});
  d.addEventListener("click",function(e){if(!mm.hasAttribute("hidden")&&!mm.contains(e.target))mmSet(false)});
  addEventListener("keydown",function(e){if(e.key==="Escape"&&!mm.hasAttribute("hidden")){mmSet(false);mmB.focus()}});
}

/* ---- wyszukiwarka ---- */
var sb=$("#sbtn"),sr=$("#search");
sb.addEventListener("click",function(){var on=!sr.classList.contains("on");sr.classList.toggle("on",on);sb.setAttribute("aria-expanded",on?"true":"false");if(on)$("input",sr).focus()});
var toastEl=$("#toast"),tt;
function toast(h){toastEl.innerHTML=h;toastEl.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove("on")},2600)}
$$("[data-search]").forEach(function(f){f.addEventListener("submit",function(e){e.preventDefault();var q=$("input",f).value.trim();toast(q?"Szukam: <b>"+q.replace(/</g,"&lt;")+"</b> (w docelowym sklepie wyniki ze wszystkich produktów)":"Wpisz, czego szukasz");var k=$("#kategorie");if(k)k.scrollIntoView({behavior:"smooth"})})});
$$("[data-nl]").forEach(function(f){f.addEventListener("submit",function(e){e.preventDefault();toast("Dziękujemy za zapis do newslettera (podgląd)")})});

/* ---- koszyk (podgląd) ---- */
var cnt=0,sum=0,cE=$("#cnt"),sE=$("#sum");
$$(".add").forEach(function(btn){btn.addEventListener("click",function(){
  cnt++;sum+=parseFloat(btn.getAttribute("data-p"))||0;cE.textContent=cnt;sE.textContent=sum.toFixed(2).replace(".",",")+" zł";
  btn.classList.add("ok");btn.textContent="W koszyku";setTimeout(function(){btn.classList.remove("ok");btn.textContent="Do koszyka"},1600);
  toast("Dodano do koszyka: <b>"+btn.getAttribute("data-n")+"</b>");
})});
$("#cart").addEventListener("click",function(e){e.preventDefault();toast(cnt?"W koszyku: "+cnt+" szt. za "+sE.textContent:"Koszyk jest pusty")});

/* ---- karuzele: palec, mysz, strzałki, pasek ---- */
$$("[data-track]").forEach(function(tr){
  var box=tr.parentNode,ctl=$(".ctl",box)||$(".ctl",box.parentNode),bar=box.querySelector(".bar i");
  var p=ctl&&$(".p",ctl),n=ctl&&$(".n",ctl);
  function step(){var c=tr.children[0];return c?c.getBoundingClientRect().width+16:300}
  function upd(){var max=tr.scrollWidth-tr.clientWidth;if(p)p.disabled=tr.scrollLeft<4;if(n)n.disabled=tr.scrollLeft>max-4;
    if(bar){var f=tr.clientWidth/tr.scrollWidth;bar.style.width=(f*100)+"%";bar.style.transform="translateX("+(max>0?tr.scrollLeft/max*(1/f-1)*100:0)+"%)"}}
  if(p)p.addEventListener("click",function(){tr.scrollBy({left:-step()*2,behavior:"smooth"})});
  if(n)n.addEventListener("click",function(){tr.scrollBy({left:step()*2,behavior:"smooth"})});
  tr.addEventListener("scroll",upd,{passive:true});addEventListener("resize",upd);upd();
  var down=false,sx=0,sl=0,moved=false;
  tr.addEventListener("pointerdown",function(e){if(e.pointerType!=="mouse")return;down=true;moved=false;sx=e.clientX;sl=tr.scrollLeft});
  addEventListener("pointermove",function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>6){moved=true;tr.classList.add("drag")}if(moved)tr.scrollLeft=sl-dx});
  addEventListener("pointerup",function(){if(!down)return;down=false;if(moved){setTimeout(function(){tr.classList.remove("drag")},30)}});
  tr.addEventListener("click",function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
});

/* ---- lightbox ---- */
var lb=$("#lb"),li=$("img",lb),lc=$(".cap",lb),ln=$(".cnt",lb),grp=[],gi=0,last=null;
function show(i){gi=(i+grp.length)%grp.length;var el=grp[gi];li.src=el.getAttribute("data-full");li.width=+el.getAttribute("data-fw")||800;li.style.maxWidth="min(calc(100vw - 24px),"+li.width+"px)";li.style.maxHeight="min(calc(100svh - 130px),"+(+el.getAttribute("data-fh")||800)+"px)";li.height=+el.getAttribute("data-fh")||800;li.alt=el.getAttribute("data-cap")||"";lc.textContent=el.getAttribute("data-cap")||"";ln.textContent=(gi+1)+" / "+grp.length;var one=grp.length<2;$(".pv",lb).style.display=one?"none":"";$(".nx",lb).style.display=one?"none":""}
function open(el){var g=el.getAttribute("data-lb");grp=$$('[data-lb="'+g+'"]').filter(function(x){return !x.classList.contains("off")});last=el;show(grp.indexOf(el));lb.classList.add("on");b.style.overflow="hidden";$(".x",lb).focus()}
function close(){lb.classList.remove("on");b.style.overflow="";if(last)last.focus({preventScroll:true})}
d.addEventListener("click",function(e){var el=e.target.closest("[data-lb]");if(el&&!lb.contains(el)){e.preventDefault();open(el)}});
$(".x",lb).addEventListener("click",close);$(".pv",lb).addEventListener("click",function(){show(gi-1)});$(".nx",lb).addEventListener("click",function(){show(gi+1)});
lb.addEventListener("click",function(e){if(e.target===lb)close()});
addEventListener("keydown",function(e){if(!lb.classList.contains("on"))return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")show(gi-1);if(e.key==="ArrowRight")show(gi+1)});
var tx=0;lb.addEventListener("touchstart",function(e){tx=e.touches[0].clientX},{passive:true});
lb.addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)show(gi+(dx<0?1:-1))},{passive:true});

/* ---- formularz (podgląd, bez wysyłki) ---- */
var f=$("#form");
if(f)f.addEventListener("submit",function(e){e.preventDefault();var ok=true;$$("[required]",f).forEach(function(x){var v=x.value.trim();var bad=!v||(x.type==="email"&&!/^\S+@\S+\.\S+$/.test(v));x.setAttribute("aria-invalid",bad?"true":"false");x.style.borderColor=bad?"#CC0000":"";if(bad&&ok){x.focus();ok=false}});if(ok){f.classList.add("sent");f.reset()}});

/* ---- mapa po przewinięciu ---- */
var map=$("#map");
if(map&&"IntersectionObserver" in window){var io=new IntersectionObserver(function(en){if(en[0].isIntersecting){var i=d.createElement("iframe");i.src=map.getAttribute("data-src");i.title="Mapa: MAKAJUTO, Kościańska 30, Poznań";i.loading="lazy";i.referrerPolicy="no-referrer-when-downgrade";map.textContent="";map.appendChild(i);io.disconnect()}},{rootMargin:"300px"});io.observe(map)}
})();
