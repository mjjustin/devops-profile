/**
 * Orange Bytes — Home Page JavaScript
 * Hero typing animation
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========== Typing Animation ==========
  const titles = [
    'Finance Agents',
    'DevOps Engineers',
    'Data Scientists',
    'Content Strategists',
    'Support Specialists',
    'Security Analysts',
    'UX Designers',
    'Legal Experts'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 80;

  const typingElement = document.getElementById('typingText');

  function typeText() {
    if (!typingElement) return;

    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typingElement.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 40;
    } else {
      typingElement.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 80;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      typingDelay = 2500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingDelay = 400;
    }

    setTimeout(typeText, typingDelay);
  }

  setTimeout(typeText, 800);

  // ========== Hero Agent Cards Float ==========
  gsap.utils.toArray('.hero-agent-card').forEach((card, i) => {
    gsap.to(card, {
      y: i % 2 === 0 ? -8 : 8,
      duration: 2.5 + i * 0.3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  });

});
