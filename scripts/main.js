(function () {
  const data = window.SITE_DATA || {};

  const selectors = {
    header: "[data-header]",
    nav: "[data-nav]",
    navToggle: "[data-nav-toggle]",
    toast: "[data-toast]",
    reveal: ".section-reveal"
  };

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (text !== undefined) {
      element.textContent = text;
    }
    return element;
  }

  function renderOverview(items) {
    const root = document.querySelector("[data-overview-list]");
    if (!root) return;

    root.replaceChildren(...items.map((item, index) => {
      const card = createElement("article", `info-card material-${(index % 4) + 1}`);
      card.append(
        createElement("span", "", item.label),
        createElement("strong", "", item.value),
        createElement("p", "", item.text)
      );
      return card;
    }));
  }

  function renderFeatures(items) {
    const root = document.querySelector("[data-feature-list]");
    if (!root) return;

    root.replaceChildren(...items.map((item, index) => {
      const card = createElement("article", `feature-card material-${(index % 4) + 1}`);
      const icon = createElement("span", "feature-icon", item.icon);
      const body = createElement("div");
      body.append(createElement("h3", "", item.title), createElement("p", "", item.text));
      card.append(icon, body);
      return card;
    }));
  }

  function renderStats(items) {
    const root = document.querySelector("[data-stat-list]");
    if (!root) return;

    root.replaceChildren(...items.map((item) => {
      const card = createElement("div", "band-stat");
      card.append(createElement("strong", "", item.value), createElement("span", "", item.label));
      return card;
    }));
  }

  function renderScenery(items) {
    const root = document.querySelector("[data-scenery-list]");
    if (!root) return;

    root.replaceChildren(...items.map((item, index) => {
      const card = createElement("article", `scenery-card scenery-card-${index + 1}`);
      const imageWrap = createElement("div", "scenery-image");
      const image = createElement("img");
      image.src = item.image;
      image.alt = item.title;
      image.loading = "lazy";
      imageWrap.append(image);

      const body = createElement("div", "scenery-body");
      body.append(createElement("span", "", `0${index + 1}`), createElement("h3", "", item.title), createElement("p", "", item.text));
      card.append(imageWrap, body);
      return card;
    }));
  }

  function renderNews(items) {
    const root = document.querySelector("[data-news-list]");
    if (!root) return;

    root.replaceChildren(...items.map((item, index) => {
      const card = createElement("article", `news-card material-${(index % 3) + 1}`);
      card.append(
        createElement("time", "", item.date),
        createElement("h3", "", item.title),
        createElement("p", "", item.text)
      );
      return card;
    }));
  }

  function renderCommunity(community) {
    if (!community) return;

    setText("[data-community-title]", community.title || "加入玩家交流群");
    setText("[data-community-note]", community.note || "");
    setText("[data-qr-label]", community.qrLabel || "社群二维码");
    setText("[data-qr-note]", community.qrNote || "");

    const linksRoot = document.querySelector("[data-community-links]");
    if (linksRoot) {
      linksRoot.replaceChildren(...(community.links || []).map((item) => {
        const link = createElement("a", "", item.label);
        link.href = item.href || "#";
        return link;
      }));
    }

    const qrFrame = document.querySelector("[data-qr-frame]");
    if (qrFrame && community.qrImage) {
      const image = createElement("img");
      image.src = community.qrImage;
      image.alt = community.qrLabel || "社群二维码";
      qrFrame.replaceChildren(image);
      qrFrame.classList.add("has-image");
    }
  }

  function renderJoinSteps(items) {
    const root = document.querySelector("[data-join-steps]");
    if (!root) return;

    root.replaceChildren(...items.map((item) => {
      const step = createElement("li");
      step.append(createElement("strong", "", item.title), createElement("p", "", item.text));
      return step;
    }));
  }

  function renderFaq(items) {
    const root = document.querySelector("[data-faq-list]");
    if (!root) return;

    root.replaceChildren(...items.map((item) => {
      const faq = createElement("article", "faq-item");
      faq.append(createElement("h3", "", item.question), createElement("p", "", item.answer));
      return faq;
    }));
  }

  function showToast(message) {
    const toast = document.querySelector(selectors.toast);
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  // 方法一：Clipboard API（仅在 HTTPS 或 localhost 可用）
  function copyWithClipboardApi(text) {
    if (!navigator.clipboard || !window.isSecureContext) {
      return Promise.reject(new Error("Clipboard API unavailable"));
    }
    return navigator.clipboard.writeText(text);
  }

  // 方法二：execCommand 降级方案（HTTP 下生效，兼容移动端与 iOS）
  function copyWithExecCommand(text) {
    return new Promise((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      
      // 防止移动端页面跳动、拉起软键盘或在 iOS 上自动缩放
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "-9999px";
      textarea.style.opacity = "0";
      textarea.style.fontSize = "16px";
      textarea.setAttribute("readonly", "");
      document.body.appendChild(textarea);

      // 针对 iOS Safari 选区特殊处理
      if (navigator.userAgent.match(/ipad|iphone/i)) {
        const range = document.createRange();
        range.selectNodeContents(textarea);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        textarea.setSelectionRange(0, 999999);
      } else {
        textarea.select();
      }

      let success = false;
      try {
        success = document.execCommand("copy");
      } catch (error) {
        success = false;
      }

      textarea.remove();

      if (success) {
        resolve();
      } else {
        reject(new Error("execCommand copy failed"));
      }
    });
  }

  // 综合策略：依次尝试现代 API -> execCommand 降级
  async function copyText(text) {
    try {
      await copyWithClipboardApi(text);
      return true;
    } catch (e) {
      // 降级继续
    }

    try {
      await copyWithExecCommand(text);
      return true;
    } catch (e) {
      // 降级继续
    }

    return false;
  }

  async function copyServerAddress() {
    const address = data.serverAddress || "play.example.com";
    const ok = await copyText(address);

    if (ok) {
      showToast("服务器地址已复制");
    } else {
      // 终极兜底：弹窗让用户手动全选复制
      window.prompt("自动复制失败，请手动复制服务器地址：", address);
    }
  }

  function setupCopyButtons() {
    document.querySelectorAll("[data-copy-server]").forEach((button) => {
      button.addEventListener("click", copyServerAddress);
    });
  }

  function setupNavigation() {
    const header = document.querySelector(selectors.header);
    const nav = document.querySelector(selectors.nav);
    const toggle = document.querySelector(selectors.navToggle);

    if (!header || !nav || !toggle) return;

    const closeNav = () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const willOpen = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", willOpen);
      toggle.classList.toggle("is-open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        closeNav();
      }
    });

    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }, { passive: true });
  }

  function setupRevealAnimation() {
    const sections = document.querySelectorAll(selectors.reveal);

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    sections.forEach((section) => observer.observe(section));
  }

  function hydrateTemplate() {
    setText("[data-site-name]", data.siteName || "服务器名称");
    setText("[data-site-name-footer]", data.siteName || "服务器名称");
    setText("[data-hero-title]", data.heroTitle || "服务器名称");
    setText("[data-hero-lead]", data.heroLead || "");
    setText("[data-server-address]", data.serverAddress || "play.example.com");
    setText("[data-server-address-text]", data.serverAddress || "play.example.com");
    setText("[data-server-state]", data.serverState || "展示状态");
    setText("[data-online-count]", String(data.onlineCount ?? 0));
    setText("[data-max-count]", String(data.maxCount ?? 0));
    setText("[data-server-version]", data.serverVersion || "1.21.x");

    renderOverview(data.overview || []);
    renderFeatures(data.features || []);
    renderStats(data.stats || []);
    renderScenery(data.scenery || []);
    renderNews(data.news || []);
    renderJoinSteps(data.joinSteps || []);
    renderCommunity(data.community);
    renderFaq(data.faq || []);
  }

  function start() {
    hydrateTemplate();
    setupNavigation();
    setupCopyButtons();
    setupRevealAnimation();
  }

  document.addEventListener("DOMContentLoaded", start);
})();
