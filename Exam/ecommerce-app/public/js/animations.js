document.addEventListener("DOMContentLoaded", () => {
    // 1. Lenis Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        smoothTouch: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero elements
    gsap.from(".gsap-hero", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "back.out(1.7)"
    });

    // Product Cards stagger
    const cards = gsap.utils.toArray('.gsap-card');
    if(cards.length > 0) {
        gsap.from(cards, {
            scrollTrigger: {
                trigger: ".product-grid",
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        });
    }

    // 3. Theme Toggle Logic
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            toggleBtn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }
});
