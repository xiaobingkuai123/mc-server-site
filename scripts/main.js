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

  // ==========================================
  // The Potato 实时服务器状态
  // Java + Geyser 共用同一份在线人数
  // ==========================================

  const SERVER_STATUS_API = "https://api.mcstatus.io/v2/status/java/";
  const JAVA_ADDRESSES = [
    "mc.the-potato.cn",
    "play.simpfun.cn:34314"
  ];
  const SERVER_STATUS_REFRESH_INTERVAL = 60 * 1000;

  async function fetchJavaStatus(address) {
    const url = SERVER_STATUS_API + encodeURIComponent(address);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json"
        },
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function updateServerStatus() {
    let result = null;
    let hadSuccessfulResponse = false;
    let lastError = null;

    // 优先查询带 SRV 的正式地址，失败或离线时尝试备用直连地址。
    for (const address of JAVA_ADDRESSES) {
      try {
        const status = await fetchJavaStatus(address);
        hadSuccessfulResponse = true;

        if (status.online) {
          result = status;
          break;
        }
      } catch (error) {
        lastError = error;
        console.warn(`[The Potato] 查询失败：${address}`, error);
      }
    }

    if (!result) {
      setText(
        "[data-server-state]",
        hadSuccessfulResponse ? "服务器离线" : "暂时无法获取服务器状态"
      );
      setText("[data-online-count]", "--");
      setText("[data-max-count]", "--");

      // 查询失败/离线时保留 site-data.js 中配置的版本备用值。
      if (lastError) {
        console.warn("[The Potato] 所有 Java 状态查询地址均未成功", lastError);
      }
      return;
    }

    // Java 与 Geyser Bedrock 玩家都在同一个 Java 服务端内，
    // 所以这里的 online/max 就是全服总人数，不再单独查询或相加 Bedrock 人数。
    setText("[data-server-state]", "服务器运行中");
    setText("[data-online-count]", String(result.players?.online ?? "--"));
    setText("[data-max-count]", String(result.players?.max ?? "--"));
    setText(
      "[data-server-version]",
      result.version?.name_clean ||
      result.version?.name_raw ||
      data.serverVersion ||
      "未知"
    );

    console.info("[The Potato] 服务器状态更新成功", {
      queriedAddress: result.host,
      port: result.port,
      online: result.players?.online,
      max: result.players?.max,
      version: result.version?.name_clean,
      srvRecord: result.srv_record
    });
  }

  function setupServerStatus() {
    // 没有首页状态卡片的页面不发起查询。
    if (!document.querySelector("[data-online-count]")) return;

    let timerId = null;
    let lastQueryTime = 0;
    let isQuerying = false;

    function clearScheduledQuery() {
      if (timerId !== null) {
        window.clearTimeout(timerId);
        timerId = null;
      }
    }

    function scheduleNextQuery() {
      clearScheduledQuery();

      if (document.hidden) return;

      const elapsed = Date.now() - lastQueryTime;
      const remaining = Math.max(0, SERVER_STATUS_REFRESH_INTERVAL - elapsed);

      timerId = window.setTimeout(runQuery, remaining);
    }

    async function runQuery() {
      clearScheduledQuery();

      if (document.hidden || isQuerying) return;

      // 以请求开始时间为基准，确保两次请求开始时间至少相隔 60 秒。
      const elapsed = Date.now() - lastQueryTime;
      if (lastQueryTime && elapsed < SERVER_STATUS_REFRESH_INTERVAL) {
        scheduleNextQuery();
        return;
      }

      isQuerying = true;
      lastQueryTime = Date.now();

      try {
        await updateServerStatus();
      } finally {
        isQuerying = false;

        // 页面仍可见时，安排下一次查询；隐藏时等待 visibilitychange。
        if (!document.hidden) {
          scheduleNextQuery();
        }
      }
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearScheduledQuery();
      } else {
        // 回到页面时：若距上次请求已满 60 秒则立即查询，
        // 否则只等待剩余时间。
        if (!lastQueryTime ||
            Date.now() - lastQueryTime >= SERVER_STATUS_REFRESH_INTERVAL) {
          runQuery();
        } else {
          scheduleNextQuery();
        }
      }
    });

    // 只有用户打开且页面可见时才开始第一次查询。
    if (!document.hidden) {
      runQuery();
    }
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
    setupServerStatus();
  }

  document.addEventListener("DOMContentLoaded", start);
})();
