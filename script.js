// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const startJourneyBtn = document.getElementById('start-journey');
const watchDemoBtn = document.getElementById('watch-demo');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Button interactions
startJourneyBtn.addEventListener('click', () => {
    // Add loading state
    const originalText = startJourneyBtn.innerHTML;
    startJourneyBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        Cargando...
    `;
    startJourneyBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        startJourneyBtn.innerHTML = originalText;
        startJourneyBtn.disabled = false;
        showNotification('¡Bienvenido! Tu viaje con Gelaty Life ha comenzado.', 'success');
    }, 2000);
});

watchDemoBtn.addEventListener('click', () => {
    showNotification('Demo próximamente disponible', 'info');
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .testimonial-card, .technical-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Technical metrics animation
const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const metrics = entry.target.querySelectorAll('.metric-number');
            metrics.forEach((metric, index) => {
                setTimeout(() => {
                    metric.style.opacity = '1';
                    metric.style.transform = 'scale(1)';
                    
                    // Animate number counting
                    const finalValue = metric.textContent;
                    const isPercentage = finalValue.includes('%');
                    const isTime = finalValue.includes('min');
                    const numericValue = parseInt(finalValue);
                    
                    if (!isNaN(numericValue)) {
                        let currentValue = 0;
                        const increment = numericValue / 30;
                        const timer = setInterval(() => {
                            currentValue += increment;
                            if (currentValue >= numericValue) {
                                currentValue = numericValue;
                                clearInterval(timer);
                            }
                            
                            let displayValue = Math.floor(currentValue);
                            if (isPercentage) displayValue += '%';
                            if (isTime) displayValue += 'min';
                            
                            metric.textContent = displayValue;
                        }, 50);
                    }
                }, index * 200);
            });
        }
    });
}, { threshold: 0.5 });

// Observe technical metrics
const metricsSection = document.querySelector('.technical-metrics');
if (metricsSection) {
    // Initially hide metrics
    metricsSection.querySelectorAll('.metric-number').forEach(metric => {
        metric.style.opacity = '0';
        metric.style.transform = 'scale(0.8)';
        metric.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    metricsObserver.observe(metricsSection);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-weight: 500;
    `;
    
    const contentStyle = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    const closeStyle = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    `;
    
    notification.querySelector('.notification-content').style.cssText = contentStyle;
    notification.querySelector('.notification-close').style.cssText = closeStyle;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Form validation (if forms are added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Lazy loading for images (if images are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Close any open modals or notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10);

// Replace the original scroll event listener
window.removeEventListener('scroll', () => {});
window.addEventListener('scroll', optimizedScrollHandler);

// Add loading states to all buttons
document.querySelectorAll('button').forEach(button => {
    if (!button.hasAttribute('data-no-loading')) {
        button.addEventListener('click', function(e) {
            if (this.disabled) return;
            
            const originalContent = this.innerHTML;
            this.style.position = 'relative';
            this.disabled = true;
            
            // Add loading spinner
            this.innerHTML = `
                <span style="opacity: 0.6;">${originalContent}</span>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                    <div style="width: 20px; height: 20px; border: 2px solid currentColor; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
            `;
            
            // Add spin animation
            if (!document.querySelector('#spin-animation')) {
                const style = document.createElement('style');
                style.id = 'spin-animation';
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Reset after 2 seconds (simulate API call)
            setTimeout(() => {
                this.innerHTML = originalContent;
                this.disabled = false;
            }, 2000);
        });
    }
});

// Add smooth reveal animation for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.15 });

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(section);
});

// Add revealed class styles
const revealStyles = document.createElement('style');
revealStyles.textContent = `
    .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(revealStyles);

// Technical card hover effects
document.querySelectorAll('.technical-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const badges = card.querySelectorAll('.detail-badge');
        badges.forEach((badge, index) => {
            setTimeout(() => {
                badge.style.transform = 'translateY(-2px)';
            }, index * 100);
        });
    });
    
    card.addEventListener('mouseleave', () => {
        const badges = card.querySelectorAll('.detail-badge');
        badges.forEach(badge => {
            badge.style.transform = 'translateY(0)';
        });
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add entrance animation to hero section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    console.log('🚀 Gelaty Life website loaded successfully!');
});