/* Draggable swinging ID badge — simple pendulum physics.
   Grab the card and fling it; it swings back and settles with a gentle idle sway. */
(function(){
  const lan = document.getElementById('lanyard'), pivot = document.getElementById('pivot'), card = document.getElementById('bcard');
  if (!lan) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let th = 0.38, w = 0, drag = false, grabOff = 0, last = performance.now(), t = 0, lastTh = 0;
  const K = 16, DAMP = 0.9, MAX = 1.2;

  const pivotXY = () => { const r = pivot.getBoundingClientRect(); return [r.left, r.top]; };
  const ang = e => { const [px, py] = pivotXY(); return -Math.atan2(e.clientX - px, Math.max(40, e.clientY - py)); };

  card.addEventListener('pointerdown', e => {
    drag = true; card.setPointerCapture(e.pointerId);
    grabOff = ang(e) - th; w = 0; lastTh = th;
  });
  card.addEventListener('pointermove', e => {
    if (!drag) return;
    th = Math.max(-MAX, Math.min(MAX, ang(e) - grabOff));
  });
  const up = () => { drag = false; };
  card.addEventListener('pointerup', up); card.addEventListener('pointercancel', up);

  function frame(now){
    const dt = Math.min(0.03, (now - last) / 1000); last = now; t += dt;
    if (drag) { w = (th - lastTh) / Math.max(dt, .001) * 0.6; lastTh = th; }
    else if (!reduce) {
      const wind = Math.sin(t * 0.9) * 0.35;                // gentle idle sway
      const acc = -K * Math.sin(th) - DAMP * w + wind;
      w += acc * dt; th += w * dt;
    }
    lan.style.transform = `rotate(${th}rad)`;
    card.style.transform = `rotateY(${Math.max(-25, Math.min(25, w * 9))}deg)`;
    card.style.setProperty('--sheen', (-60 + Math.max(-1, Math.min(1, th)) * 90) + '%');
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
