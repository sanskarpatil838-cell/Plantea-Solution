(function () {
  document.documentElement.classList.add("js");

  const body = document.body;
  const menuToggle = document.querySelector(".menu-toggle");
  const navDrawer = document.querySelector(".nav-drawer");
  const backToTop = document.querySelector(".back-to-top");
  const whatsappNumber = "919834521438";
  const websiteUrl = "https://planteasolution.com";

  const productOptions = [
    "Dehydrated Beetroot Powder",
    "dehydrated garlic powder",
    "Dehydrated Tomato Powder",
    "Dehydrated White Onion Powder",
    "Dehydrated Mint Powder",
    "Dehydrated Moringa Powder",
    "Dehydrated Neem Powder",
    "Onion Garlic Umami",
    "Pudina Fresh",
    "Red Chilli Kick",
    "Sweet & Tangy",
    "Tomato Rich",
    "Dehydrated Green Banana Powder",
    "Blend Mattha Masala Powder",
    "Customised Blend"
  ];

  if (menuToggle && navDrawer) {
    menuToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navDrawer.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        body.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.includes("#")) return;
      const [page, hash] = href.split("#");
      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      if (page && page !== currentPage && !(page === "index.html" && currentPage === "")) return;
      const target = document.getElementById(hash);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", `#${hash}`);
    });
  });

  const revealElements = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => observer.observe(element));
    window.setTimeout(() => {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    }, 1400);
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((0.5 - y / rect.height) * 10);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const productCards = document.querySelectorAll("[data-category]");
  const categorySections = document.querySelectorAll("[data-category-section]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      productCards.forEach((card) => {
        const shouldShow = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hide", !shouldShow);
      });

      categorySections.forEach((section) => {
        const shouldShow = filter === "all" || section.dataset.categorySection === filter;
        section.classList.toggle("hide", !shouldShow);
      });
    });
  });

  const params = new URLSearchParams(window.location.search);
  const productFromUrl = params.get("product");
  const productFromPage = document.querySelector("[data-current-product]")?.dataset.currentProduct;
  const productInterest = productFromUrl || productFromPage || "";

  document.querySelectorAll("select[name='product']").forEach((select) => {
    const existing = Array.from(select.options).map((option) => option.value);
    productOptions.forEach((product) => {
      if (!existing.includes(product)) {
        const option = document.createElement("option");
        option.value = product;
        option.textContent = product;
        select.appendChild(option);
      }
    });
    if (productInterest) {
      select.value = productInterest;
    }
  });

  document.querySelectorAll("textarea[name='message']").forEach((textarea) => {
    if (productInterest && !textarea.value.trim()) {
      textarea.value = `Please share bulk order details, pricing, packaging options and sample availability for ${productInterest}.`;
    }
  });

  const getFormWhatsAppDetails = (link) => {
    const form = link.closest("form");
    if (!form) return {};
    const formData = new FormData(form);
    return {
      name: formData.get("name"),
      company: formData.get("company"),
      phone: formData.get("phone"),
      product: formData.get("product"),
      quantity: formData.get("quantity"),
      message: formData.get("message")
    };
  };

  const buildWhatsAppMessage = (product, details = {}) => {
    const selectedProduct = details.product || product || productInterest || "Plantea Solution products";
    const lines = [
      `Hello! I found your website ${websiteUrl} and am interested in your products.`,
      "",
      `Product: ${selectedProduct}`
    ];

    if (details.quantity) lines.push(`Quantity requirement: ${details.quantity}`);
    if (details.name) lines.push(`Name: ${details.name}`);
    if (details.company) lines.push(`Company: ${details.company}`);
    if (details.phone) lines.push(`Phone: ${details.phone}`);
    if (details.message && !String(details.message).startsWith("Please share bulk order details")) {
      lines.push("", `Message: ${details.message}`);
    }

    lines.push("", "Please share price, MOQ, packaging options and sample availability.");
    return lines.join("\n");
  };

  const buildWhatsAppUrl = (product, details = {}, configuredNumber = "") => {
    const number = String(configuredNumber || whatsappNumber).replace(/\D/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsAppMessage(product, details))}`;
  };

  const updateWhatsAppLinks = () => {
    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
      const product = link.dataset.product || productInterest || "Plantea Solution products";
      link.href = buildWhatsAppUrl(product, getFormWhatsAppDetails(link), link.dataset.whatsappNumber);
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", `Send WhatsApp enquiry to Plantea Solution at +91 98345 21438 for ${product}`);
      link.addEventListener("click", () => {
        link.href = buildWhatsAppUrl(link.dataset.product || productInterest || "Plantea Solution products", getFormWhatsAppDetails(link), link.dataset.whatsappNumber);
      });
    });
  };
  updateWhatsAppLinks();

  if (!document.querySelector(".whatsapp-float")) {
    const floatLink = document.createElement("a");
    floatLink.className = "whatsapp-float";
    floatLink.href = buildWhatsAppUrl(productInterest || "Plantea Solution products");
    floatLink.dataset.whatsapp = "";
    floatLink.dataset.product = productInterest || "Plantea Solution products";
    floatLink.target = "_blank";
    floatLink.rel = "noopener";
    floatLink.setAttribute("aria-label", "WhatsApp Plantea Solution at +91 98345 21438");
    floatLink.innerHTML = '<span class="whatsapp-icon" aria-hidden="true"><svg viewBox="0 0 32 32" role="img" focusable="false"><path d="M16.02 4.1A11.72 11.72 0 0 0 5.9 21.74L4.4 27.6l5.98-1.42A11.72 11.72 0 1 0 16.02 4.1Zm0 2.14a9.58 9.58 0 1 1-4.88 17.82l-.39-.23-3.35.8.84-3.26-.25-.41a9.57 9.57 0 0 1 8.03-14.72Zm-4.1 4.74c-.22-.5-.46-.51-.68-.52h-.58c-.2 0-.52.08-.79.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.07 3.31 5.08 4.51 2.51 1 3.02.8 3.56.75.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.63-.94-2.22Z" fill="currentColor"/></svg></span><span>WhatsApp Us</span>';
    document.body.appendChild(floatLink);
  }

  if (!document.querySelector(".linkedin-float")) {
    const linkedinLink = document.createElement("a");
    linkedinLink.className = "linkedin-float";
    linkedinLink.href = "https://www.linkedin.com/in/plantea-solution-5bb333363";
    linkedinLink.target = "_blank";
    linkedinLink.rel = "noopener";
    linkedinLink.setAttribute("aria-label", "Open Plantea Solution on LinkedIn");
    linkedinLink.innerHTML = '<span class="linkedin-icon" aria-hidden="true">in</span><span>LinkedIn</span>';
    document.body.appendChild(linkedinLink);
  }

  document.querySelectorAll("[data-enquiry-product]").forEach((link) => {
    link.addEventListener("click", () => {
      sessionStorage.setItem("planteaProductInterest", link.dataset.enquiryProduct);
    });
  });

  const storedProduct = sessionStorage.getItem("planteaProductInterest");
  if (!productInterest && storedProduct && document.querySelector(".enquiry-form")) {
    const select = document.querySelector("select[name='product']");
    const textarea = document.querySelector("textarea[name='message']");
    if (select) select.value = storedProduct;
    if (textarea && !textarea.value.trim()) {
      textarea.value = `Please share bulk order details, pricing, packaging options and sample availability for ${storedProduct}.`;
    }
  }

  document.querySelectorAll(".enquiry-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let valid = true;
      form.querySelectorAll(".error-text").forEach((error) => error.textContent = "");

      const requiredFields = form.querySelectorAll("[required]");
      requiredFields.forEach((field) => {
        const error = form.querySelector(`[data-error-for="${field.name}"]`);
        if (!field.value.trim()) {
          valid = false;
          if (error) error.textContent = "This field is required.";
        }
      });

      const email = form.querySelector("input[type='email']");
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        valid = false;
        const error = form.querySelector(`[data-error-for="${email.name}"]`);
        if (error) error.textContent = "Enter a valid email address.";
      }

      const phone = form.querySelector("input[name='phone']");
      if (phone && phone.value.trim() && !/^[0-9+\-\s()]{7,18}$/.test(phone.value.trim())) {
        valid = false;
        const error = form.querySelector('[data-error-for="phone"]');
        if (error) error.textContent = "Enter a valid phone number.";
      }

      const status = form.querySelector(".form-status");
      if (!valid) {
        if (status) status.textContent = "Please correct the highlighted fields.";
        return;
      }

      const formData = new FormData(form);
      const product = formData.get("product") || productInterest || "Bulk enquiry";
      const subject = `Bulk enquiry - ${product}`;
      const bodyLines = [
        `Name: ${formData.get("name") || ""}`,
        `Company: ${formData.get("company") || ""}`,
        `Email: ${formData.get("email") || ""}`,
        `Phone: ${formData.get("phone") || ""}`,
        `Product: ${product}`,
        `Quantity: ${formData.get("quantity") || ""}`,
        "",
        formData.get("message") || ""
      ];
      const mailto = `mailto:info@planteasolution.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      if (status) status.textContent = "Enquiry is ready in your email app. You can review and send it.";
      window.location.href = mailto;
    });
  });

  const syncBackButton = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("visible", window.scrollY > 560);
  };

  window.addEventListener("scroll", syncBackButton, { passive: true });
  syncBackButton();

  if (backToTop) {
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
})();


