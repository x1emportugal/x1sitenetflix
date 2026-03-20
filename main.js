// Main JavaScript file for x1pro-website

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animateElements = document.querySelectorAll('.section-header, .feature-card, .product-card, .case-block, .contact-wrapper');
    
    // Setup initial state for animated elements
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`;
        if (el.classList.contains('feature-card') || el.classList.contains('product-card')) {
            // Add staggered delay based on DOM order for grids
            el.style.transitionDelay = `${(index % 3) * 0.15}s`;
        }
        observer.observe(el);
    });

    // 2. Smooth Scrolling for Navigation Links & Navigation logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            if (targetId === '#contato') {
                // Open modal instead of scrolling
                document.getElementById('contactModal').classList.add('active');
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2.5 Modal Logic
    const modal = document.getElementById('contactModal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const modelSelect = document.getElementById('modelo');

    // Open Modal
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modal.classList.add('active');
            
            // If button has data-model, pre-select it in the dropdown
            const modelToPreselect = btn.getAttribute('data-model');
            if (modelToPreselect && modelSelect) {
                modelSelect.value = modelToPreselect;
            }
        });
    });

    // Close Modal via Button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close Modal via Overlay Click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // 3. Form Handling (WhatsApp Redirect)
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect data
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const modelo = document.getElementById('modelo').value;
            const mensagem = document.getElementById('mensagem').value;

            // Optional: You would typically send this to a backend/email API here
            // Example: fetch('/api/submit', { method: 'POST', body: formData })

            // For now, let's redirect to WhatsApp with a pre-filled message
            const phoneNumber = "351936331843"; // Replace with actual number
            let waMessage = `Olá X1 Pro! Venho através do site.%0A%0A*Nome:* ${nome}%0A*Email:* ${email}%0A*Telemóvel:* ${telefone}%0A*Interesse:* ${modelo}`;
            
            if (mensagem) {
                waMessage += `%0A*Mensagem:* ${mensagem}`;
            }

            // Open WhatsApp in a new tab
            window.open(`https://wa.me/${phoneNumber}?text=${waMessage}`, '_blank');
            
            // Optional: Show a success message on the site
            alert('Formulário enviado! A redirecionar para o WhatsApp...');
            leadForm.reset();
        });
    }

    // 4. Header background change on scroll
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            header.style.borderBottom = '1px solid rgba(230, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.6)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        }
    });

    // 5. Button Ripple Effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', function (e) {
            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;
            
            const ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple-effect');
            this.appendChild(ripples);
            
            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });

    // 6. 3D Tilt Effect on Cards (Glassmorphism interaction)
    const tiltElements = document.querySelectorAll('.feature-card, .product-card');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // max rotation 5deg
            const rotateY = ((x - centerX) / centerX) * 5;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // 7. Custom Interactive Cursor Tracker
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (cursor && follower) {
        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Direct cursor follows mouse immediately
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follower animation loop
        function animateCursor() {
            // Easing for the follower
            posX += (mouseX - posX) * 0.15;
            posY += (mouseY - posY) * 0.15;
            
            follower.style.left = posX + 'px';
            follower.style.top = posY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover detection for interactive elements
        const hoverables = document.querySelectorAll('a, button, .btn, .interactive-word-wrapper');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                follower.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                follower.classList.remove('hovering');
            });
        });
    }

    // 8. Magnetic Hero Word Effect
    const magneticElements = document.querySelectorAll('.interactive-word-wrapper');
    
    magneticElements.forEach(area => {
        const content = area.querySelector('.interactive-word');
        if (!content) return;

        area.addEventListener('mousemove', (e) => {
            const rect = area.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            content.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        
        area.addEventListener('mouseleave', () => {
            content.style.transform = 'translate(0px, 0px)';
        });
    });

    // 9. Dynamic Blush Movement
    const blush = document.querySelector('.dynamic-blush');
    if (blush) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPct = scrollY / scrollHeight;
            
            // Suave movimento vertical (paralaxe)
            // O blush move-se entre -30% e 30% do seu centro relativo
            const moveY = (scrollPct * 60) - 30;
            blush.style.transform = `translate(-50%, calc(-50% + ${moveY}vh))`;
        });
    }

});
