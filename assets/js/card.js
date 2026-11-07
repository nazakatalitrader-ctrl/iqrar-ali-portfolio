/* Digital business card engine. Each card page defines window.CARD (see card-general.html). */
(function(){
  const C = window.CARD, $ = s => document.querySelector(s);
  document.title = C.name + ' | Digital Card';
  $('#name').textContent = C.name;
  $('#role').textContent = C.title;
  $('#bio').textContent = C.bio;
  const av = $('#avatar');
  if (C.photo) { av.innerHTML = `<img src="${C.photo}" alt="${C.name}">`; }
  else { av.classList.add('init'); av.textContent = C.name.split(' ').map(w => w[0]).join('').slice(0, 2); }

  const digits = (C.whatsapp || C.phone || '').replace(/\D/g, '');
  // Buttons
  const act = $('#actions'); let h = '';
  h += `<button class="main" id="save">⬇ Save Contact</button>`;
  if (C.phone) h += `<a href="tel:${C.phone.replace(/\s/g,'')}">📞 Call</a>`;
  if (digits) h += `<a href="https://wa.me/${digits}" target="_blank" rel="noopener">💬 WhatsApp</a>`;
  if (C.email) h += `<a href="mailto:${C.email}">✉️ Email</a>`;
  h += `<button id="share">↗ Share</button>`;
  act.innerHTML = h;

  // Link list
  const rows = [];
  (C.links || []).forEach(l => rows.push(`<a href="${l.url}" target="_blank" rel="noopener"><span class="i">${l.icon || '🔗'}</span><div><small>${l.label}</small>${l.text || l.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</div></a>`));
  $('#list').innerHTML = rows.join('');

  // vCard download
  function vcf(){
    const [first, ...rest] = C.name.split(' ');
    const L = ['BEGIN:VCARD', 'VERSION:3.0', `N:${rest.join(' ')};${first};;;`, `FN:${C.name}`, `TITLE:${C.title}`];
    if (C.company) L.push(`ORG:${C.company}`);
    if (C.phone) L.push(`TEL;TYPE=CELL:${C.phone}`);
    if (C.email) L.push(`EMAIL:${C.email}`);
    if (C.website) L.push(`URL:${C.website}`);
    (C.links || []).forEach(l => L.push(`URL:${l.url}`));
    L.push('END:VCARD');
    return L.join('\r\n');
  }
  $('#save').onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([vcf()], { type: 'text/vcard' }));
    a.download = C.name.replace(/\s+/g, '-') + '.vcf'; a.click();
    toast('Contact saved ✔');
  };
  $('#share').onclick = async () => {
    const url = C.cardUrl || location.href;
    if (navigator.share) { try { await navigator.share({ title: C.name, text: C.title, url }); } catch(e){} }
    else { try { await navigator.clipboard.writeText(url); toast('Link copied ✔'); } catch(e){ prompt('Copy link:', url); } }
  };
  function toast(t){ const e = $('#toast'); e.textContent = t; e.classList.add('show'); setTimeout(() => e.classList.remove('show'), 2200); }

  // QR code (library loaded from cdnjs; card works without it)
  if (window.QRCode) new QRCode($('#qr'), { text: C.cardUrl || location.href, width: 256, height: 256, correctLevel: QRCode.CorrectLevel.M });
  else $('#qrwrap').remove();
})();
