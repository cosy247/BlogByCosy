import{_ as T,p,r as i,w as x,c as P,n as E,a,b as t,d as S,e as y,t as l,u as r,F as u,f as m,g as _,o as n,h as C,I,i as A,s as B}from"./index-coRuu0-r.js";const D={class:"cover"},M={key:0,class:"cover-title"},N={class:"cover-title-value"},V={class:"cover-count"},b={class:"cover-title"},z=["innerHTML"],F={class:"cover-count"},R={class:"cover-dictum"},$={class:"cover-dictum-2"},j={class:"cover-links"},q=["href"],G={class:"list"},J=["href"],K={class:"list-item-title"},O={class:"list-item-infos"},Q={class:"list-item-info"},U=10,W={__name:"ListHome",setup(X){console.log(p);const c=i([]),d=A(),v=i(!1);x(()=>[d.params.name,d.params.value],([s,o])=>{v.value=s&&o,v.value&&B[s]?c.value=p.filter(e=>{var k;return Array.isArray(e.attrs[s])?e.attrs[s].some(H=>H.toLowerCase()===o.toLowerCase()):((k=e.attrs[s])==null?void 0:k.toLowerCase())===o.toLowerCase()}):c.value=p},{immediate:!0});const f=_.mottos[Math.random()*_.mottos.length>>0],g=i(0);window.addEventListener("scroll",()=>{const{clientHeight:s,scrollTop:o}=document.documentElement;o<s&&(g.value=o/s)});const L=i(1),h=i(!1),w=P(()=>c.value.slice(0,U*L.value));return window.addEventListener("scroll",()=>{const{clientHeight:s,scrollTop:o,scrollHeight:e}=document.documentElement;h.value||w.length===c.value.length||e-s-o>400||(h.value=!0,E(()=>h.value=!1),L.value++)}),(s,o)=>(n(),a(u,null,[t("div",D,[t("div",{class:"cover-content",style:S({paddingTop:37*g.value+"%"})},[v.value?(n(),a("p",M,[y(l(r(d).params.name)+" ",1),t("span",N,"."+l(r(d).params.value),1),t("span",V,"【"+l(c.value.length)+"】",1)])):(n(),a(u,{key:1},[t("div",b,[t("div",{class:"cover-logo",innerHTML:r(_).title},null,8,z),t("span",F,"【"+l(c.value.length)+"】",1)]),t("p",R,l(r(f)[0]),1),(n(!0),a(u,null,m(r(f).slice(1),e=>(n(),a("p",$,l(e),1))),256))],64)),t("div",j,[(n(!0),a(u,null,m(r(_).links,e=>(n(),a("a",{class:"cover-link",href:e.url,target:"_blank"},[C(I,{icon:e},null,8,["icon"]),y(" "+l(e.name),1)],8,q))),256))])],4)]),t("div",G,[(n(!0),a(u,null,m(w.value,e=>(n(),a("a",{href:`/docs/${e.file}`,class:"list-item"},[t("p",K,l(e.attrs.title),1),t("div",O,[t("p",Q,"  "+l(new Date(e.date).toLocaleDateString()),1)])],8,J))),256)),o[0]||(o[0]=t("div",{class:"list-over"},"🐲 时间线到头了 🦄",-1))])],64))}},Z=T(W,[["__scopeId","data-v-d1d154e1"]]);export{Z as default};
