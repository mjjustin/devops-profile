/**
 * Orange Bytes — Main JavaScript v2.0
 * Enhanced animations, parallax, magnetic effects
 * Shared across all pages
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========== Lenis Smooth Scroll ==========
  const lenis = new Lenis({
    autoRaf: true,
    lerp: 0.08,
    smoothWheel: true,
    wheelMultiplier: 0.8,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ========== GSAP + ScrollTrigger ==========
  gsap.registerPlugin(ScrollTrigger);

  // Enhanced reveal — different effects based on position
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    const delay = i % 3 * 0.05;
    gsap.fromTo(el,
      { opacity: 0, y: 60, filter: 'blur(8px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Stagger children with enhanced effects  
  gsap.utils.toArray('.stagger-children').forEach((container) => {
    const children = container.children;
    gsap.fromTo(children,
      { opacity: 0, y: 50, scale: 0.95, filter: 'blur(5px)' },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // ========== Parallax elements ==========
  gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.to(header, {
      y: -20,
      scrollTrigger: {
        trigger: header,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });
  });

  // ========== Counter Animation with easing ==========
  gsap.utils.toArray('[data-target]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-target'));
    if (isNaN(target)) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(el, {
          innerText: target,
          duration: 2.5,
          snap: { innerText: 1 },
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.floor(parseFloat(el.textContent));
          },
          onComplete: () => {
            el.textContent = target;
          }
        });
      },
      once: true,
    });
  });

  // ========== Story blocks — staggered entrance ==========
  gsap.utils.toArray('.story-block').forEach((block, i) => {
    const num = block.querySelector('.story-number');
    const text = block.querySelector('.story-text');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    tl.fromTo(num,
      { opacity: 0, x: -30, scale: 0.8 },
      { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
    ).fromTo(text,
      { opacity: 0, y: 30, filter: 'blur(5px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    );
  });

  // ========== Step cards — sequential entrance ==========
  gsap.utils.toArray('.step-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 60, rotationX: 15 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        delay: i * 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // ========== Use-case steps — slide in ==========
  gsap.utils.toArray('.usecase-step').forEach((step, i) => {
    gsap.fromTo(step,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // ========== Comparison cards — flip in ==========
  gsap.utils.toArray('.comparison-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, scale: 0.9, rotationY: 15 },
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 0.7,
        delay: i * 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // ========== Timeline Items Animation ==========
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: i * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // ========== Particles.js ==========
  if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 1000 } },
        color: { value: ['#ff6b00', '#ff8a3d', '#ffa84c', '#00b4d8'] },
        shape: { type: 'circle' },
        opacity: {
          value: 0.2,
          random: true,
          anim: { enable: true, speed: 0.6, opacity_min: 0.05, sync: false }
        },
        size: {
          value: 2.5,
          random: true,
          anim: { enable: true, speed: 1.2, size_min: 0.3, sync: false }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ff6b00',
          opacity: 0.06,
          width: 1
        },
        move: {
          enable: true,
          speed: 0.4,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: { enable: true, rotateX: 600, rotateY: 1200 }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.25 } },
          push: { particles_nb: 2 }
        }
      },
      retina_detect: true
    });
  }

  // ========== Navbar Scroll ==========
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Auto-hide on scroll down, show on scroll up
    if (currentScroll > 300) {
      if (currentScroll > lastScroll + 5) {
        navbar.style.transform = 'translateY(-100%)';
      } else if (currentScroll < lastScroll - 5) {
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });

  // Add transition for navbar hide/show
  navbar.style.transition = 'transform 0.3s ease, background 0.4s ease, box-shadow 0.4s ease';

  // ========== Mobile Menu ==========
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  // ========== Smooth anchor scrolling ==========
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      }
    });
  });

  // ========== Service card mouse follow with glow ==========
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  // ========== Agent card hover tilt ==========
  document.querySelectorAll('.agent-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ========== Glass card magnetic hover ==========
  document.querySelectorAll('.glass-card, .why-card, .cert-card, .step-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `translateY(-8px) translate(${x * 0.02}px, ${y * 0.02}px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ========== Button Ripple Effect ==========
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ========== Skill tags hover sound-like pulse ==========
  document.querySelectorAll('.skill-tag').forEach((tag) => {
    tag.addEventListener('mouseenter', () => {
      gsap.fromTo(tag,
        { scale: 1 },
        { scale: 1.08, duration: 0.2, ease: 'back.out(3)', yoyo: true, repeat: 1 }
      );
    });
  });

  // ========== Section label entrance ==========
  gsap.utils.toArray('.section-label').forEach((label) => {
    gsap.fromTo(label,
      { opacity: 0, scale: 0.8, filter: 'blur(4px)' },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: label,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

});
