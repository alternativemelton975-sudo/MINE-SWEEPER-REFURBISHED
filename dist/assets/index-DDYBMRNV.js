(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={beginner:{label:`Beginner`,rows:9,columns:9,mines:10},intermediate:{label:`Intermediate`,rows:16,columns:16,mines:40},expert:{label:`Expert`,rows:16,columns:30,mines:99}},t=`beginner`,n=[],r=`ready`,i=0,a,o,s=document.querySelector(`#app`);s.innerHTML=`
  <div class="page-shell">
    <header class="masthead">
      <div class="brand-mark"><span class="brand-kicker">FIELD OPERATIONS / 04</span><h1>Minefield<span class="slash"> //</span> Sweeper</h1></div>
      <p class="status-line"><span class="status-dot"></span><span id="statusText">System ready</span></p>
    </header>

    <section class="hero">
      <div><p class="eyebrow">Clearance protocol</p><h2>Read the terrain.<br /><em>Trust the numbers.</em></h2></div>
      <p class="intro">A focused logic exercise for sharp eyes and steady hands. Every square is a decision.</p>
    </section>

    <section class="game-panel" aria-label="Minesweeper game">
      <div class="control-bar">
        <div class="difficulty-picker" role="group" aria-label="Difficulty">
          ${Object.entries(e).map(([e,n])=>`<button class="difficulty-button ${e===t?`active`:``}" data-difficulty="${e}">${n.label}</button>`).join(``)}
        </div>
        <button class="reset-button" id="resetButton" aria-label="New field"><span class="reset-icon">↻</span> New field</button>
      </div>

      <div class="readout-row">
        <div class="readout"><span class="readout-label">Mines remaining</span><strong id="mineCount">010</strong></div>
        <div class="readout timer-readout"><span class="readout-label">Elapsed time</span><strong id="timer">000</strong><span class="unit">SEC</span></div>
        <div class="readout mission-readout"><span class="readout-label">Mission</span><strong id="missionStatus">Awaiting drop</strong></div>
      </div>

      <div class="board-wrap"><div id="board" class="board" role="grid" aria-label="Minesweeper board"></div></div>
      <div class="legend"><span><i class="legend-square safe"></i> Unmarked terrain</span><span><i class="legend-square flag">⚑</i> Flagged hazard</span><span><i class="legend-number">3</i> Adjacent hazards</span></div>
    </section>

    <footer><span>PROTOCOL MS-09</span><span>© FIELD SYSTEMS</span><span id="bestScore">Best: --</span></footer>
  </div>
`;var c=document.querySelector(`#board`),l=document.querySelector(`#mineCount`),u=document.querySelector(`#timer`),d=document.querySelector(`#missionStatus`),f=document.querySelector(`#statusText`),p=document.querySelector(`#bestScore`);function m(){let o=e[t];n=Array.from({length:o.rows*o.columns},(e,t)=>({index:t,mine:!1,revealed:!1,flagged:!1,adjacent:0}));let s=new Set;for(;s.size<o.mines;)s.add(Math.floor(Math.random()*n.length));s.forEach(e=>{n[e].mine=!0}),n.forEach(e=>{e.adjacent=h(e.index).filter(e=>n[e].mine).length}),r=`ready`,i=0,clearInterval(a),x()}function h(n){let{columns:r}=e[t],i=Math.floor(n/r),a=n%r,o=[];for(let n=-1;n<=1;n+=1)for(let s=-1;s<=1;s+=1){if(n===0&&s===0)continue;let c=i+n,l=a+s;c>=0&&c<e[t].rows&&l>=0&&l<r&&o.push(c*r+l)}return o}function g(e){let t=n[e];if(!(r===`won`||r===`lost`||t.revealed||t.flagged)){if(r===`ready`&&v(),t.revealed=!0,t.mine)return y();t.adjacent===0&&h(e).forEach(g),n.filter(e=>!e.mine&&!e.revealed).length===0&&b(),x()}}function _(e){r===`won`||r===`lost`||n[e].revealed||(r===`ready`&&v(),n[e].flagged=!n[e].flagged,x())}function v(){r=`playing`,o=Date.now(),a=setInterval(()=>{i=Math.floor((Date.now()-o)/1e3),u.textContent=String(i).padStart(3,`0`)},1e3)}function y(){r=`lost`,clearInterval(a),n.filter(e=>e.mine).forEach(e=>{e.revealed=!0}),x()}function b(){r=`won`,clearInterval(a),n.forEach(e=>{e.mine&&(e.flagged=!0)});let e=`minesweeper-best-${t}`,o=Number(localStorage.getItem(e));(!o||i<o)&&localStorage.setItem(e,i),x()}function x(){let i=e[t];c.style.setProperty(`--columns`,i.columns),c.innerHTML=``,n.forEach(e=>{let t=document.createElement(`button`);t.className=`cell ${e.revealed?`revealed`:``} ${e.flagged?`flagged`:``} ${e.mine&&e.revealed?`mine`:``}`,t.setAttribute(`role`,`gridcell`),t.setAttribute(`aria-label`,e.flagged?`Flagged square`:e.revealed?`${e.adjacent} adjacent mines`:`Covered square`),e.revealed&&!e.mine&&e.adjacent&&(t.textContent=e.adjacent,t.dataset.number=e.adjacent),e.flagged&&(t.textContent=`⚑`),e.mine&&e.revealed&&(t.textContent=`✹`),t.addEventListener(`click`,()=>g(e.index)),t.addEventListener(`contextmenu`,t=>{t.preventDefault(),_(e.index)}),c.appendChild(t)});let a=n.filter(e=>e.flagged).length;l.textContent=String(i.mines-a).padStart(3,`0`);let o={ready:[`System ready`,`Awaiting drop`],playing:[`Field active`,`In progress`],won:[`Field cleared`,`Mission complete`],lost:[`Contact lost`,`Detonation`]};f.textContent=o[r][0],d.textContent=o[r][1];let s=localStorage.getItem(`minesweeper-best-${t}`);p.textContent=s?`Best: ${String(s).padStart(3,`0`)} sec`:`Best: --`}document.querySelectorAll(`[data-difficulty]`).forEach(e=>e.addEventListener(`click`,()=>{t=e.dataset.difficulty,document.querySelectorAll(`[data-difficulty]`).forEach(t=>t.classList.toggle(`active`,t===e)),m()})),document.querySelector(`#resetButton`).addEventListener(`click`,m),m();