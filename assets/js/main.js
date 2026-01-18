/**
* Template Name: DevFolio
* Template URL: https://bootstrapmade.com/devfolio-bootstrap-portfolio-html-template/
* Updated: Mar 17 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(() => {
  "use strict";

  const select = (selector, all = false) => {
    const trimmed = selector.trim();
    return all
      ? Array.from(document.querySelectorAll(trimmed))
      : document.querySelector(trimmed);
  };

  const on = (type, selector, listener, all = false, options) => {
    const selected = select(selector, all);
    if (!selected) {
      return;
    }

    if (all) {
      selected.forEach((element) => element.addEventListener(type, listener, options));
      return;
    }

    selected.addEventListener(type, listener, options);
  };

  const onScroll = (listener) => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(() => {
        listener();
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
  };

  const header = select("#header");
  const navbar = select("#navbar");
  const backToTop = select(".back-to-top");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scrollto = (selector) => {
    const element = select(selector);
    if (!element) {
      return;
    }

    const headerOffset = header ? header.offsetHeight : 0;
    const offset = header && !header.classList.contains("header-scrolled")
      ? headerOffset - 16
      : headerOffset;

    const elementPos = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPos - offset,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  };

  const navbarLinks = select("#navbar .scrollto", true);
  const setActiveNav = () => {
    const position = window.scrollY + 200;
    navbarLinks.forEach((navbarLink) => {
      if (!navbarLink.hash) {
        return;
      }
      const section = select(navbarLink.hash);
      if (!section) {
        return;
      }
      const isActive = position >= section.offsetTop
        && position <= (section.offsetTop + section.offsetHeight);
      navbarLink.classList.toggle("active", isActive);
    });
  };

  window.addEventListener("load", setActiveNav);
  onScroll(setActiveNav);

  if (header) {
    const handleHeaderScroll = () => {
      header.classList.toggle("header-scrolled", window.scrollY > 100);
    };
    window.addEventListener("load", handleHeaderScroll);
    onScroll(handleHeaderScroll);
  }

  if (backToTop) {
    const handleBackToTop = () => {
      backToTop.classList.toggle("active", window.scrollY > 100);
    };
    window.addEventListener("load", handleBackToTop);
    onScroll(handleBackToTop);
  }

  on("click", ".mobile-nav-toggle", function () {
    if (!navbar) {
      return;
    }
    navbar.classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  on("click", ".navbar .dropdown > a", (event) => {
    if (!navbar || !navbar.classList.contains("navbar-mobile")) {
      return;
    }
    event.preventDefault();
    const nextMenu = event.currentTarget.nextElementSibling;
    if (nextMenu) {
      nextMenu.classList.toggle("dropdown-active");
    }
  }, true);

  on("click", ".scrollto", (event) => {
    const targetHash = event.currentTarget.hash;
    if (!targetHash || !select(targetHash)) {
      return;
    }
    event.preventDefault();

    if (navbar && navbar.classList.contains("navbar-mobile")) {
      navbar.classList.remove("navbar-mobile");
      const navbarToggle = select(".mobile-nav-toggle");
      if (navbarToggle) {
        navbarToggle.classList.toggle("bi-list");
        navbarToggle.classList.toggle("bi-x");
      }
    }
    scrollto(targetHash);
  }, true);

  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  const typedEl = select(".typed");
  if (typedEl) {
    const typedItems = typedEl.getAttribute("data-typed-items") || "";
    const strings = typedItems
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!prefersReducedMotion && strings.length && window.Typed) {
      new Typed(".typed", {
        strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000
      });
    } else if (strings.length) {
      typedEl.textContent = strings[0];
    }
  }

  if (window.GLightbox) {
    GLightbox({
      selector: ".portfolio-lightbox"
    });
  }

  if (window.Swiper) {
    const autoplayConfig = prefersReducedMotion
      ? false
      : {
          delay: 5000,
          disableOnInteraction: false
        };

    new Swiper(".testimonials-slider", {
      speed: 600,
      loop: true,
      autoplay: autoplayConfig,
      slidesPerView: "auto",
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true
      }
    });

    new Swiper(".portfolio-details-slider", {
      speed: 400,
      loop: true,
      autoplay: autoplayConfig,
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true
      }
    });
  }

  const preloader = select("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  if (window.PureCounter) {
    new PureCounter();
  }
})();
