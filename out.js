(()=>{var a=t=>{if(typeof t=="string")return t==="alive";if(typeof t=="boolean")return t?"alive":"dead"},u=(t,n=16)=>{let o=document.createElement("table"),e=[];for(let s=0;s<n;s++){let i=document.createElement("tr");e.push([]);for(let r=0;r<n;r++){let l=document.createElement("td");e[s].push(!1),l.className="dead",i.appendChild(l)}o.appendChild(i)}return t.appendChild(o),[o,e]},f=(t,n)=>({setStatus:(o,e,s)=>{n[e][o]=s;let i=t.children.item(e);if(i){let r=i.children.item(o);r&&(r.className=a(s))}},syncStatus:()=>{for(let o=0;o<n.length;o++){let e=t.children.item(o);if(e)for(let s=0;s<n.length;s++){let i=e.children.item(s);i&&(n[o][s]=a(i.className))}}},getSize:()=>n.length});function*d(t){let n=new Uint8Array(t),o=65536;for(let s=0;s<t;s+=o)crypto.getRandomValues(n.subarray(s,s+Math.min(t-s,o)));let e=0;for(;;){if(e>=t)return!1;let s=Math.floor(e/8),i=e%8;yield Boolean(n[s]>>i&1),e++}}var m=t=>{let n=t.getSize(),o=d(n*n);for(let e=0;e<n;e++)for(let s=0;s<n;s++){let i=o.next().value;t.setStatus(s,e,i)}},T=(t,n,o)=>{let e=0;return n>0&&(o[n-1][t]&&e++,t<o.length&&o[n-1][t+1]&&e++,t>0&&o[n-1][t-1]&&e++),n<o.length-1&&(o[n+1][t]&&e++,t<o.length&&o[n+1][t+1]&&e++,t>0&&o[n+1][t-1]&&e++),t>0&&o[n][t-1]&&e++,t<o.length&&o[n][t+1]&&e++,e},p=(t,n)=>{let o=t.getSize();for(let e=0;e<o;e++)for(let s=0;s<o;s++){let i=T(s,e,n);n[e][s]&&(i<2||i>3)?t.setStatus(s,e,!1):!n[e][s]&&i===3&&t.setStatus(s,e,!0)}},h=t=>{let n=document.getElementById("board");if(!n)console.error("Can not find root element");else{n.innerHTML="";let[o,e]=u(n,t),s=f(o,e);m(s);for(let i=750;i<1e5;i+=750)setTimeout(()=>p(s,e),i)}},c=document.getElementById("run");c&&(c.onclick=t=>{t.preventDefault();let n=document.getElementById("size");if(n){let{value:o}=n,e=o?parseInt(o):16;h(e)}});})();