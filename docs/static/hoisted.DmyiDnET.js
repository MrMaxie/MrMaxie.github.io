import{i as W}from"./index.hIESyhSu.js";const E=document.querySelector("[data-cp-year]"),S=2024,k=new Date().getFullYear();E&&(k>S?E.textContent=`${S} - ${k}`:E.textContent=S.toString());const y="data-astro-transition-persist";function V(t){for(const e of document.scripts)for(const n of t.scripts)if(!n.hasAttribute("data-astro-rerun")&&(!e.src&&e.textContent===n.textContent||e.src&&e.type===n.type&&e.src===n.src)){n.dataset.astroExec="";break}}function K(t){const e=document.documentElement,n=[...e.attributes].filter(({name:o})=>(e.removeAttribute(o),o.startsWith("data-astro-")));[...t.documentElement.attributes,...n].forEach(({name:o,value:r})=>e.setAttribute(o,r))}function j(t){for(const e of Array.from(document.head.children)){const n=J(e,t);n?n.remove():e.remove()}document.head.append(...t.head.children)}function G(t,e){e.replaceWith(t);for(const n of e.querySelectorAll(`[${y}]`)){const o=n.getAttribute(y),r=t.querySelector(`[${y}="${o}"]`);r&&(r.replaceWith(n),r.localName==="astro-island"&&Q(n)&&!Z(n,r)&&(n.setAttribute("ssr",""),n.setAttribute("props",r.getAttribute("props"))))}}const z=()=>{const t=document.activeElement;if(t?.closest(`[${y}]`)){if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement){const e=t.selectionStart,n=t.selectionEnd;return()=>R({activeElement:t,start:e,end:n})}return()=>R({activeElement:t})}else return()=>R({activeElement:null})},R=({activeElement:t,start:e,end:n})=>{t&&(t.focus(),(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)&&(typeof e=="number"&&(t.selectionStart=e),typeof n=="number"&&(t.selectionEnd=n)))},J=(t,e)=>{const n=t.getAttribute(y),o=n&&e.head.querySelector(`[${y}="${n}"]`);if(o)return o;if(t.matches("link[rel=stylesheet]")){const r=t.getAttribute("href");return e.head.querySelector(`link[rel=stylesheet][href="${r}"]`)}return null},Q=t=>{const e=t.dataset.astroTransitionPersistProps;return e==null||e==="false"},Z=(t,e)=>t.getAttribute("props")===e.getAttribute("props"),tt=t=>{V(t),K(t),j(t);const e=z();G(t.body,document.body),e()},et="astro:before-preparation",nt="astro:after-preparation",ot="astro:before-swap",rt="astro:after-swap",it=t=>document.dispatchEvent(new Event(t));class $ extends Event{from;to;direction;navigationType;sourceElement;info;newDocument;signal;constructor(e,n,o,r,s,u,a,l,d,c){super(e,n),this.from=o,this.to=r,this.direction=s,this.navigationType=u,this.sourceElement=a,this.info=l,this.newDocument=d,this.signal=c,Object.defineProperties(this,{from:{enumerable:!0},to:{enumerable:!0,writable:!0},direction:{enumerable:!0,writable:!0},navigationType:{enumerable:!0},sourceElement:{enumerable:!0},info:{enumerable:!0},newDocument:{enumerable:!0,writable:!0},signal:{enumerable:!0}})}}class st extends ${formData;loader;constructor(e,n,o,r,s,u,a,l,d,c){super(et,{cancelable:!0},e,n,o,r,s,u,a,l),this.formData=d,this.loader=c.bind(this,this),Object.defineProperties(this,{formData:{enumerable:!0},loader:{enumerable:!0,writable:!0}})}}class at extends ${direction;viewTransition;swap;constructor(e,n){super(ot,void 0,e.from,e.to,e.direction,e.navigationType,e.sourceElement,e.info,e.newDocument,e.signal),this.direction=e.direction,this.viewTransition=n,this.swap=()=>tt(this.newDocument),Object.defineProperties(this,{direction:{enumerable:!0},viewTransition:{enumerable:!0},swap:{enumerable:!0,writable:!0}})}}async function ct(t,e,n,o,r,s,u,a,l){const d=new st(t,e,n,o,r,s,window.document,u,a,l);return document.dispatchEvent(d)&&(await d.loader(),d.defaultPrevented||(it(nt),d.navigationType!=="traverse"&&D({scrollX,scrollY}))),d}function lt(t,e){const n=new at(t,e);return document.dispatchEvent(n),n.swap(),n}const ut=history.pushState.bind(history),T=history.replaceState.bind(history),D=t=>{history.state&&(history.scrollRestoration="manual",T({...history.state,...t},""))},P=!!document.startViewTransition,L=()=>!!document.querySelector('[name="astro-view-transitions-enabled"]'),C=(t,e)=>t.pathname===e.pathname&&t.search===e.search;let f,p,v;const X=t=>document.dispatchEvent(new Event(t)),_=()=>X("astro:page-load"),dt=()=>{let t=document.createElement("div");t.setAttribute("aria-live","assertive"),t.setAttribute("aria-atomic","true"),t.className="astro-route-announcer",document.body.append(t),setTimeout(()=>{let e=document.title||document.querySelector("h1")?.textContent||location.pathname;t.textContent=e},60)},I="data-astro-transition-persist",N="data-astro-transition",x="data-astro-transition-fallback";let F,g=0;history.state?(g=history.state.index,scrollTo({left:history.state.scrollX,top:history.state.scrollY})):L()&&(T({index:g,scrollX,scrollY},""),history.scrollRestoration="manual");async function ft(t,e){try{const n=await fetch(t,e),r=(n.headers.get("content-type")??"").split(";",1)[0].trim();return r!=="text/html"&&r!=="application/xhtml+xml"?null:{html:await n.text(),redirected:n.redirected?n.url:void 0,mediaType:r}}catch{return null}}function q(){const t=document.querySelector('[name="astro-view-transitions-fallback"]');return t?t.getAttribute("content"):"animate"}function mt(){let t=Promise.resolve();for(const e of document.getElementsByTagName("script")){if(e.dataset.astroExec==="")continue;const n=e.getAttribute("type");if(n&&n!=="module"&&n!=="text/javascript")continue;const o=document.createElement("script");o.innerHTML=e.innerHTML;for(const r of e.attributes){if(r.name==="src"){const s=new Promise(u=>{o.onload=o.onerror=u});t=t.then(()=>s)}o.setAttribute(r.name,r.value)}o.dataset.astroExec="",e.replaceWith(o)}return t}const B=(t,e,n,o,r)=>{const s=C(e,t),u=document.title;document.title=o;let a=!1;if(t.href!==location.href&&!r)if(n.history==="replace"){const l=history.state;T({...n.state,index:l.index,scrollX:l.scrollX,scrollY:l.scrollY},"",t.href)}else ut({...n.state,index:++g,scrollX:0,scrollY:0},"",t.href);if(document.title=u,v=t,s||(scrollTo({left:0,top:0,behavior:"instant"}),a=!0),r)scrollTo(r.scrollX,r.scrollY);else{if(t.hash){history.scrollRestoration="auto";const l=history.state;location.href=t.href,history.state||(T(l,""),s&&window.dispatchEvent(new PopStateEvent("popstate")))}else a||scrollTo({left:0,top:0,behavior:"instant"});history.scrollRestoration="manual"}};function ht(t){const e=[];for(const n of t.querySelectorAll("head link[rel=stylesheet]"))if(!document.querySelector(`[${I}="${n.getAttribute(I)}"], link[rel=stylesheet][href="${n.getAttribute("href")}"]`)){const o=document.createElement("link");o.setAttribute("rel","preload"),o.setAttribute("as","style"),o.setAttribute("href",n.getAttribute("href")),e.push(new Promise(r=>{["load","error"].forEach(s=>o.addEventListener(s,r)),document.head.append(o)}))}return e}async function M(t,e,n,o,r){async function s(l){function d(h){const m=h.effect;return!m||!(m instanceof KeyframeEffect)||!m.target?!1:window.getComputedStyle(m.target,m.pseudoElement).animationIterationCount==="infinite"}const c=document.getAnimations();document.documentElement.setAttribute(x,l);const w=document.getAnimations().filter(h=>!c.includes(h)&&!d(h));return Promise.allSettled(w.map(h=>h.finished))}if(r==="animate"&&!n.transitionSkipped&&!t.signal.aborted)try{await s("old")}catch{}const u=document.title,a=lt(t,n.viewTransition);B(a.to,a.from,e,u,o),X(rt),r==="animate"&&(!n.transitionSkipped&&!a.signal.aborted?s("new").finally(()=>n.viewTransitionFinished()):n.viewTransitionFinished())}function wt(){return f?.controller.abort(),f={controller:new AbortController}}async function U(t,e,n,o,r){const s=wt();if(!L()||location.origin!==n.origin){s===f&&(f=void 0),location.href=n.href;return}const u=r?"traverse":o.history==="replace"?"replace":"push";if(u!=="traverse"&&D({scrollX,scrollY}),C(e,n)&&(t!=="back"&&n.hash||t==="back"&&e.hash)){B(n,e,o,document.title,r),s===f&&(f=void 0);return}const a=await ct(e,n,t,u,o.sourceElement,o.info,s.controller.signal,o.formData,l);if(a.defaultPrevented||a.signal.aborted){s===f&&(f=void 0),a.signal.aborted||(location.href=n.href);return}async function l(i){const w=i.to.href,h={signal:i.signal};if(i.formData){h.method="POST";const b=i.sourceElement instanceof HTMLFormElement?i.sourceElement:i.sourceElement instanceof HTMLElement&&"form"in i.sourceElement?i.sourceElement.form:i.sourceElement?.closest("form");h.body=b?.attributes.getNamedItem("enctype")?.value==="application/x-www-form-urlencoded"?new URLSearchParams(i.formData):i.formData}const m=await ft(w,h);if(m===null){i.preventDefault();return}if(m.redirected){const b=new URL(m.redirected);if(b.origin!==i.to.origin){i.preventDefault();return}i.to=b}if(F??=new DOMParser,i.newDocument=F.parseFromString(m.html,m.mediaType),i.newDocument.querySelectorAll("noscript").forEach(b=>b.remove()),!i.newDocument.querySelector('[name="astro-view-transitions-enabled"]')&&!i.formData){i.preventDefault();return}const A=ht(i.newDocument);A.length&&!i.signal.aborted&&await Promise.all(A)}async function d(){if(p&&p.viewTransition){try{p.viewTransition.skipTransition()}catch{}try{await p.viewTransition.updateCallbackDone}catch{}}return p={transitionSkipped:!1}}const c=await d();if(a.signal.aborted){s===f&&(f=void 0);return}if(document.documentElement.setAttribute(N,a.direction),P)c.viewTransition=document.startViewTransition(async()=>await M(a,o,c,r));else{const i=(async()=>{await Promise.resolve(),await M(a,o,c,r,q())})();c.viewTransition={updateCallbackDone:i,ready:i,finished:new Promise(w=>c.viewTransitionFinished=w),skipTransition:()=>{c.transitionSkipped=!0,document.documentElement.removeAttribute(x)}}}c.viewTransition?.updateCallbackDone.finally(async()=>{await mt(),_(),dt()}),c.viewTransition?.finished.finally(()=>{c.viewTransition=void 0,c===p&&(p=void 0),s===f&&(f=void 0),document.documentElement.removeAttribute(N),document.documentElement.removeAttribute(x)});try{await c.viewTransition?.updateCallbackDone}catch(i){const w=i;console.log("[astro]",w.name,w.message,w.stack)}}async function Y(t,e){await U("forward",v,new URL(t,location.href),e??{})}function pt(t){if(!L()&&t.state){location.reload();return}if(t.state===null)return;const e=history.state,n=e.index,o=n>g?"forward":"back";g=n,U(o,v,new URL(location.href),{},e)}const H=()=>{history.state&&(scrollX!==history.state.scrollX||scrollY!==history.state.scrollY)&&D({scrollX,scrollY})};{if(P||q()!=="none")if(v=new URL(location.href),addEventListener("popstate",pt),addEventListener("load",_),"onscrollend"in window)addEventListener("scrollend",H);else{let t,e,n,o;const r=()=>{if(o!==history.state?.index){clearInterval(t),t=void 0;return}if(e===scrollY&&n===scrollX){clearInterval(t),t=void 0,H();return}else e=scrollY,n=scrollX};addEventListener("scroll",()=>{t===void 0&&(o=history.state.index,e=scrollY,n=scrollX,t=window.setInterval(r,50))},{passive:!0})}for(const t of document.getElementsByTagName("script"))t.dataset.astroExec=""}function bt(){const t=document.querySelector('[name="astro-view-transitions-fallback"]');return t?t.getAttribute("content"):"animate"}function O(t){return t.dataset.astroReload!==void 0}(P||bt()!=="none")&&(document.addEventListener("click",t=>{let e=t.target;if(t.composed&&(e=t.composedPath()[0]),e instanceof Element&&(e=e.closest("a, area")),!(e instanceof HTMLAnchorElement)&&!(e instanceof SVGAElement)&&!(e instanceof HTMLAreaElement))return;const n=e instanceof HTMLElement?e.target:e.target.baseVal,o=e instanceof HTMLElement?e.href:e.href.baseVal,r=new URL(o,location.href).origin;O(e)||e.hasAttribute("download")||!e.href||n&&n!=="_self"||r!==location.origin||t.button!==0||t.metaKey||t.ctrlKey||t.altKey||t.shiftKey||t.defaultPrevented||(t.preventDefault(),Y(o,{history:e.dataset.astroHistory==="replace"?"replace":"auto",sourceElement:e}))}),document.addEventListener("submit",t=>{let e=t.target;if(e.tagName!=="FORM"||t.defaultPrevented||O(e))return;const n=e,o=t.submitter,r=new FormData(n,o),s=typeof n.action=="string"?n.action:n.getAttribute("action"),u=typeof n.method=="string"?n.method:n.getAttribute("method");let a=o?.getAttribute("formaction")??s??location.pathname;const l=o?.getAttribute("formmethod")??u??"get";if(l==="dialog"||location.origin!==new URL(a,location.href).origin)return;const d={sourceElement:o??n};if(l==="get"){const c=new URLSearchParams(r),i=new URL(a);i.search=c.toString(),a=i.toString()}else d.formData=r;t.preventDefault(),Y(a,d)}),W({prefetchAll:!0}));