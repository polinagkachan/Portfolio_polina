(function () {
  "use strict";

  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#" || targetId === "#top") return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      closeMobileMenu();
    });
  });

  // Mobile menu toggle
  var toggle = document.querySelector(".nav__toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  function closeMobileMenu() {
    if (!toggle || !mobileMenu) return;
    toggle.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  }

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.hidden = expanded;
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  // Hero elements visible on load
  window.addEventListener("load", function () {
    document.querySelectorAll(".hero .reveal").forEach(function (el) {
      el.classList.add("visible");
    });
  });

  // Contact form → Telegram
  var TELEGRAM_USERNAME = "kpolino4ka";
  var PROJECT_TYPE_LABELS = {
    web: "Веб-сайт / магазин",
    mobile: "Мобильное приложение",
    game: "Браузерная игра",
    bot: "Бот / автоматизация",
    other: "Другое"
  };

  var form = document.getElementById("contact-form");
  var successBlock = document.getElementById("form-success");
  var resetBtn = document.getElementById("form-reset");

  function buildTelegramMessage() {
    var name = document.getElementById("name").value.trim();
    var contact = document.getElementById("contact-field").value.trim();
    var projectType = document.getElementById("project-type").value;
    var message = document.getElementById("message").value.trim();
    var typeLabel = PROJECT_TYPE_LABELS[projectType] || "Не указан";

    return [
      "Новая заявка с сайта",
      "",
      "Имя: " + name,
      "Контакт: " + contact,
      "Тип проекта: " + typeLabel,
      "",
      "Сообщение:",
      message
    ].join("\n");
  }

  function openTelegramWithMessage(text) {
    var url = "https://t.me/" + TELEGRAM_USERNAME + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function showError(fieldId, errorId, message) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(errorId);
    if (field) field.classList.add("error");
    if (error) error.textContent = message;
  }

  function showConsentError(message) {
    var consentLabel = document.querySelector(".form-consent");
    var error = document.getElementById("consent-error");
    if (consentLabel) consentLabel.classList.add("error");
    if (error) error.textContent = message;
  }

  function clearErrors() {
    form.querySelectorAll(".error").forEach(function (el) {
      el.classList.remove("error");
    });
    form.querySelectorAll(".form-consent").forEach(function (el) {
      el.classList.remove("error");
    });
    form.querySelectorAll(".form-error").forEach(function (el) {
      el.textContent = "";
    });
  }

  function validateForm() {
    clearErrors();
    var valid = true;

    var name = document.getElementById("name");
    var contact = document.getElementById("contact-field");
    var message = document.getElementById("message");
    var consent = document.getElementById("consent");

    if (!name.value.trim()) {
      showError("name", "name-error", "Укажите имя");
      valid = false;
    }

    if (!contact.value.trim()) {
      showError("contact-field", "contact-error", "Укажите email или Telegram");
      valid = false;
    }

    if (!message.value.trim()) {
      showError("message", "message-error", "Напишите сообщение");
      valid = false;
    }

    if (!consent || !consent.checked) {
      showConsentError("Подтвердите согласие с офертой и политикой конфиденциальности");
      valid = false;
    }

    return valid;
  }

  if (form && successBlock) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      openTelegramWithMessage(buildTelegramMessage());
      form.hidden = true;
      successBlock.hidden = false;
    });
  }

  if (resetBtn && form && successBlock) {
    resetBtn.addEventListener("click", function () {
      form.reset();
      clearErrors();
      successBlock.hidden = true;
      form.hidden = false;
    });
  }
})();
