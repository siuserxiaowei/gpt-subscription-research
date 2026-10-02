"use strict";
const links = [...document.querySelectorAll('.sidebar nav a')];
const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
let scheduled = false;
function updateNavigation() {
  const threshold = Math.min(180, window.innerHeight / 3);
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= threshold) current = section;
  }
  for (const link of links) {
    const active = link.hash === '#' + current.id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateNavigation); }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();
