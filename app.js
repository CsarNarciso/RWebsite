// REGAMSA MEDICAL — concept interactions (no framework)
(function () {
  var KEY = "regamsa_quote_v1";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var catalogViewOpen = false;

  // =========================================================
  // QUOTE CART (localStorage)
  // =========================================================
  var drawer = document.getElementById("quoteDrawer");
  var backdrop = document.getElementById("drawerBackdrop");
  var quoteList = document.getElementById("quoteList");
  var quoteCount = document.getElementById("quoteCount");
  var formProducts = document.getElementById("formProducts");
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function save(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  }
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 2600);
  }
  function render() {
    var items = load();
    if (quoteCount) quoteCount.textContent = String(items.length);
    quoteList.innerHTML = "";
    if (!items.length) {
      var li = document.createElement("li");
      li.className = "drawer-empty";
      li.textContent = "Tu carrito se encuentra vacio";
      quoteList.appendChild(li);
    } else {
      items.forEach(function (name, i) {
        var li = document.createElement("li");
        var span = document.createElement("span");
        span.textContent = name;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Quitar";
        btn.setAttribute("aria-label", "Quitar " + name);
        btn.addEventListener("click", function () {
          var next = load();
          next.splice(i, 1);
          save(next); render();
        });
        li.appendChild(span);
        li.appendChild(btn);
        quoteList.appendChild(li);
      });
    }
    if (formProducts) formProducts.value = items.join(" · ");
  }
  function openDrawer() {
    render();
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
  }

  // Delegated: works for static and dynamically rendered product cards
  document.addEventListener("click", function (event) {
    var target = event.target;
    var btn = target && target.closest ? target.closest("[data-add-quote]") : null;
    if (!btn) return;
    var name = btn.getAttribute("data-add-quote");
    var items = load();
    if (items.indexOf(name) === -1) {
      items.push(name);
      save(items);
      showToast("Agregado a tu lista de cotización");
    } else {
      showToast("Ya está en tu lista");
    }
    render();
    openDrawer();
  });

  document.getElementById("openQuote").addEventListener("click", openDrawer);
  document.getElementById("openQuote2").addEventListener("click", openDrawer);
  document.getElementById("closeQuote").addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

  document.getElementById("clearQuote").addEventListener("click", function () {
    save([]); render(); showToast("Lista vaciada");
  });

  document.getElementById("goContact").addEventListener("click", function () {
    closeDrawer();
    closeSectionView();
    var contact = document.getElementById("contacto");
    if (contact) contact.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
  });

  // =========================================================
  // MOBILE MENU
  // =========================================================
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  navToggle.addEventListener("click", function () {
    var open = mobileMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobileMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // =========================================================
  // NAV — ink ripple + scroll spy
  // =========================================================
  var navbar = document.getElementById("navbar");
  var navLinks = document.getElementById("navLinks");
  var desktopLinks = Array.from(navLinks.querySelectorAll("a[href^='#']"));
  var headerLinks = desktopLinks.concat(Array.from(mobileMenu.querySelectorAll("a[href^='#']")));
  var inkLinks = [navbar.querySelector(".brand")].concat(headerLinks);

  inkLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (reducedMotion.matches) return;
      var bounds = link.getBoundingClientRect();
      var x = event.detail === 0 ? bounds.width / 2 : event.clientX - bounds.left;
      var y = event.detail === 0 ? bounds.height / 2 : event.clientY - bounds.top;
      var diameter = 2 * Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y));
      var ink = document.createElement("span");
      ink.className = "nav-ink";
      ink.setAttribute("aria-hidden", "true");
      ink.style.setProperty("--ink-x", x + "px");
      ink.style.setProperty("--ink-y", y + "px");
      ink.style.setProperty("--ink-size", diameter + "px");
      link.appendChild(ink);
      var cleanupTimer = setTimeout(removeInk, 850);
      function removeInk() {
        clearTimeout(cleanupTimer);
        ink.remove();
      }
      ink.addEventListener("animationend", removeInk, { once: true });
      ink.addEventListener("animationcancel", removeInk, { once: true });
    }, { capture: true });
  });

  var navSections = desktopLinks.map(function (link) {
    return { link: link, section: document.getElementById(link.hash.slice(1)) };
  }).filter(function (item) { return item.section; });
  var activeLink = null;
  var hoveredLink = null;
  var navFrame = null;

  function positionNavLine() {
    var focusedLink = desktopLinks.indexOf(document.activeElement) !== -1 && document.activeElement.matches(":focus-visible") ? document.activeElement : null;
    var link = hoveredLink || focusedLink || activeLink;
    if (!link || !navLinks.getClientRects().length) {
      navLinks.style.setProperty("--nav-line-opacity", "0");
      return;
    }
    var bounds = link.getBoundingClientRect();
    var navBounds = navLinks.getBoundingClientRect();
    navLinks.style.setProperty("--nav-line-x", (bounds.left - navBounds.left) + "px");
    navLinks.style.setProperty("--nav-line-width", bounds.width + "px");
    navLinks.style.setProperty("--nav-line-opacity", "1");
  }

  function updateNavSection() {
    navFrame = null;
    navbar.classList.toggle("scrolled", window.scrollY > 8);
    var catalogLink = document.querySelector('.nav-links a[href="#catalogo"]');
    if (catalogViewOpen) {
      activeLink = catalogLink;
      headerLinks.forEach(function (link) {
        if (link.hash === "#catalogo") link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      positionNavLine();
      return;
    }
    var threshold = navbar.querySelector(".nav-inner").getBoundingClientRect().height + Math.min(160, window.innerHeight * .2);
    var current = null;
    navSections.forEach(function (item) {
      if (item.section.getBoundingClientRect().top <= threshold) current = item.link;
    });
    if (navSections.length && window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = navSections[navSections.length - 1].link;
    }
    activeLink = current;
    headerLinks.forEach(function (link) {
      if (current && link.hash === current.hash) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    positionNavLine();
  }

  function scheduleNavUpdate() {
    if (navFrame === null) navFrame = requestAnimationFrame(updateNavSection);
  }

  desktopLinks.forEach(function (link) {
    link.addEventListener("mouseenter", function () {
      hoveredLink = link;
      positionNavLine();
    });
    link.addEventListener("focus", positionNavLine);
    link.addEventListener("blur", scheduleNavUpdate);
  });
  navLinks.addEventListener("mouseleave", function () {
    hoveredLink = null;
    positionNavLine();
  });
  window.addEventListener("scroll", scheduleNavUpdate, { passive: true });
  window.addEventListener("resize", scheduleNavUpdate);
  window.addEventListener("load", scheduleNavUpdate);
  var navResizeObserver = new ResizeObserver(scheduleNavUpdate);
  navResizeObserver.observe(document.getElementById("inicio"));
  navResizeObserver.observe(navbar.querySelector(".nav-inner"));
  if (document.fonts) document.fonts.ready.then(scheduleNavUpdate);

  // =========================================================
  // CATALOG — section data
  // =========================================================
  var SECTION_IDS = ["columnas-cieliticas", "paneles", "alarmas"];

  // =========================================================
  // VIEW ROUTER (separate catalog views via hash)
  // =========================================================
  var homeMain = document.getElementById("inicio");
  var viewRoot = document.getElementById("catalogViews");
  var currentViewId = null;
  var rotatorApi = null;

  function getRoute() {
    var clean = (window.location.hash || "").replace(/^#\/?/, "");
    if (clean.indexOf("catalogo/") === 0) {
      var id = clean.slice("catalogo/".length);
      if (SECTION_IDS.indexOf(id) !== -1) return { view: id };
    }
    return { view: null, anchor: clean || null };
  }

  function openSectionView(id) {
    var view = document.getElementById("view-" + id);
    if (!view) { closeSectionView(); return; }
    homeMain.classList.add("is-hidden");
    viewRoot.hidden = false;
    viewRoot.classList.add("is-open");
    Array.prototype.forEach.call(viewRoot.children, function (child) {
      child.classList.toggle("is-active", child === view);
    });
    catalogViewOpen = true;
    currentViewId = id;
    if (rotatorApi) rotatorApi.stop();
    window.scrollTo({ top: 0, behavior: "auto" });
    updateNavSection();
    document.title = view.getAttribute("data-title") + " · REGAMSA Medical";
  }

  function closeSectionView() {
    if (currentViewId) {
      viewRoot.hidden = true;
      viewRoot.classList.remove("is-open");
      Array.prototype.forEach.call(viewRoot.children, function (child) {
        child.classList.remove("is-active");
      });
      homeMain.classList.remove("is-hidden");
      catalogViewOpen = false;
      currentViewId = null;
      document.title = "Regamsa Medical";
      if (rotatorApi) rotatorApi.start();
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    updateNavSection();
  }

  function applyRoute() {
    var route = getRoute();
    if (route.view) {
      openSectionView(route.view);
    } else {
      closeSectionView();
      if (route.anchor) {
        var el = document.getElementById(route.anchor);
        if (el) el.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
      }
    }
  }
  window.addEventListener("hashchange", applyRoute);

  // =========================================================
  // CATALOG — 3D section carousel
  // =========================================================
  var rotator = document.getElementById("sectionRotator");
  if (rotator) {
    var rotatorViewport = document.getElementById("rotatorViewport");
    var rotatorTrack = document.getElementById("rotatorTrack");
    var rotatorCards = Array.from(rotatorTrack.children);
    var rotatorDots = document.getElementById("rotatorDots");
    var rotatorPrev = document.getElementById("rotatorPrev");
    var rotatorNext = document.getElementById("rotatorNext");
    var rotatorPause = document.getElementById("rotatorPause");
    var rotatorIndex = 0;
    var rotatorTimer = null;
    var rotatorPaused = false;
    var rotatorHovered = false;
    var dotButtons = [];
    var total = rotatorCards.length;

    rotatorCards.forEach(function (card, i) {
      var button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", "Mostrar " + card.querySelector(".rotator-title").textContent);
      button.addEventListener("click", function () { goToSection(i); });
      rotatorDots.appendChild(button);
      dotButtons.push(button);
    });

    function setRotatorActive(i) {
      rotatorIndex = i;
      rotatorCards.forEach(function (card, index) {
        var offset = index - i;
        if (total > 1) {
          if (offset > total / 2) offset -= total;
          else if (offset < -total / 2) offset += total;
        }
        var abs = Math.abs(offset);
        card.style.setProperty("--rot-offset", String(offset));
        card.style.setProperty("--rot-abs", String(abs));
        card.classList.toggle("is-active", abs === 0);
        card.style.zIndex = String(total - abs);
        if (abs === 0) {
          card.removeAttribute("aria-hidden");
          card.removeAttribute("tabindex");
        } else {
          card.setAttribute("aria-hidden", "true");
          card.setAttribute("tabindex", "-1");
        }
      });
      dotButtons.forEach(function (button, index) {
        if (index === i) button.setAttribute("aria-current", "true");
        else button.removeAttribute("aria-current");
      });
    }

    function goToSection(i) {
      if (!total) return;
      setRotatorActive(((i % total) + total) % total);
    }

    function stopRotator() {
      if (rotatorTimer !== null) {
        clearInterval(rotatorTimer);
        rotatorTimer = null;
      }
    }

    function startRotator() {
      stopRotator();
      if (rotatorPaused || rotatorHovered || reducedMotion.matches || total < 2 || document.hidden) return;
      rotatorTimer = setInterval(function () {
        goToSection(rotatorIndex + 1);
      }, 6500);
    }

    rotatorApi = { stop: stopRotator, start: startRotator, go: goToSection };

    rotatorPrev.addEventListener("click", function () { goToSection(rotatorIndex - 1); });
    rotatorNext.addEventListener("click", function () { goToSection(rotatorIndex + 1); });

    rotatorPause.addEventListener("click", function () {
      rotatorPaused = !rotatorPaused;
      rotatorPause.setAttribute("aria-pressed", rotatorPaused ? "true" : "false");
      rotatorPause.textContent = rotatorPaused ? "Reanudar" : "Pausar";
      if (rotatorPaused) stopRotator();
      else startRotator();
    });

    rotator.addEventListener("mouseenter", function () { rotatorHovered = true; stopRotator(); });
    rotator.addEventListener("mouseleave", function () { rotatorHovered = false; startRotator(); });
    rotator.addEventListener("focusin", function () { rotatorHovered = true; stopRotator(); });
    rotator.addEventListener("focusout", function () {
      setTimeout(function () {
        if (!rotator.contains(document.activeElement)) {
          rotatorHovered = false;
          startRotator();
        }
      }, 0);
    });
    rotator.addEventListener("touchstart", function () { rotatorHovered = true; stopRotator(); }, { passive: true });
    rotator.addEventListener("touchend", function () { rotatorHovered = false; startRotator(); }, { passive: true });
    rotator.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSection(rotatorIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToSection(rotatorIndex + 1);
      }
    });

    var touchStartX = null;
    var touchStartY = null;
    var touchMoved = false;
    rotatorViewport.addEventListener("touchstart", function (event) {
      var touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchMoved = false;
    }, { passive: true });
    rotatorViewport.addEventListener("touchmove", function (event) {
      if (touchStartX === null) return;
      var touch = event.changedTouches[0];
      var dx = touch.clientX - touchStartX;
      var dy = touch.clientY - touchStartY;
      if (Math.abs(dx) > 24 && Math.abs(dx) > Math.abs(dy)) touchMoved = true;
    }, { passive: true });
    rotatorViewport.addEventListener("touchend", function (event) {
      if (touchStartX === null) return;
      var touch = event.changedTouches[0];
      var dx = touch.clientX - touchStartX;
      if (touchMoved && Math.abs(dx) > 40) {
        goToSection(rotatorIndex + (dx < 0 ? 1 : -1));
      }
      touchStartX = null;
      setTimeout(function () { touchMoved = false; }, 400);
    }, { passive: true });
    rotatorViewport.addEventListener("click", function (event) {
      if (!touchMoved) return;
      event.preventDefault();
      event.stopPropagation();
      touchMoved = false;
    }, true);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopRotator();
      else startRotator();
    });

    setRotatorActive(0);
    startRotator();
  }

  // =========================================================
  // ALARMAS — model switcher + sim board + internal scroll
  // =========================================================
  var alView = document.getElementById("view-alarmas");
  if (alView) {
    var alTabs = Array.prototype.slice.call(alView.querySelectorAll(".al-tab"));
    var alPanels = Array.prototype.slice.call(alView.querySelectorAll(".al-panel"));
    var alThemeBtn = alView.querySelector(".al-theme");

    try { if (localStorage.getItem("regamsa_al_light") === "1") alView.classList.add("al-light"); } catch (e) {}

    function syncAlTheme() {
      if (!alThemeBtn) return;
      var light = alView.classList.contains("al-light");
      alThemeBtn.setAttribute("aria-pressed", light ? "true" : "false");
      var txt = alThemeBtn.querySelector(".al-theme-txt");
      if (txt) txt.textContent = light ? "Modo oscuro" : "Modo claro";
    }

    if (alThemeBtn) {
      syncAlTheme();
      alThemeBtn.addEventListener("click", function () {
        var light = alView.classList.toggle("al-light");
        try { localStorage.setItem("regamsa_al_light", light ? "1" : "0"); } catch (e) {}
        syncAlTheme();
      });
    }

    function selectAlarmTab(tab) {
      alTabs.forEach(function (other) {
        var on = other === tab;
        other.setAttribute("aria-selected", on ? "true" : "false");
        other.tabIndex = on ? 0 : -1;
      });
      alPanels.forEach(function (panel) {
        panel.classList.toggle("is-open", panel.id === tab.getAttribute("aria-controls"));
      });
    }

    alTabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { selectAlarmTab(tab); });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") next = alTabs[(index + 1) % alTabs.length];
        else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = alTabs[(index - 1 + alTabs.length) % alTabs.length];
        else if (event.key === "Home") next = alTabs[0];
        else if (event.key === "End") next = alTabs[alTabs.length - 1];
        if (next) {
          event.preventDefault();
          next.focus();
          selectAlarmTab(next);
        }
      });
    });

    alView.querySelectorAll("[data-al-scroll]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = document.getElementById(btn.getAttribute("data-al-scroll"));
        if (target) target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
      });
    });

    var alRows = Array.prototype.slice.call(alView.querySelectorAll(".al-board li"));
    if (alRows.length && !reducedMotion.matches) {
      setInterval(function () {
        if (document.hidden || alView.offsetParent === null) return;
        var row = alRows[Math.floor(Math.random() * alRows.length)];
        if (!row) return;
        var stateEl = row.querySelector(".al-state");
        var prev = stateEl ? stateEl.textContent : "";
        row.classList.add("is-alert");
        if (stateEl) stateEl.textContent = "REVISAR";
        setTimeout(function () {
          row.classList.remove("is-alert");
          if (stateEl) stateEl.textContent = prev;
        }, 1600);
      }, 3400);
    }
  }

  // =========================================================
  // CONCEPT FORM + BOOT
  // =========================================================
  document.getElementById("quoteForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = document.getElementById("formOk");
    ok.hidden = false;
    showToast("Solicitud registrada (concepto)");
    ok.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.getElementById("year").textContent = String(new Date().getFullYear());
  render();
  updateNavSection();
  applyRoute();
})();
