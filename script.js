// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    enableLightTheme();
}

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('light-theme')) {
        enableDarkTheme();
    } else {
        enableLightTheme();
    }
});

function enableLightTheme() {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
    localStorage.setItem('theme', 'light');
}

function enableDarkTheme() {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
    localStorage.setItem('theme', 'dark');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Interactive background effect
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Particles array
const particles = [];
const particleCount = 100; // Number of particles
let mouseX = width / 2;
let mouseY = height / 2;

// Update canvas size when window is resized
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

// Track mouse position
window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// For touch devices
window.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
    }
});

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = getComputedStyle(document.body).getPropertyValue('--text-color');
    }

    update() {
        // Calculate distance from mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150; // Max distance to be affected by mouse
        
        if (distance < maxDistance) {
            // Move particles away from mouse
            const force = (maxDistance - distance) / maxDistance;
            this.speedX -= (dx / distance) * force * 0.2;
            this.speedY -= (dy / distance) * force * 0.2;
        }
        
        // Apply some friction to prevent extreme speeds
        this.speedX *= 0.95;
        this.speedY *= 0.95;
        
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Draw connecting lines between particles
function drawLines() {
    const lineMaxDistance = 150; // Maximum distance to draw a line
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < lineMaxDistance) {
                // Make line opacity based on distance
                const opacity = (lineMaxDistance - distance) / lineMaxDistance;
                ctx.strokeStyle = `rgba(${getColorChannels()}, ${opacity * 0.3})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Helper function to get color channels based on current theme
function getColorChannels() {
    const isDark = document.body.classList.contains('dark-theme');
    return isDark ? '255, 255, 255' : '0, 0, 0';
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, width, height);
    
    drawLines();
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Update particle colors if theme changes
    particles.forEach(particle => {
        particle.color = getComputedStyle(document.body).getPropertyValue('--text-color');
    });
    
    requestAnimationFrame(animate);
}

// Initialize and start animation
initParticles();
animate();

// Make sure theme toggle also updates particle colors
themeToggle.addEventListener('click', () => {
    setTimeout(() => {
        particles.forEach(particle => {
            particle.color = getComputedStyle(document.body).getPropertyValue('--text-color');
        });
    }, 50);
});

// Optional modification to only show typing effect on first visit
document.addEventListener('DOMContentLoaded', function() {
    const textElement = document.getElementById('typing-text');
    const textToType = "Hi, everyone!\nI'm Dulara Abhiranda.";
    
    // Check if this is first visit
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (!hasVisited) {
      // First visit - show typing effect
      let i = 0;
      let speed = 100;
      
      function typeWriter() {
        if (i < textToType.length) {
          if (textToType.charAt(i) === '\n') {
            textElement.innerHTML += '<br>';
          } else {
            textElement.innerHTML += textToType.charAt(i);
          }
          i++;
          setTimeout(typeWriter, speed);
        }
      }
      
      setTimeout(() => {
        typeWriter();
      }, 500);
      
      // Set flag that user has visited
      localStorage.setItem('hasVisited', 'true');
    } else {
      // Not first visit - show text immediately
      textElement.innerHTML = textToType.replace('\n', '<br>');
    }
  });

// Function to set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Get the link's href and extract the page name or hash
        const linkPage = link.getAttribute('href');
        
        // Check if we're on the index.html or / and the link is to #about
        if ((currentPage === '' || currentPage === 'index.html') && linkPage === '#about') {
            // Do nothing, don't set this as active
        }
        // For about.html page, activate the About link
        else if (currentPage === 'about.html' && linkPage === '#about') {
            link.classList.add('active');
        }
        // Add more conditions for other pages as needed
    });
}













// About page specific JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page-specific elements
    initializeAboutPage();
});

function initializeAboutPage() {
    // Add animation to the about cards when they come into view
    const aboutCards = document.querySelectorAll('.about-card');
    const testimonialsCards = document.querySelectorAll('.testimonial-card');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Initialize Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards and timeline items
    aboutCards.forEach(card => {
        observer.observe(card);
        // Add initial hidden class
        card.classList.add('hidden');
    });
    
    testimonialsCards.forEach(card => {
        observer.observe(card);
        // Add initial hidden class
        card.classList.add('hidden');
    });
    
    timelineItems.forEach(item => {
        observer.observe(item);
        // Add initial hidden class
        item.classList.add('hidden');
    });
    
    // Add hover effects to testimonial cards
    testimonialsCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.testimonial-text').classList.add('expanded');
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.testimonial-text').classList.remove('expanded');
        });
    });
    
    // Make the view source links open in a new tab
    document.querySelectorAll('.view-source').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

// Add CSS animation classes
document.head.insertAdjacentHTML('beforeend', `
<style>
    .about-card.hidden,
    .testimonial-card.hidden,
    .timeline-item.hidden {
        opacity: 0;
        transform: translateY(20px);
    }
    
    .about-card.animate,
    .testimonial-card.animate,
    .timeline-item.animate {
        animation: fadeInUp 0.6s forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .testimonial-text {
        max-height: 100px;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }
    
    .testimonial-text.expanded {
        max-height: 300px;
    }
</style>
`);





  