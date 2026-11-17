const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const bookingForm = document.querySelector("#booking-form");
if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(bookingForm);
    const message = [
      "Hello Fox Driving School!",
      `My name is ${data.get("name")}.`,
      `My phone number is ${data.get("phone")}.`,
      `I'm interested in: ${data.get("course")}.`,
      "Please help me book a lesson."
    ].join("\n");
    window.open(`https://wa.me/27765736116?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
}

const whatsappFloat = document.querySelector(".whatsapp-float");
const footerSocial = document.querySelector(".footer-social");
if (whatsappFloat && footerSocial) {
  const keepWhatsAppClear = () => {
    const socialRect = footerSocial.getBoundingClientRect();
    const buttonRect = whatsappFloat.getBoundingClientRect();
    const overlapsHorizontally = buttonRect.right > socialRect.left && buttonRect.left < socialRect.right;
    const defaultButtonTop = window.innerHeight - 22 - buttonRect.height;
    const defaultButtonBottom = window.innerHeight - 22;
    const overlapsAtBottom = defaultButtonBottom > socialRect.top && defaultButtonTop < socialRect.bottom;

    if (overlapsHorizontally && overlapsAtBottom) {
      whatsappFloat.style.setProperty("--whatsapp-bottom", `${window.innerHeight - socialRect.top + 12}px`);
    } else {
      whatsappFloat.style.removeProperty("--whatsapp-bottom");
    }
  };

  window.addEventListener("scroll", keepWhatsAppClear, { passive: true });
  window.addEventListener("resize", keepWhatsAppClear);
  keepWhatsAppClear();
}

const galleryCarousel = document.querySelector(".gallery-carousel");
if (galleryCarousel) {
  const slides = Array.from(galleryCarousel.querySelectorAll(".gallery-feature"));
  const dots = Array.from(galleryCarousel.querySelectorAll(".gallery-dot"));
  const playToggle = galleryCarousel.querySelector(".gallery-play-toggle");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let timer;
  let isPlaying = !reducedMotion.matches;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.hidden = !isActive;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-label", `${slideIndex + 1} of ${slides.length}`);
      dots[slideIndex].classList.toggle("is-active", isActive);
      if (isActive) {
        dots[slideIndex].setAttribute("aria-current", "true");
      } else {
        dots[slideIndex].removeAttribute("aria-current");
      }
    });
  };

  const stopSlideshow = () => {
    window.clearInterval(timer);
    timer = undefined;
  };

  const startSlideshow = () => {
    stopSlideshow();
    if (isPlaying) {
      timer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
    }
    playToggle.textContent = isPlaying ? "Ⅱ" : "▶";
    playToggle.setAttribute("aria-label", isPlaying ? "Pause slideshow" : "Play slideshow");
  };

  galleryCarousel.querySelectorAll("[data-slide-step]").forEach((button) => {
    button.addEventListener("click", () => {
      showSlide(activeIndex + Number(button.dataset.slideStep));
      startSlideshow();
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startSlideshow();
    });
  });

  playToggle.addEventListener("click", () => {
    isPlaying = !isPlaying;
    startSlideshow();
  });

  galleryCarousel.addEventListener("mouseenter", stopSlideshow);
  galleryCarousel.addEventListener("mouseleave", startSlideshow);
  galleryCarousel.addEventListener("focusin", stopSlideshow);
  galleryCarousel.addEventListener("focusout", (event) => {
    if (!galleryCarousel.contains(event.relatedTarget)) {
      startSlideshow();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  });

  if (reducedMotion.matches) {
    isPlaying = false;
  }
  showSlide(0);
  startSlideshow();
}
