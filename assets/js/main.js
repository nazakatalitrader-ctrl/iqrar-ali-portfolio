/* ===== Iqrar Ali Portfolio — behavior ===== */
const CONFIG = {
  email: "iqrarali221105@gmail.com",
  whatsapp: "923247395298",        // country code, no + or spaces
  phone: "+923247395298",
  roles: ["SEO Expert", "GEO Specialist", "AIO & AEO Specialist", "GBP & GSC Manager", "Web Developer"]
};
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const toast = t => { const e = $('#toast'); e.textContent = t; e.classList.add('show'); setTimeout(() => e.classList.remove('show'), 2200); };

/* Loader */
(function(){
  let n = 0; const num = $('#ldn'), bar = $('#ldb'), L = $('#loader');
  const t = setInterval(() => {
    n += Math.ceil(Math.random() * 9);
    if (n >= 100) { n = 100; clearInterval(t); setTimeout(() => L.classList.add('done'), 250); }
    num.textContent = n; bar.style.width = n + '%';
  }, 55);
  setTimeout(() => L.classList.add('done'), 4000);
})();
$('#yr').textContent = new Date().getFullYear();

/* Starfield + shooting stars */
(function(){
  const cv = $('#stars'), cx = cv.getContext('2d'); let W, H, stars = [], shoots = [];
  const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight;
    stars = Array.from({ length: Math.round(W * H / 9000) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .2, p: Math.random() * 6.28, s: Math.random() * .02 + .005 })); };
  size(); addEventListener('resize', size);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { stars.forEach(s => { cx.fillStyle = '#cfe0ff'; cx.fillRect(s.x, s.y, s.r, s.r); }); return; }
  (function draw(){
    cx.clearRect(0, 0, W, H);
    stars.forEach(s => { s.p += s.s; cx.globalAlpha = .35 + Math.sin(s.p) * .35; cx.fillStyle = '#cfe0ff'; cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 6.28); cx.fill(); });
    if (Math.random() < .008 && shoots.length < 3) shoots.push({ x: Math.random() * W * .7, y: Math.random() * H * .4, l: 0 });
    shoots = shoots.filter(s => {
      s.x += 9; s.y += 5; s.l++;
      const g = cx.createLinearGradient(s.x, s.y, s.x - 90, s.y - 50);
      g.addColorStop(0, 'rgba(215,190,255,.9)'); g.addColorStop(1, 'rgba(215,190,255,0)');
      cx.globalAlpha = 1; cx.strokeStyle = g; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(s.x, s.y); cx.lineTo(s.x - 90, s.y - 50); cx.stroke();
      return s.l < 70;
    });
    requestAnimationFrame(draw);
  })();
})();

/* Typed roles */
(function(){
  const el = $('#typed'); let i = 0, j = 0, del = false;
  (function tick(){
    const w = CONFIG.roles[i]; el.textContent = w.slice(0, j);
    if (!del && j === w.length) { del = true; return setTimeout(tick, 1400); }
    if (del && j === 0) { del = false; i = (i + 1) % CONFIG.roles.length; }
    j += del ? -1 : 1; setTimeout(tick, del ? 40 : 85);
  })();
})();

/* Nav active + progress + to-top */
const links = $$('#menu a'), secs = links.map(a => $(a.getAttribute('href')));
addEventListener('scroll', () => {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  $('#progress').style.width = (y / h * 100) + '%';
  $('#totop').classList.toggle('show', y > 600);
  let cur = 0; secs.forEach((s, k) => { if (s && s.offsetTop - 220 <= y) cur = k; });
  links.forEach((a, k) => a.classList.toggle('active', k === cur));
}, { passive: true });
$('#totop').onclick = () => scrollTo({ top: 0 });

/* 3D tilt + spotlight on cards */
$$('.tilt').forEach(c => {
  c.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    c.style.transform = `perspective(900px) rotateX(${(.5 - y) * 12}deg) rotateY(${(x - .5) * 14}deg) translateZ(8px)`;
    c.style.setProperty('--mx', (x * 100) + '%'); c.style.setProperty('--my', (y * 100) + '%');
  });
  c.addEventListener('pointerleave', () => c.style.transform = '');
});

/* Reveal, counters, skill bars */
const count = el => {
  const to = +el.dataset.count, suf = el.dataset.suffix || ''; let v = 0;
  const step = () => { v += Math.max(1, to / 50); if (v >= to) el.textContent = to + suf; else { el.textContent = Math.floor(v) + suf; requestAnimationFrame(step); } };
  to ? step() : el.textContent = '0' + suf;
};
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target; el.classList.add('in'); io.unobserve(el);
  $$('[data-count]', el).forEach(count);
}), { threshold: .15 });
$$('.rv').forEach(el => io.observe(el));

/* Certificate count = number of cert images actually present */
addEventListener('load', () => {
  const n = $$('.cert img').filter(i => i.complete && i.naturalWidth).length;
  const b = $('#certCount'); b.dataset.count = n; b.textContent = n;
  if (!n) $('#certStat').style.display = 'none';
});

/* Tabs */
$$('.tab').forEach(t => t.onclick = () => {
  $$('.tab').forEach(x => x.classList.toggle('on', x === t));
  $$('.pane').forEach(p => p.classList.toggle('on', p.id === t.dataset.t));
  if (t.dataset.t === 'p3') setTimeout(() => $$('[data-w]').forEach(b => b.style.width = b.dataset.w + '%'), 80);
});

/* Project details modal */
const mo = $('#modalov');
$$('.proj .det').forEach(b => b.onclick = () => {
  const d = b.closest('.proj').dataset;
  $('#mtag').textContent = d.tag; $('#mtitle').textContent = d.title; $('#mdesc').textContent = d.desc; $('#mlink').href = d.url;
  mo.classList.add('open');
});
$('#mx').onclick = () => mo.classList.remove('open');
mo.onclick = e => { if (e.target === mo) mo.classList.remove('open'); };

/* Certificate lightbox */
const lb = $('#lightbox');
$$('.cert').forEach(c => c.onclick = () => { const i = $('img', c); if (!i) return; $('img', lb).src = i.src; lb.classList.add('open'); });
lb.onclick = () => lb.classList.remove('open');
addEventListener('keydown', e => { if (e.key === 'Escape') { lb.classList.remove('open'); mo.classList.remove('open'); } });

/* Copy email */
$('#copyMail').onclick = async () => {
  try { await navigator.clipboard.writeText(CONFIG.email); toast('Email copied ✔'); }
  catch (e) { location.href = 'mailto:' + CONFIG.email; }
};

/* Contact form -> WhatsApp or Email */
$$('#cform [data-send]').forEach(b => b.onclick = () => {
  const f = $('#cform'); if (!f.reportValidity()) return;
  const d = new FormData(f);
  const text = `Hi Iqrar, I'm ${d.get('name')} (${d.get('email')}).\nService: ${d.get('service')}\n\n${d.get('msg')}`;
  if (b.dataset.send === 'wa') open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  else location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Portfolio enquiry from ' + d.get('name'))}&body=${encodeURIComponent(text)}`;
});

/* SEO audit request -> WhatsApp */
$('#aform').addEventListener('submit', e => {
  e.preventDefault(); const d = new FormData(e.target);
  const text = `Hi Iqrar, I'd like an SEO audit for my website: ${d.get('site')}${d.get('biz') ? '\nBusiness/niche: ' + d.get('biz') : ''}`;
  open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
});
