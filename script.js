/* ==========================================================================
   Plantea Solution - Premium B2B Script File
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  init3DTilt();
  initScrollReveal();
  initFaqAccordion();
  initCategoryFilter();
  initContactPrefill();
  initDynamicWhatsAppLinks();
});

/* ==========================================================================
   Navigation Behavior (Sticky Navbar)
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check on load
}

/* ==========================================================================
   Mobile Hamburger Drawer
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  hamburger.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

/* ==========================================================================
   3D Tilt Card Effect
   ========================================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.card-3d');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation angles (max 15 degrees)
      const rotateX = ((centerY - y) / centerY) * 15;
      const rotateY = ((x - centerX) / centerX) * 15;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Move inner contents slightly more for parallax depth
      const inner = card.querySelector('.card-3d-inner');
      if (inner) {
        inner.style.transform = `translateZ(40px) scale(0.95)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      
      const inner = card.querySelector('.card-3d-inner');
      if (inner) {
        inner.style.transform = 'translateZ(0px)';
        inner.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      }
    });
    
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
      const inner = card.querySelector('.card-3d-inner');
      if (inner) {
        inner.style.transition = 'transform 0.1s ease';
      }
    });
  });
}

/* ==========================================================================
   Scroll Reveal Animation (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all items
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Category Product Filtering (products.html)
   ========================================================================== */
function initCategoryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.grid-3 .product-card');
  const categorySections = document.querySelectorAll('.products-category-section');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      if (filterValue === 'all') {
        // Show all category sections and cards
        categorySections.forEach(section => {
          section.style.display = 'block';
        });
        productCards.forEach(card => {
          card.style.display = 'flex';
        });
      } else {
        // Show only the section that matches the category
        categorySections.forEach(section => {
          const category = section.getAttribute('data-category');
          if (category === filterValue) {
            section.style.display = 'block';
          } else {
            section.style.display = 'none';
          }
        });
      }
    });
  });
}

/* ==========================================================================
   Contact Form Prefill / Dynamic Query Routing
   ========================================================================== */
function initContactPrefill() {
  const urlParams = new URLSearchParams(window.location.search);
  const productParam = urlParams.get('product');
  const enquiryForm = document.getElementById('enquiry-form');
  
  if (!productParam) return;

  const productDropdown = document.getElementById('product-interest');
  if (productDropdown) {
    // Attempt exact match
    for (let i = 0; i < productDropdown.options.length; i++) {
      if (productDropdown.options[i].value.toLowerCase() === productParam.toLowerCase()) {
        productDropdown.selectedIndex = i;
        break;
      }
    }
  }

  const messageTextarea = document.getElementById('message');
  if (messageTextarea) {
    // Generate polite preset message
    const formattedProductName = productParam.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    messageTextarea.value = `Dear Plantea Solution, we are interested in receiving bulk pricing, availability, and sample options for ${formattedProductName}. Please share specification sheets and business terms.`;
  }
}

/* ==========================================================================
   Dynamic WhatsApp Links
   ========================================================================== */
function initDynamicWhatsAppLinks() {
  const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
  const phoneNumber = '919834521438'; // Plantea Solution Official WhatsApp

  whatsappButtons.forEach(btn => {
    const productName = btn.getAttribute('data-product');
    let message = "Hi Plantea Solution, I would like to make an enquiry regarding your products.";

    if (productName) {
      message = `Hi Plantea Solution, I am interested in inquiring about bulk orders and product details for ${productName}. Could you please send me technical specification sheets and pricing details?`;
    }

    const encodedMessage = encodeURIComponent(message);
    btn.setAttribute('href', `https://wa.me/${phoneNumber}?text=${encodedMessage}`);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  });
}

/* ==========================================================================
   Enquiry Prefill Helper (B2B Redirection Utility)
   ========================================================================== */
// This can be called globally if inline onclicks are used, or dynamically
window.redirectToEnquiry = function(productSlug) {
  window.location.href = `contact.html?product=${productSlug}`;
};
