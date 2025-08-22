(() => {
  const animateInitial = () => {
    if (!window.gsap) return;
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.from('header .geosense-header-component', { y: -14, opacity: 0, duration: 0.5 })
      .from('.geosense-main-primary', { y: 14, opacity: 0, duration: 0.5 }, '-=0.2')
      .from('footer .geosense-footer-component', { y: 12, opacity: 0, duration: 0.45 }, '-=0.25')
      .from(['.geosense-phrases-status', '.geosense-location-temperature'], { opacity: 0, duration: 0.35, stagger: 0.08 }, '-=0.35');
  };

  const animateNewsItems = (nodeList) => {
    if (!window.gsap || !nodeList?.length) return;
    gsap.from(nodeList, { opacity: 0, y: 10, duration: 0.4, stagger: 0.06, ease: 'power2.out' });
  };

  const attachHoverAffordances = (nodeList) => {
    if (!window.gsap || !nodeList?.length) return;
    const lift = (el) => gsap.to(el, { duration: 0.15, y: -1, ease: 'power2.out' });
    const reset = (el) => gsap.to(el, { duration: 0.15, y: 0, ease: 'power2.out' });
    nodeList.forEach((el) => {
      el.addEventListener('mouseenter', () => lift(el));
      el.addEventListener('mouseleave', () => reset(el));
      el.addEventListener('focus', () => lift(el));
      el.addEventListener('blur', () => reset(el));
    });
  };

  window.GeoAnimations = { animateInitial, animateNewsItems, attachHoverAffordances };
})();