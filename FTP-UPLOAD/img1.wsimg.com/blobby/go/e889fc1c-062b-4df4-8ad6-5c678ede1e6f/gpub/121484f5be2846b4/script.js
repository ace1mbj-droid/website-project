window.cxs && window.cxs.setOptions({ prefix: "c2-" });
window.wsb = window.wsb || {};
window.wsb["Theme13"] =
  window.wsb["Theme13"] ||
  window
    .radpack("@widget/LAYOUT/bs-layout13-Theme-publish-Theme")
    .then(function (t) {
      return new t.default();
    });
window.wsb["FreemiumAd"] = function (e) {
  let { adEndpoint: t, isPublish: a, containerId: o } = e;
  const r = 1e4,
    l = /<script[^>]*>([\s\S]*)<\/script>/;
  let n, i, c;
  function s(e) {
    e.preventDefault(), e.stopPropagation();
    const t = new CustomEvent("editor", {
      detail: { type: "showModal", modal: "plans", source: "freemiumAd" },
    });
    window.dispatchEvent(t);
  }
  function g(e) {
    if (((c = document.getElementById(o)), !c)) return;
    (n = document.createElement("div")),
      (n.style.cssText = "width:100%;"),
      c.prepend(n),
      (i = document.createElement("div")),
      i.setAttribute("data-freemium-ad", !0),
      (i.style.cssText = `overflow:hidden;width:100%;z-index:${r};position:fixed;left:0;`),
      (i.innerHTML = (e || "").replace(l, "")),
      c.prepend(i);
    const t = `${i.offsetHeight}px`;
    if (
      ((n.style.minHeight = t),
      window.requestAnimationFrame(() => {
        const e = document.querySelector("[data-stickynav]");
        e && "fixed" === e.style.position && (e.style.top = t);
      }),
      a)
    ) {
      const t = l.exec(e);
      if (t) {
        const e = document.createElement("script");
        e.appendChild(document.createTextNode(t[1])),
          document.head.appendChild(e);
      }
    } else i.addEventListener("click", s, { useCapture: !0 });
  }
  return (
    (function () {
      const e = (a && sessionStorage.getItem(t)) || "";
      e
        ? g(e)
        : window
            .fetch(t)
            .then((e) => e.ok && e.text())
            .then((e) => {
              e && (sessionStorage.setItem(t, e), g(e));
            })
            .catch(() => {});
    })(),
    function () {
      !a && i && i.removeEventListener("click", s, { useCapture: !0 }),
        c && (c.removeChild(n), c.removeChild(i));
    }
  );
};
window.wsb["FreemiumAd"](
  JSON.parse(
    '{"adEndpoint":"/markup/ad","isPublish":true,"containerId":"freemium-ad-10791"}'
  )
);
window.wsb["context-bs-1"] = JSON.parse(
  '{"env":"production","renderMode":"PUBLISH","fonts":["abril-fatface","helvetica",""],"colors":["#ffffff"],"locale":"en-US","language":"en","resellerId":1,"internalLinks":{"81c1306d-006f-468c-9984-0e7be55668b9":{"pageId":"7da90275-2b7e-44b0-9d4c-cfcaf7bf49a0","routePath":"/"}},"isInternalPage":true,"navigationMap":{"0f439c68-4c5f-44ae-91f5-e5178b1dd766":{"isFlyoutMenu":false,"active":false,"pageId":"0f439c68-4c5f-44ae-91f5-e5178b1dd766","name":"Our Journey","href":"/our-journey","target":"","visible":false,"isSectionLink":false,"requiresAuth":false,"tags":["HTML"],"rel":"","type":"page","showInFooter":false},"2e70feea-130c-4210-9ca4-12489cd58666":{"isFlyoutMenu":false,"active":false,"pageId":"2e70feea-130c-4210-9ca4-12489cd58666","name":"About Us","href":"/about-us","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["ABOUT"],"rel":"","type":"page","showInFooter":true},"6bd61cd7-07d9-4bfe-b38b-3f4ba36de799":{"isFlyoutMenu":false,"active":false,"pageId":"6bd61cd7-07d9-4bfe-b38b-3f4ba36de799","name":"404","href":"/404","target":"","visible":false,"requiresAuth":false,"tags":["404","INTRODUCTION"],"rel":"","type":"page","showInFooter":false},"7da90275-2b7e-44b0-9d4c-cfcaf7bf49a0":{"isFlyoutMenu":false,"active":false,"pageId":"7da90275-2b7e-44b0-9d4c-cfcaf7bf49a0","name":"Home","href":"/","target":"","visible":true,"requiresAuth":false,"tags":["CONTENT","INTRODUCTION","LOGOS","SOCIAL"],"rel":"","type":"page","showInFooter":false},"88201acd-80f5-4be9-a3b5-dba4b8926241":{"isFlyoutMenu":false,"active":false,"pageId":"88201acd-80f5-4be9-a3b5-dba4b8926241","name":"Contact Us","href":"/contact-us","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["CONTACT"],"rel":"","type":"page","showInFooter":true},"ac00ed26-f70a-447e-a9ae-58c847e89ece":{"isFlyoutMenu":false,"active":true,"pageId":"ac00ed26-f70a-447e-a9ae-58c847e89ece","name":"Ace Gallery","href":"/ace-gallery","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["HTML"],"rel":"","type":"page","showInFooter":true},"af8d1fbf-0f2b-4cf8-b81e-1cdc4a02b643":{"isFlyoutMenu":false,"active":false,"pageId":"af8d1fbf-0f2b-4cf8-b81e-1cdc4a02b643","name":"Our Products","href":"/our-products","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["CONTENT","LOGOS","MENU"],"rel":"","type":"page","showInFooter":true}},"dials":{"colors":[{"id":"#ffffff","meta":{"primary":"rgb(255, 255, 255)","accent":"rgb(17, 17, 17)","neutral":"rgb(255, 255, 255)"}}],"fonts":{"primary":{"id":"abril-fatface","description":"","tags":["serif","classic","conservative"],"meta":{"order":1,"primary":{"id":"abril-fatface","name":"Abril Fatface","url":"//fonts.googleapis.com/css?family=Abril+Fatface:400&display=swap","family":"\'Abril Fatface\', Georgia, serif","size":16,"weight":400,"weights":[400,700],"styles":{"letterSpacing":"2px"}},"alternate":{"id":"droid-sans","name":"Droid Sans","url":"//fonts.googleapis.com/css?family=Droid+Sans:300,400,700,800&display=swap","family":"\'Droid Sans\', arial, sans-serif","size":16,"weight":400,"weights":[300,400,700,800],"styles":{"letterSpacing":"normal","textTransform":"none"}}},"overridesAlternate":[{"locales":["ta-IN","mr-IN","hi-IN"],"meta":{"alternate":{"family":"Arial, sans-serif"}}}],"overridesPrimary":[{"locales":["vi-VN"],"meta":{"primary":{"family":"Georgia, serif"}}},{"locales":["ta-IN","mr-IN","hi-IN"],"meta":{"primary":{"family":"Georgia, serif"}}}]},"alternate":{"id":"helvetica","description":"","tags":[],"meta":{"order":6,"alternate":{"id":"helvetica","name":"Helvetica","url":"","family":"Helvetica, arial, sans-serif","size":16,"weight":400,"weights":[400,700],"styles":{"letterSpacing":"normal","textTransform":"none"}}}}}},"theme":"Theme13"}'
);
Core.utils.deferBootstrap(
  {
    elId: "bs-1",
    componentName: "@widget/LAYOUT/bs-Hamburger-Component",
    props: JSON.parse(
      '{"toggleId":"n-10790-navId-mobile","uniqueId":"n-10790","style":{"color":"highContrast",":hover":{"color":"highlight"},"@md":{"display":"none"}},"widgetId":"4b7f16d7-6066-4948-8f8c-2acbcf355f2f","section":"default","category":"primary","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
    ),
    context: JSON.parse(
      '{"widgetId":"4b7f16d7-6066-4948-8f8c-2acbcf355f2f","widgetType":"HEADER","widgetPreset":"header9","group":"Section","groupType":"Default","section":"default","category":"primary","fontSize":"medium","fontFamily":"alternate","websiteThemeOverrides":{"ButtonPrimary":{"value":{"color":"HIGHCONTRAST"}},"ButtonSpotlight":{"value":{"color":"HIGHCONTRAST"}},"ButtonSecondary":{"value":{"color":"HIGHCONTRAST"}},"HeadingDelta":{"byType":{"MenuHeading":{"value":{"typography":"HeadingDelta","style":{}}}}}},"widgetThemeOverrides":{"Widget":{"value":{"colors":["#ffffff"]}},"HeroSubTagline":{"value":{"fullWidth":false}},"BodyBeta":{"byType":{"HeroSubTagline":{"value":{"fontScaleMultiplier":0.88}}}},"HeadingAlpha":{"byType":{"HeroTagline":{"value":{"typography":"HeadingAlpha","featured":null,"style":{"fontSize":"xxxlarge","color":null," *":null},"fullWidth":false}}}}}}'
    ),
    contextKey: "context-bs-1",
    radpack: "@widget/LAYOUT/bs-Hamburger-Component",
  },
  false
);
Core.utils.deferBootstrap(
  {
    elId: "bs-2",
    componentName: "@widget/LAYOUT/bs-LinkAwareComponent",
    props: JSON.parse(
      '{"toggleId":"more-10799","label":"More","dataAid":"NAV_MORE","navBarId":"navBarId-10796","parentId":"nav-10798","widgetId":"4b7f16d7-6066-4948-8f8c-2acbcf355f2f","section":"default","category":"primary","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
    ),
    context: JSON.parse(
      '{"widgetId":"4b7f16d7-6066-4948-8f8c-2acbcf355f2f","widgetType":"HEADER","widgetPreset":"header9","group":"Nav","groupType":"Default","section":"default","category":"primary","fontSize":"medium","fontFamily":"alternate","websiteThemeOverrides":{"ButtonPrimary":{"value":{"color":"HIGHCONTRAST"}},"ButtonSpotlight":{"value":{"color":"HIGHCONTRAST"}},"ButtonSecondary":{"value":{"color":"HIGHCONTRAST"}},"HeadingDelta":{"byType":{"MenuHeading":{"value":{"typography":"HeadingDelta","style":{}}}}}},"widgetThemeOverrides":{"Widget":{"value":{"colors":["#ffffff"]}},"HeroSubTagline":{"value":{"fullWidth":false}},"BodyBeta":{"byType":{"HeroSubTagline":{"value":{"fontScaleMultiplier":0.88}}}},"HeadingAlpha":{"byType":{"HeroTagline":{"value":{"typography":"HeadingAlpha","featured":null,"style":{"fontSize":"xxxlarge","color":null," *":null},"fullWidth":false}}}}}}'
    ),
    contextKey: "context-bs-1",
    radpack: "@widget/LAYOUT/bs-LinkAwareComponent",
  },
  false
);
window.wsb["CalculateNavSpacing"] = function (e) {
  let {
    containerId: a,
    navId: n,
    logoImageId: i,
    inlineUtilitiesMenu: l,
    forceBreakpoint: o,
  } = e;
  let r, c, s, g, p, d, u;
  const y = document.getElementById(n);
  function m() {
    if (c || !y || !R(y)) return;
    (s = Array.from(y.children)),
      s.forEach(f),
      l && ((g = s.pop()), w(g)),
      (p = s.pop());
    const e = p.querySelector("ul");
    (d = e ? Array.from(e.children) : []),
      (y.style.whiteSpace = "normal"),
      (u = R(y.parentElement, "floor")),
      (y.style.whiteSpace = "nowrap"),
      window.requestAnimationFrame(v);
  }
  function v() {
    const e = s.map((e) => R(e));
    const t = g ? R(g) : 0,
      a = u - t;
    if (E(e) > a) {
      const t = R(p);
      for (let n = E(e); n + t > a; n -= e.pop());
      const n = e.length;
      I(s, 0, n, w),
        I(d, 0, n, h),
        I(s, n, s.length, h),
        I(d, n, s.length, w),
        w(p);
    } else s.forEach(w), h(p);
    window.dispatchEvent(new Event("NavItemsResized"));
  }
  function b() {
    (window.innerWidth < 1024 && o && o !== t.$) ||
      (window.clearTimeout(r), (r = window.setTimeout(m, 50)));
  }
  function I(e, t, a, n) {
    e = e.slice(t, a).map(n).concat(e.slice(a));
  }
  function f(e) {
    (e.style.visibility = "hidden"),
      (e.style.display = ""),
      e.classList.remove("visible");
  }
  function h(e) {
    (e.style.display = "none"), e.classList.remove("visible");
  }
  function w(e) {
    (e.style.visibility = "visible"),
      (e.style.display = ""),
      e.classList.add("visible");
  }
  function E(e) {
    return e.reduce((e, t) => e + t, 0);
  }
  function R(e) {
    return "ceil" ===
      (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "ceil")
      ? Math.ceil(e.getBoundingClientRect().width)
      : Math.floor(e.getBoundingClientRect().width);
  }
  if ((b(), window.ResizeObserver)) {
    const e = new window.ResizeObserver(b);
    return (
      [document.getElementById(a), document.getElementById(i)].forEach(
        (t) => t && e.observe(t)
      ),
      () => {
        (c = !0), e.disconnect();
      }
    );
  }
  return (
    window.addEventListener("resize", b, { passive: !0 }),
    () => {
      (c = !0), window.removeEventListener("resize", b, { passive: !0 });
    }
  );
};
window.wsb["CalculateNavSpacing"](
  JSON.parse(
    '{"navId":"nav-10798","logoImageId":"logo-10795","containerId":"navBarId-10796"}'
  )
);
window.wsb["context-bs-3"] = JSON.parse(
  '{"env":"production","renderMode":"PUBLISH","fonts":["abril-fatface","helvetica",""],"colors":["#ffffff"],"fontScale":"medium","locale":"en-US","language":"en","resellerId":1,"internalLinks":{"81c1306d-006f-468c-9984-0e7be55668b9":{"pageId":"7da90275-2b7e-44b0-9d4c-cfcaf7bf49a0","routePath":"/"}},"isInternalPage":true,"navigationMap":{"0f439c68-4c5f-44ae-91f5-e5178b1dd766":{"isFlyoutMenu":false,"active":false,"pageId":"0f439c68-4c5f-44ae-91f5-e5178b1dd766","name":"Our Journey","href":"/our-journey","target":"","visible":false,"isSectionLink":false,"requiresAuth":false,"tags":["HTML"],"rel":"","type":"page","showInFooter":false},"2e70feea-130c-4210-9ca4-12489cd58666":{"isFlyoutMenu":false,"active":false,"pageId":"2e70feea-130c-4210-9ca4-12489cd58666","name":"About Us","href":"/about-us","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["ABOUT"],"rel":"","type":"page","showInFooter":true},"6bd61cd7-07d9-4bfe-b38b-3f4ba36de799":{"isFlyoutMenu":false,"active":false,"pageId":"6bd61cd7-07d9-4bfe-b38b-3f4ba36de799","name":"404","href":"/404","target":"","visible":false,"requiresAuth":false,"tags":["404","INTRODUCTION"],"rel":"","type":"page","showInFooter":false},"7da90275-2b7e-44b0-9d4c-cfcaf7bf49a0":{"isFlyoutMenu":false,"active":false,"pageId":"7da90275-2b7e-44b0-9d4c-cfcaf7bf49a0","name":"Home","href":"/","target":"","visible":true,"requiresAuth":false,"tags":["CONTENT","INTRODUCTION","LOGOS","SOCIAL"],"rel":"","type":"page","showInFooter":false},"88201acd-80f5-4be9-a3b5-dba4b8926241":{"isFlyoutMenu":false,"active":false,"pageId":"88201acd-80f5-4be9-a3b5-dba4b8926241","name":"Contact Us","href":"/contact-us","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["CONTACT"],"rel":"","type":"page","showInFooter":true},"ac00ed26-f70a-447e-a9ae-58c847e89ece":{"isFlyoutMenu":false,"active":true,"pageId":"ac00ed26-f70a-447e-a9ae-58c847e89ece","name":"Ace Gallery","href":"/ace-gallery","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["HTML"],"rel":"","type":"page","showInFooter":true},"af8d1fbf-0f2b-4cf8-b81e-1cdc4a02b643":{"isFlyoutMenu":false,"active":false,"pageId":"af8d1fbf-0f2b-4cf8-b81e-1cdc4a02b643","name":"Our Products","href":"/our-products","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["CONTENT","LOGOS","MENU"],"rel":"","type":"page","showInFooter":true}},"dials":{"colors":[{"id":"#ffffff","meta":{"primary":"rgb(255, 255, 255)","accent":"rgb(17, 17, 17)","neutral":"rgb(255, 255, 255)"}}],"fonts":{"primary":{"id":"abril-fatface","description":"","tags":["serif","classic","conservative"],"meta":{"order":1,"primary":{"id":"abril-fatface","name":"Abril Fatface","url":"//fonts.googleapis.com/css?family=Abril+Fatface:400&display=swap","family":"\'Abril Fatface\', Georgia, serif","size":16,"weight":400,"weights":[400,700],"styles":{"letterSpacing":"2px"}},"alternate":{"id":"droid-sans","name":"Droid Sans","url":"//fonts.googleapis.com/css?family=Droid+Sans:300,400,700,800&display=swap","family":"\'Droid Sans\', arial, sans-serif","size":16,"weight":400,"weights":[300,400,700,800],"styles":{"letterSpacing":"normal","textTransform":"none"}}},"overridesAlternate":[{"locales":["ta-IN","mr-IN","hi-IN"],"meta":{"alternate":{"family":"Arial, sans-serif"}}}],"overridesPrimary":[{"locales":["vi-VN"],"meta":{"primary":{"family":"Georgia, serif"}}},{"locales":["ta-IN","mr-IN","hi-IN"],"meta":{"primary":{"family":"Georgia, serif"}}}]},"alternate":{"id":"helvetica","description":"","tags":[],"meta":{"order":6,"alternate":{"id":"helvetica","name":"Helvetica","url":"","family":"Helvetica, arial, sans-serif","size":16,"weight":400,"weights":[400,700],"styles":{"letterSpacing":"normal","textTransform":"none"}}}}}},"theme":"Theme13"}'
);
Core.utils.deferBootstrap(
  {
    elId: "bs-3",
    componentName: "@widget/HTML/bs-Component",
    props: JSON.parse(
      '{"data-aid":"AUTOIFRAME_RENDERED","centerContent":true,"htmlSrc":"<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n    <meta charset=\\"UTF-8\\" />\\n    <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\" />\\n    <title>YouTube Video Embed</title>\\n</head>\\n<body>\\n\\n\\n\\n\u003C!-- Replace VIDEO_ID with the actual YouTube video ID -->\\n<iframe width=\\"800\\" height=\\"400\\" \\n    src=\\"https://www.youtube.com/embed/QvilrHBjBLw?si=_P6W5IDeXmC9X8TT\\" \\n    frameborder=\\"0\\" \\n    allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\" \\n    allowfullscreen>\\n</iframe>\\n\\n</body>\\n</html>\\n","order":0,"widgetId":"2d0bcef6-323c-4518-8aec-6c75e02a9f10","section":"default","category":"primary","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
    ),
    context: JSON.parse(
      '{"widgetId":"2d0bcef6-323c-4518-8aec-6c75e02a9f10","widgetType":"HTML","widgetPreset":"html1","group":"Section","groupType":"Default","section":"default","category":"primary","fontSize":"medium","fontFamily":"alternate","websiteThemeOverrides":{"ButtonPrimary":{"value":{"color":"HIGHCONTRAST"}},"ButtonSpotlight":{"value":{"color":"HIGHCONTRAST"}},"ButtonSecondary":{"value":{"color":"HIGHCONTRAST"}},"HeadingDelta":{"byType":{"MenuHeading":{"value":{"typography":"HeadingDelta","style":{}}}}}},"widgetThemeOverrides":{"Widget":{"value":{"colors":["#ffffff"]}}}}'
    ),
    contextKey: "context-bs-3",
    radpack: "@widget/HTML/bs-Component",
  },
  false
);
Core.utils.deferBootstrap(
  {
    elId: "bs-4",
    componentName: "@widget/HTML/bs-Component",
    props: JSON.parse(
      '{"data-aid":"AUTOIFRAME_RENDERED","centerContent":true,"htmlSrc":"<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n    <meta charset=\\"UTF-8\\" />\\n    <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\" />\\n    <title>YouTube Video Embed</title>\\n</head>\\n<body>\\n\\n\\n\\n\u003C!-- Replace VIDEO_ID with the actual YouTube video ID -->\\n<iframe width=\\"800\\" height=\\"400\\" \\n    src=\\"https://www.youtube.com/embed/O2cYQ-KZxbE?si=XRxnqYqFQC2IRcNh\\" \\n    frameborder=\\"0\\" \\n    allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\" \\n    allowfullscreen>\\n</iframe>\\n\\n</body>\\n</html>\\n","widgetId":"90f8db3d-4ed3-4061-96c3-bab93416bb12","section":"alt","category":"primary","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
    ),
    context: JSON.parse(
      '{"order":1,"widgetId":"90f8db3d-4ed3-4061-96c3-bab93416bb12","widgetType":"HTML","widgetPreset":"html1","group":"Section","groupType":"Default","section":"alt","category":"primary","fontSize":"medium","fontFamily":"alternate","websiteThemeOverrides":{"ButtonPrimary":{"value":{"color":"HIGHCONTRAST"}},"ButtonSpotlight":{"value":{"color":"HIGHCONTRAST"}},"ButtonSecondary":{"value":{"color":"HIGHCONTRAST"}},"HeadingDelta":{"byType":{"MenuHeading":{"value":{"typography":"HeadingDelta","style":{}}}}}},"widgetThemeOverrides":{"Widget":{"value":{"colors":["#ffffff"]}}}}'
    ),
    contextKey: "context-bs-3",
    radpack: "@widget/HTML/bs-Component",
  },
  false
);
Core.utils.deferBootstrap(
  {
    elId: "bs-5",
    componentName: "@widget/HTML/bs-Component",
    props: JSON.parse(
      '{"data-aid":"AUTOIFRAME_RENDERED","centerContent":true,"htmlSrc":"\u003C!-- Ace Lightbox Gallery (Drive-friendly with fallbacks) -->\\n<section id=\\"ace-lightbox-gallery\\">\\n  <style>\\n    /* Thumbnail grid */\\n    #ace-lightbox-gallery .grid {\\n      display: grid;\\n      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));\\n      gap: 16px;\\n      max-width: 1100px;\\n      margin: 0 auto;\\n    }\\n    #ace-lightbox-gallery .thumb {\\n      position: relative; overflow: hidden; border-radius: 10px; cursor: pointer;\\n      box-shadow: 0 6px 12px rgba(0,0,0,0.15);\\n      background: #111;\\n    }\\n    #ace-lightbox-gallery .thumb img {\\n      width: 100%; height: 180px; object-fit: cover; display: block;\\n      transition: transform .3s ease;\\n    }\\n    #ace-lightbox-gallery .thumb:hover img { transform: scale(1.06); }\\n    @media (max-width: 768px) { #ace-lightbox-gallery .thumb img { height: 150px; } }\\n\\n    /* Lightbox overlay */\\n    #ace-lightbox-gallery .overlay {\\n      position: fixed; inset: 0; display: none; place-items: center;\\n      background: rgba(0,0,0,0.9); z-index: 9999;\\n    }\\n    #ace-lightbox-gallery .overlay.open { display: grid; }\\n    #ace-lightbox-gallery .stage {\\n      position: relative; max-width: 92vw; max-height: 85vh; display: grid; place-items: center;\\n    }\\n    #ace-lightbox-gallery .stage img {\\n      max-width: 92vw; max-height: 80vh; object-fit: contain; display: block;\\n      box-shadow: 0 8px 28px rgba(0,0,0,0.5); border-radius: 6px; background:#111;\\n    }\\n\\n    /* Controls */\\n    #ace-lightbox-gallery .ctrl {\\n      position: absolute; top: 50%; transform: translateY(-50%);\\n      width: 44px; height: 44px; border-radius: 999px; border: 0;\\n      display: grid; place-items: center; color: #fff; cursor: pointer;\\n      background: rgba(0,0,0,0.45);\\n    }\\n    #ace-lightbox-gallery .ctrl:hover { background: rgba(0,0,0,0.7); }\\n    #ace-lightbox-gallery .prev { left: -56px; }\\n    #ace-lightbox-gallery .next { right: -56px; }\\n    @media (max-width: 768px) {\\n      #ace-lightbox-gallery .prev { left: 8px; }\\n      #ace-lightbox-gallery .next { right: 8px; }\\n    }\\n    #ace-lightbox-gallery .close {\\n      position: absolute; top: -52px; right: 0; width: 40px; height: 40px;\\n      border-radius: 999px; border: 0; background: rgba(0,0,0,0.6); color: #fff; cursor: pointer;\\n    }\\n    @media (max-width: 768px) { #ace-lightbox-gallery .close { top: 8px; right: 8px; } }\\n\\n    /* Dots */\\n    #ace-lightbox-gallery .dots {\\n      display: flex; gap: 8px; justify-content: center; margin-top: 12px; flex-wrap: wrap;\\n    }\\n    #ace-lightbox-gallery .dot {\\n      width: 10px; height: 10px; border-radius: 50%; background: #888; border: 0; cursor: pointer;\\n    }\\n    #ace-lightbox-gallery .dot.active { background: #fff; }\\n  </style>\\n\\n  \u003C!-- Thumbnails (use Drive thumbnail endpoint) -->\\n  <div class=\\"grid\\" aria-label=\\"Photo gallery thumbnails\\">\\n    <div class=\\"thumb\\" data-id=\\"1XN5CDgGPtJV7AWsfKUK41dl3Xl6CKLtk\\" data-alt=\\"Image 2\\" data-index=\\"0\\">\\n      <img loading=\\"lazy\\" alt=\\"Image 2\\" src=\\"https://drive.google.com/thumbnail?id=1XN5CDgGPtJV7AWsfKUK41dl3Xl6CKLtk&sz=w600\\">\\n    </div>\\n    <div class=\\"thumb\\" data-id=\\"1kGuvOq5CsnUsJeZmbDl7PhFWywD_aPdJ\\" data-alt=\\"Image 3\\" data-index=\\"1\\">\\n      <img loading=\\"lazy\\" alt=\\"Image 3\\" src=\\"https://drive.google.com/thumbnail?id=1kGuvOq5CsnUsJeZmbDl7PhFWywD_aPdJ&sz=w600\\">\\n    </div>\\n    <div class=\\"thumb\\" data-id=\\"1KwkbQg1WegVJYaiB86G6-xfDBwr3_iAV\\" data-alt=\\"Image 4\\" data-index=\\"2\\">\\n      <img loading=\\"lazy\\" alt=\\"Image 4\\" src=\\"https://drive.google.com/thumbnail?id=1KwkbQg1WegVJYaiB86G6-xfDBwr3_iAV&sz=w600\\">\\n    </div>\\n    <div class=\\"thumb\\" data-id=\\"1XKXsZtlEUwFsvUyb5k9lV6dm3X9I5giT\\" data-alt=\\"Image 5\\" data-index=\\"3\\">\\n      <img loading=\\"lazy\\" alt=\\"Image 5\\" src=\\"https://drive.google.com/thumbnail?id=1XKXsZtlEUwFsvUyb5k9lV6dm3X9I5giT&sz=w600\\">\\n    </div>\\n    <div class=\\"thumb\\" data-id=\\"16sEEQaog8X8NJIV85rSCR13gMD1DoHzR\\" data-alt=\\"Image 6\\" data-index=\\"4\\">\\n      <img loading=\\"lazy\\" alt=\\"Image 6\\" src=\\"https://drive.google.com/thumbnail?id=16sEEQaog8X8NJIV85rSCR13gMD1DoHzR&sz=w600\\">\\n    </div>\\n    <div class=\\"thumb\\" data-id=\\"1wzcLVGFG7eO5oUZrSS8T-AUAbfkuCAlV\\" data-alt=\\"Image 7\\" data-index=\\"5\\">\\n      <img loading=\\"lazy\\" alt=\\"Image 7\\" src=\\"https://drive.google.com/thumbnail?id=1wzcLVGFG7eO5oUZrSS8T-AUAbfkuCAlV&sz=w600\\">\\n    </div>\\n    <div class=\\"thumb\\" data-id=\\"1NkVozP7-FhnD4Xdub2D5O59ZxChIFLLw\\" data-alt=\\"Image 8\\" data-index=\\"6\\">\\n      <img loading=\\"lazy\\" alt=\\"Image 8\\" src=\\"https://drive.google.com/thumbnail?id=1NkVozP7-FhnD4Xdub2D5O59ZxChIFLLw&sz=w600\\">\\n    </div>\\n    <div class=\\"thumb\\" data-id=\\"1lQLAeB62OhWMpMWsTmwOLBrgpi_I85Oy\\" data-alt=\\"Image 9\\" data-index=\\"7\\">\\n      <img loading=\\"lazy\\" alt=\\"Image 9\\" src=\\"https://drive.google.com/thumbnail?id=1lQLAeB62OhWMpMWsTmwOLBrgpi_I85Oy&sz=w600\\">\\n    </div>\\n    <div class=\\"thumb\\" data-id=\\"18gZWbyryWspzlRA4rRghGxhr6NOjy_L_\\" data-alt=\\"Image 10\\" data-index=\\"8\\">\\n      <img loading=\\"lazy\\" alt=\\"Image 10\\" src=\\"https://drive.google.com/thumbnail?id=18gZWbyryWspzlRA4rRghGxhr6NOjy_L_&sz=w600\\">\\n    </div>\\n    <div class=\\"thumb\\" data-id=\\"1thjdmSwe7clQaxwS9zAug7Tf5opvXpv0\\" data-alt=\\"Image 11\\" data-index=\\"9\\">\\n      <img loading=\\"lazy\\" alt=\\"Image 11\\" src=\\"https://drive.google.com/thumbnail?id=1thjdmSwe7clQaxwS9zAug7Tf5opvXpv0&sz=w600\\">\\n    </div>\\n    <div class=\\"thumb\\" data-id=\\"1rVAdMd6-U-Ya-w2zSfm29cMNXPeZiYNC\\" data-alt=\\"Image 12\\" data-index=\\"10\\">\\n      <img loading=\\"lazy\\" alt=\\"Image 12\\" src=\\"https://drive.google.com/thumbnail?id=1rVAdMd6-U-Ya-w2zSfm29cMNXPeZiYNC&sz=w600\\">\\n    </div>\\n  </div>\\n\\n  \u003C!-- Lightbox Overlay -->\\n  <div class=\\"overlay\\" role=\\"dialog\\" aria-modal=\\"true\\" aria-label=\\"Image viewer\\">\\n    <div class=\\"stage\\">\\n      <button class=\\"close\\" aria-label=\\"Close\\">\u2715</button>\\n      <button class=\\"ctrl prev\\" aria-label=\\"Previous\\">\u276E</button>\\n      <img alt=\\"\\" src=\\"\\" />\\n      <button class=\\"ctrl next\\" aria-label=\\"Next\\">\u276F</button>\\n    </div>\\n    <div class=\\"dots\\" aria-label=\\"Slideshow pagination\\"></div>\\n  </div>\\n\\n  <script>\\n    (function () {\\n      var root = document.getElementById(\'ace-lightbox-gallery\');\\n      var thumbs = Array.from(root.querySelectorAll(\'.thumb\'));\\n      var overlay = root.querySelector(\'.overlay\');\\n      var stageImg = root.querySelector(\'.stage img\');\\n      var closeBtn = root.querySelector(\'.close\');\\n      var prevBtn = root.querySelector(\'.prev\');\\n      var nextBtn = root.querySelector(\'.next\');\\n      var dotsCtr = root.querySelector(\'.dots\');\\n      var active = -1;\\n\\n      // Build model\\n      var items = thumbs.map(function (t) {\\n        return { id: t.getAttribute(\'data-id\'), alt: t.getAttribute(\'data-alt\') || \'\' };\\n      });\\n\\n      // Build dots\\n      items.forEach(function (_, idx) {\\n        var b = document.createElement(\'button\');\\n        b.className = \'dot\' + (idx === 0 ? \' active\' : \'\');\\n        b.setAttribute(\'aria-label\', \'Go to image \' + (idx + 1));\\n        b.addEventListener(\'click\', function () { show(idx); });\\n        dotsCtr.appendChild(b);\\n      });\\n      var dots = Array.from(root.querySelectorAll(\'.dot\'));\\n\\n      // URL builders (with fallbacks)\\n      function urlPrimary(id, size) {\\n        return \'https://drive.google.com/thumbnail?id=\' + id + \'&sz=w\' + (size || 2000);\\n      }\\n      function urlFallback1(id) {\\n        return \'https://drive.google.com/uc?export=view&id=\' + id;\\n      }\\n      function urlFallback2(id) {\\n        // Note: not officially documented, but often works for public images\\n        return \'https://lh3.googleusercontent.com/d/\' + id + \'=w2000\';\\n      }\\n\\n      // Set image with fallbacks\\n      function setWithFallback(img, id) {\\n        var tried = 0;\\n        var urls = [urlPrimary(id), urlFallback1(id), urlFallback2(id)];\\n        img.onerror = function () {\\n          tried++;\\n          if (tried < urls.length) {\\n            img.src = urls[tried];\\n          } else {\\n            // Give a minimal inline error indicator\\n            img.onerror = null;\\n            img.alt = \'Failed to load image\';\\n            img.src = \'\';\\n          }\\n        };\\n        img.src = urls[0];\\n      }\\n\\n      function show(n) {\\n        active = (n + items.length) % items.length;\\n        setWithFallback(stageImg, items[active].id);\\n        stageImg.alt = items[active].alt || (\'Image \' + (active + 1));\\n        dots.forEach(function (d) { d.classList.remove(\'active\'); });\\n        dots[active].classList.add(\'active\');\\n      }\\n\\n      function openAt(n) {\\n        overlay.classList.add(\'open\');\\n        show(n);\\n        document.documentElement.style.overflow = \'hidden\';\\n        document.body.style.overflow = \'hidden\';\\n      }\\n      function close() {\\n        overlay.classList.remove(\'open\');\\n        stageImg.src = \'\';\\n        document.documentElement.style.overflow = \'\';\\n        document.body.style.overflow = \'\';\\n      }\\n      function next() { show(active + 1); }\\n      function prev() { show(active - 1); }\\n\\n      thumbs.forEach(function (t, idx) { t.addEventListener(\'click\', function () { openAt(idx); }); });\\n      closeBtn.addEventListener(\'click\', close);\\n      nextBtn.addEventListener(\'click\', next);\\n      prevBtn.addEventListener(\'click\', prev);\\n\\n      // click outside image closes\\n      overlay.addEventListener(\'click\', function (e) {\\n        var stage = root.querySelector(\'.stage\');\\n        if (!stage.contains(e.target)) close();\\n      });\\n\\n      // Keyboard controls\\n      document.addEventListener(\'keydown\', function (e) {\\n        if (!overlay.classList.contains(\'open\')) return;\\n        if (e.key === \'Escape\') close();\\n        if (e.key === \'ArrowRight\') next();\\n        if (e.key === \'ArrowLeft\') prev();\\n      });\\n    })();\\n  <$script>\\n</section>","widgetId":"5ce1f479-b085-4626-b9d0-f2b08b6781ec","section":"default","category":"neutral","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
    ),
    context: JSON.parse(
      '{"order":2,"widgetId":"5ce1f479-b085-4626-b9d0-f2b08b6781ec","widgetType":"HTML","widgetPreset":"html1","group":"Section","groupType":"Default","section":"default","category":"neutral","fontSize":"medium","fontFamily":"alternate","websiteThemeOverrides":{"ButtonPrimary":{"value":{"color":"HIGHCONTRAST"}},"ButtonSpotlight":{"value":{"color":"HIGHCONTRAST"}},"ButtonSecondary":{"value":{"color":"HIGHCONTRAST"}},"HeadingDelta":{"byType":{"MenuHeading":{"value":{"typography":"HeadingDelta","style":{}}}}}},"widgetThemeOverrides":{}}'
    ),
    contextKey: "context-bs-3",
    radpack: "@widget/HTML/bs-Component",
  },
  false
);
Core.utils.deferBootstrap(
  {
    elId: "bs-6",
    componentName: "@widget/HTML/bs-Component",
    props: JSON.parse(
      '{"data-aid":"AUTOIFRAME_RENDERED","centerContent":true,"htmlSrc":"<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n    <meta charset=\\"UTF-8\\" />\\n    <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\" />\\n    <title>YouTube Video Embed</title>\\n</head>\\n<body>\\n\\n\\n\u003C!-- Replace VIDEO_ID with the actual YouTube video ID -->\\n<iframe width=\\"800\\" height=\\"400\\" \\n    src=\\"https://www.youtube.com/embed/DRD0WSg7vIc?si=P-Cb6ARi3YbzHOlB\\" \\n    frameborder=\\"0\\" \\n    allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\" \\n    allowfullscreen>\\n</iframe>\\n\\n</body>\\n</html>\\n","iframeHeight":"","widgetId":"e9733373-3c94-4d62-9e5d-43f4b1ce9aa6","section":"alt","category":"primary","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
    ),
    context: JSON.parse(
      '{"order":3,"widgetId":"e9733373-3c94-4d62-9e5d-43f4b1ce9aa6","widgetType":"HTML","widgetPreset":"html1","group":"Section","groupType":"Default","section":"alt","category":"primary","fontSize":"medium","fontFamily":"alternate","websiteThemeOverrides":{"ButtonPrimary":{"value":{"color":"HIGHCONTRAST"}},"ButtonSpotlight":{"value":{"color":"HIGHCONTRAST"}},"ButtonSecondary":{"value":{"color":"HIGHCONTRAST"}},"HeadingDelta":{"byType":{"MenuHeading":{"value":{"typography":"HeadingDelta","style":{}}}}}},"widgetThemeOverrides":{"Widget":{"value":{"colors":["#ffffff"]}}}}'
    ),
    contextKey: "context-bs-3",
    radpack: "@widget/HTML/bs-Component",
  },
  false
);
Core.utils.deferBootstrap(
  {
    elId: "bs-7",
    componentName: "@widget/HTML/bs-Component",
    props: JSON.parse(
      "{\"data-aid\":\"AUTOIFRAME_RENDERED\",\"htmlSrc\":\"\u003C!-- Modern Thumbnail Gallery + In-Page Preview (no external links) -->\\n<section id=\\\"dg-six-modern\\\">\\n  <style>\\n    /* Layout */\\n    #dg-six-modern { max-width: 1200px; margin: 0 auto; padding: 8px; }\\n\\n    /* Responsive Masonry-like Grid */\\n    #dg-six-modern .grid {\\n      display: grid;\\n      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));\\n      gap: 18px;\\n    }\\n\\n    /* Card */\\n    #dg-six-modern .card {\\n      position: relative; overflow: hidden; border-radius: 14px;\\n      background: #0f0f0f; box-shadow: 0 12px 24px rgba(0,0,0,.18);\\n      isolation: isolate; cursor: zoom-in;\\n    }\\n    #dg-six-modern .card::after {\\n      content: \\\"\\\"; position: absolute; inset: 0; z-index: 1;\\n      background: linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,.45));\\n      opacity: 0; transition: opacity .25s ease;\\n    }\\n    #dg-six-modern .card:hover::after { opacity: 1; }\\n    #dg-six-modern .card img {\\n      width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block;\\n      transform: scale(1); transition: transform .35s ease;\\n      background: #111;\\n    }\\n    #dg-six-modern .card:hover img { transform: scale(1.06); }\\n    #dg-six-modern .badge {\\n      position: absolute; bottom: 10px; left: 10px; z-index: 2;\\n      padding: 6px 10px; font: 500 12px/1.1 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;\\n      color: #fff; border-radius: 999px; backdrop-filter: blur(6px);\\n      background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2);\\n      opacity: 0; transform: translateY(6px); transition: all .25s ease;\\n    }\\n    #dg-six-modern .card:hover .badge { opacity: 1; transform: translateY(0); }\\n\\n    /* Preview Overlay */\\n    #dg-six-modern .overlay {\\n      position: fixed; inset: 0; display: none; place-items: center;\\n      background: rgba(0,0,0,.85); z-index: 9999;\\n      backdrop-filter: blur(2px);\\n    }\\n    #dg-six-modern .overlay.open { display: grid; }\\n\\n    #dg-six-modern .stage {\\n      position: relative; width: min(92vw, 1100px); max-height: 86vh;\\n      display: grid; grid-template-rows: 1fr auto; gap: 12px;\\n    }\\n    #dg-six-modern .stage-viewport {\\n      position: relative; display: grid; place-items: center; overflow: hidden; border-radius: 12px;\\n      background: #0b0b0b; box-shadow: 0 10px 30px rgba(0,0,0,.4);\\n    }\\n    #dg-six-modern .stage-viewport img {\\n      max-width: 100%; max-height: 78vh; object-fit: contain; display: block; background: #111;\\n      opacity: 0; transform: scale(.985); transition: opacity .25s ease, transform .25s ease;\\n    }\\n    #dg-six-modern .stage-viewport img.loaded { opacity: 1; transform: scale(1); }\\n\\n    /* Overlay controls */\\n    #dg-six-modern .ctrl {\\n      position: absolute; top: 50%; transform: translateY(-50%);\\n      width: 46px; height: 46px; border-radius: 999px; border: 0; color: #fff; cursor: pointer;\\n      display: grid; place-items: center; background: rgba(0,0,0,.45);\\n    }\\n    #dg-six-modern .ctrl:hover { background: rgba(0,0,0,.7); }\\n    #dg-six-modern .prev { left: 10px; }  #dg-six-modern .next { right: 10px; }\\n\\n    #dg-six-modern .close {\\n      position: absolute; top: 10px; right: 10px; width: 40px; height: 40px;\\n      border-radius: 999px; border: 0; background: rgba(0,0,0,.55); color: #fff;\\n      cursor: pointer;\\n    }\\n\\n    /* Filmstrip thumbnails in overlay */\\n    #dg-six-modern .strip {\\n      display: grid; grid-auto-flow: column; grid-auto-columns: minmax(80px, 1fr);\\n      gap: 10px; overflow-x: auto; padding: 6px; border-radius: 10px;\\n      background: rgba(255,255,255,.05); scrollbar-width: thin;\\n    }\\n    #dg-six-modern .strip::-webkit-scrollbar { height: 8px; }\\n    #dg-six-modern .strip::-webkit-scrollbar-thumb { background: rgba(255,255,255,.2); border-radius: 8px; }\\n    #dg-six-modern .thumb {\\n      position: relative; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2px solid transparent;\\n    }\\n    #dg-six-modern .thumb.active { border-color: #fff; }\\n    #dg-six-modern .thumb img { width: 100%; height: 70px; object-fit: cover; background: #111; }\\n\\n    @media (max-width: 768px) {\\n      #dg-six-modern .strip { grid-auto-columns: minmax(60px, 1fr); }\\n      #dg-six-modern .thumb img { height: 56px; }\\n      #dg-six-modern .ctrl { width: 40px; height: 40px; }\\n    }\\n  </style>\\n\\n  \u003C!-- Grid will be injected -->\\n  <div class=\\\"grid\\\" id=\\\"dg-six-grid\\\"></div>\\n\\n  \u003C!-- In-page preview overlay -->\\n  <div class=\\\"overlay\\\" id=\\\"dg-six-overlay\\\" role=\\\"dialog\\\" aria-modal=\\\"true\\\" aria-label=\\\"Image preview\\\">\\n    <div class=\\\"stage\\\">\\n      <div class=\\\"stage-viewport\\\">\\n        <button class=\\\"ctrl prev\\\" aria-label=\\\"Previous\\\">\u276E</button>\\n        <img alt=\\\"\\\" src=\\\"\\\" />\\n        <button class=\\\"ctrl next\\\" aria-label=\\\"Next\\\">\u276F</button>\\n        <button class=\\\"close\\\" aria-label=\\\"Close\\\">\u2715</button>\\n      </div>\\n      <div class=\\\"strip\\\" id=\\\"dg-six-strip\\\" aria-label=\\\"Preview thumbnails\\\"></div>\\n    </div>\\n  </div>\\n\\n  <script>\\n    (function () {\\n      // The 6 Google Drive file IDs (from your open?id=... links)\\n      var IDS = [\\n        '1oa_XBDASoXvEAoDjDh_IrvycLxiUfwuU',\\n        '1zqUISPI2my7kvUFSceWTYZHNFJfXAdKi',\\n        '18D5KplCBfIVd1pPg0HbXcSMAQSMKgHKV',\\n        '1cr-oJUb6S7SDhqNdTHm7DuoYjg2AWKYa',\\n        '1dI5GmtqJq8VUxwX0WrYUqRpKHXTqsqrn',\\n        '107criXakQAVLtmsTVrAb7SAsHPFEbYGN'\\n      ];\\n\\n      var rootGrid = document.getElementById('dg-six-grid');\\n      var overlay  = document.getElementById('dg-six-overlay');\\n      var stageImg = overlay.querySelector('.stage-viewport img');\\n      var prevBtn  = overlay.querySelector('.prev');\\n      var nextBtn  = overlay.querySelector('.next');\\n      var closeBtn = overlay.querySelector('.close');\\n      var strip    = document.getElementById('dg-six-strip');\\n      var active = -1;\\n\\n      // Drive URL helpers with fallbacks (best chance to render inline)\\n      function thumbURL(id, w){ return 'https://drive.google.com/thumbnail?id=' + id + '&sz=w' + (w || 600); }\\n      function viewURL(id)    { return 'https://drive.google.com/uc?export=view&id=' + id; }\\n      function lh3URL(id)     { return 'https://lh3.googleusercontent.com/d/' + id + '=w2000'; }\\n\\n      function setWithFallback(img, id, isThumb){\\n        var tried = 0;\\n        var urls = isThumb\\n          ? [ thumbURL(id, 800), viewURL(id), lh3URL(id) ]\\n          : [ thumbURL(id, 2000), viewURL(id), lh3URL(id) ];\\n        img.onerror = function(){\\n          tried++;\\n          if (tried < urls.length) img.src = urls[tried];\\n          else { img.onerror = null; img.alt = 'Failed to load image'; img.src = ''; }\\n        };\\n        img.onload = function(){ img.classList.add('loaded'); };\\n        img.src = urls[0];\\n      }\\n\\n      // Build main grid (cards)\\n      IDS.forEach(function(id, idx){\\n        var card = document.createElement('button');\\n        card.type = 'button';\\n        card.className = 'card';\\n        card.setAttribute('data-index', idx);\\n        var img = document.createElement('img');\\n        img.alt = 'Image ' + (idx + 1);\\n        setWithFallback(img, id, true);\\n        var badge = document.createElement('span');\\n        badge.className = 'badge';\\n        badge.textContent = 'Preview';\\n        card.appendChild(img);\\n        card.appendChild(badge);\\n        rootGrid.appendChild(card);\\n      });\\n\\n      // Build overlay strip\\n      IDS.forEach(function(id, idx){\\n        var t = document.createElement('button');\\n        t.type = 'button';\\n        t.className = 'thumb';\\n        t.setAttribute('data-index', idx);\\n        var img = document.createElement('img');\\n        img.alt = 'Thumb ' + (idx + 1);\\n        setWithFallback(img, id, true);\\n        t.appendChild(img);\\n        strip.appendChild(t);\\n      });\\n\\n      var stripThumbs = Array.from(strip.querySelectorAll('.thumb'));\\n\\n      function show(n){\\n        active = (n + IDS.length) % IDS.length;\\n        stageImg.classList.remove('loaded'); // reset animation\\n        setWithFallback(stageImg, IDS[active], false);\\n        stripThumbs.forEach(function(el){ el.classList.remove('active'); });\\n        stripThumbs[active].classList.add('active');\\n      }\\n\\n      function openAt(n){\\n        overlay.classList.add('open');\\n        show(n);\\n        document.documentElement.style.overflow = 'hidden';\\n        document.body.style.overflow = 'hidden';\\n      }\\n\\n      function close(){\\n        overlay.classList.remove('open');\\n        stageImg.src = '';\\n        document.documentElement.style.overflow = '';\\n        document.body.style.overflow = '';\\n      }\\n\\n      function next(){ show(active + 1); }\\n      function prev(){ show(active - 1); }\\n\\n      // Events\\n      rootGrid.addEventListener('click', function(e){\\n        var card = e.target.closest('.card');\\n        if (!card) return;\\n        var idx = parseInt(card.getAttribute('data-index'), 10) || 0;\\n        openAt(idx);\\n      });\\n\\n      strip.addEventListener('click', function(e){\\n        var th = e.target.closest('.thumb');\\n        if (!th) return;\\n        var idx = parseInt(th.getAttribute('data-index'), 10) || 0;\\n        show(idx);\\n      });\\n\\n      nextBtn.addEventListener('click', next);\\n      prevBtn.addEventListener('click', prev);\\n      closeBtn.addEventListener('click', close);\\n\\n      overlay.addEventListener('click', function(e){\\n        var stage = overlay.querySelector('.stage');\\n        if (!stage.contains(e.target)) close();\\n      });\\n\\n      // Keyboard\\n      document.addEventListener('keydown', function(e){\\n        if (!overlay.classList.contains('open')) return;\\n        if (e.key === 'Escape') close();\\n        if (e.key === 'ArrowRight') next();\\n        if (e.key === 'ArrowLeft')  prev();\\n      });\\n\\n      // Basic swipe (mobile)\\n      (function attachSwipe(el){\\n        var sx=0, sy=0;\\n        el.addEventListener('touchstart', function(ev){\\n          var t = ev.touches[0]; sx = t.clientX; sy = t.clientY;\\n        }, {passive:true});\\n        el.addEventListener('touchend', function(ev){\\n          if (sx === 0 && sy === 0) return;\\n          var t = ev.changedTouches[0];\\n          var dx = t.clientX - sx, dy = t.clientY - sy;\\n          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {\\n            if (dx < 0) next(); else prev();\\n          }\\n          sx=sy=0;\\n        }, {passive:true});\\n      })(overlay.querySelector('.stage-viewport'));\\n    })();\\n  <$script>\\n</section>\",\"widgetId\":\"4a18bada-6805-4283-8dac-33a95cff1ff1\",\"section\":\"default\",\"category\":\"neutral\",\"locale\":\"en-US\",\"env\":\"production\",\"renderMode\":\"PUBLISH\"}"
    ),
    context: JSON.parse(
      '{"order":4,"widgetId":"4a18bada-6805-4283-8dac-33a95cff1ff1","widgetType":"HTML","widgetPreset":"html1","group":"Section","groupType":"Default","section":"default","category":"neutral","fontSize":"medium","fontFamily":"alternate","websiteThemeOverrides":{"ButtonPrimary":{"value":{"color":"HIGHCONTRAST"}},"ButtonSpotlight":{"value":{"color":"HIGHCONTRAST"}},"ButtonSecondary":{"value":{"color":"HIGHCONTRAST"}},"HeadingDelta":{"byType":{"MenuHeading":{"value":{"typography":"HeadingDelta","style":{}}}}}},"widgetThemeOverrides":{}}'
    ),
    contextKey: "context-bs-3",
    radpack: "@widget/HTML/bs-Component",
  },
  false
);
Core.utils.deferBootstrap(
  {
    elId: "bs-8",
    componentName: "@widget/HTML/bs-Component",
    props: JSON.parse(
      '{"data-aid":"AUTOIFRAME_RENDERED","centerContent":true,"htmlSrc":"<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n    <meta charset=\\"UTF-8\\" />\\n    <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\" />\\n    <title>YouTube Video Embed</title>\\n</head>\\n<body>\\n\\n\\n\u003C!-- Replace VIDEO_ID with the actual YouTube video ID -->\\n<iframe width=\\"800\\" height=\\"400\\" \\n    src=\\"https://www.youtube.com/embed/XtePax2rsz0?si=xqtqV1wljvzbRdeZ\\" \\n    frameborder=\\"0\\" \\n    allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\" \\n    allowfullscreen>\\n</iframe>\\n\\n</body>\\n</html>\\n","widgetId":"cf415062-1565-4eb1-9cdd-92702e5177f7","section":"alt","category":"primary","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
    ),
    context: JSON.parse(
      '{"order":5,"widgetId":"cf415062-1565-4eb1-9cdd-92702e5177f7","widgetType":"HTML","widgetPreset":"html1","group":"Section","groupType":"Default","section":"alt","category":"primary","fontSize":"medium","fontFamily":"alternate","websiteThemeOverrides":{"ButtonPrimary":{"value":{"color":"HIGHCONTRAST"}},"ButtonSpotlight":{"value":{"color":"HIGHCONTRAST"}},"ButtonSecondary":{"value":{"color":"HIGHCONTRAST"}},"HeadingDelta":{"byType":{"MenuHeading":{"value":{"typography":"HeadingDelta","style":{}}}}}},"widgetThemeOverrides":{"Widget":{"value":{"colors":["#ffffff"]}}}}'
    ),
    contextKey: "context-bs-3",
    radpack: "@widget/HTML/bs-Component",
  },
  false
);
Core.utils.deferBootstrap(
  {
    elId: "bs-9",
    componentName: "@widget/HTML/bs-Component",
    props: JSON.parse(
      '{"data-aid":"AUTOIFRAME_RENDERED","centerContent":true,"htmlSrc":"<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n    <meta charset=\\"UTF-8\\" />\\n    <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\" />\\n    <title>YouTube Video Embed</title>\\n</head>\\n<body>\\n\\n\\n\u003C!-- Replace VIDEO_ID with the actual YouTube video ID -->\\n<iframe width=\\"800\\" height=\\"400\\" \\n    src=\\"https://www.youtube.com/embed/WvDiHEdWcfY?si=TGB36qBsb0GzU1ys\\" \\n    frameborder=\\"0\\" \\n    allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\" \\n    allowfullscreen>\\n</iframe>\\n\\n</body>\\n</html>\\n","widgetId":"c573d6fc-5000-430a-8c4d-b181df48d6a7","section":"default","category":"primary","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
    ),
    context: JSON.parse(
      '{"order":6,"widgetId":"c573d6fc-5000-430a-8c4d-b181df48d6a7","widgetType":"HTML","widgetPreset":"html1","group":"Section","groupType":"Default","section":"default","category":"primary","fontSize":"medium","fontFamily":"alternate","websiteThemeOverrides":{"ButtonPrimary":{"value":{"color":"HIGHCONTRAST"}},"ButtonSpotlight":{"value":{"color":"HIGHCONTRAST"}},"ButtonSecondary":{"value":{"color":"HIGHCONTRAST"}},"HeadingDelta":{"byType":{"MenuHeading":{"value":{"typography":"HeadingDelta","style":{}}}}}},"widgetThemeOverrides":{"Widget":{"value":{"colors":["#ffffff"]}}}}'
    ),
    contextKey: "context-bs-3",
    radpack: "@widget/HTML/bs-Component",
  },
  false
);
Core.utils.deferBootstrap(
  {
    elId: "bs-10",
    componentName: "@widget/HTML/bs-Component",
    props: JSON.parse(
      '{"data-aid":"AUTOIFRAME_RENDERED","centerContent":true,"htmlSrc":"<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n    <meta charset=\\"UTF-8\\" />\\n    <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\" />\\n    <title>YouTube Video Embed</title>\\n</head>\\n<body>\\n\\n\\n\\n\u003C!-- Replace VIDEO_ID with the actual YouTube video ID -->\\n<iframe width=\\"800\\" height=\\"400\\" \\n    src=\\"https://www.youtube.com/embed/pawI3gexAAg\\" \\n    frameborder=\\"0\\" \\n    allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\" \\n    allowfullscreen>\\n</iframe>\\n\\n</body>\\n</html>\\n","widgetId":"1ceb5302-88df-4447-b00c-2a1b255173b5","section":"alt","category":"primary","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
    ),
    context: JSON.parse(
      '{"order":7,"widgetId":"1ceb5302-88df-4447-b00c-2a1b255173b5","widgetType":"HTML","widgetPreset":"html1","group":"Section","groupType":"Default","section":"alt","category":"primary","fontSize":"medium","fontFamily":"alternate","websiteThemeOverrides":{"ButtonPrimary":{"value":{"color":"HIGHCONTRAST"}},"ButtonSpotlight":{"value":{"color":"HIGHCONTRAST"}},"ButtonSecondary":{"value":{"color":"HIGHCONTRAST"}},"HeadingDelta":{"byType":{"MenuHeading":{"value":{"typography":"HeadingDelta","style":{}}}}}},"widgetThemeOverrides":{"Widget":{"value":{"colors":["#ffffff"]}}}}'
    ),
    contextKey: "context-bs-3",
    radpack: "@widget/HTML/bs-Component",
  },
  false
);
window.wsb["CookieBannerScript"] = function ({
  id: e,
  acceptCookie: t,
  dismissCookie: o,
}) {
  let a, n, i;
  function l(e, t = 60) {
    const o = new Date();
    o.setTime(o.getTime() + 864e5 * t);
    const a = `expires=${o.toUTCString()}`;
    document.cookie = `${e}=true;${a};path=/`;
  }
  function r(e) {
    document.cookie = `${e}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
  function s(e) {
    return document.cookie.includes(e);
  }
  function c() {
    n && n.removeEventListener("click", d),
      i && i.removeEventListener("click", u),
      (a.style.display = "none");
  }
  function p() {
    (window._allowCT = !0),
      window._allowCTListener && window._allowCTListener.forEach((e) => e());
  }
  function g() {
    s(o) ||
      ((a = document.getElementById(`${e}-banner`)),
      (n = document.getElementById(`${e}-accept`)),
      (i = document.getElementById(`${e}-decline`)),
      n && n.addEventListener("click", d),
      i && i.addEventListener("click", u),
      (a.style.transform = "translateY(-500px)"));
  }
  function d(e) {
    e.preventDefault(), p(), l(o), l(t), c();
  }
  function u(e) {
    e.preventDefault(), l(o), s(t) && r(t), c();
  }
  !s(t) || navigator.globalPrivacyControl
    ? setTimeout(() => {
        navigator.globalPrivacyControl
          ? ((window._allowCT = !1), s(o) && r(o), s(t) && r(t), c())
          : g();
      }, 200)
    : p();
};
window.wsb["CookieBannerScript"](
  JSON.parse(
    '{"id":"d3132855-b8de-43ff-8d0f-0d311835c9ea","dismissCookie":"cookie_warning_dismissed","acceptCookie":"cookie_terms_accepted"}'
  )
);
document
  .getElementById("page-10789")
  .addEventListener("click", function () {}, false);
var t = document.createElement("script");
(t.type = "text/javascript"),
  t.addEventListener("load", () => {
    window.tti.calculateTTI(({ name: t, value: e } = {}) => {
      let i = {
        wam_site_hasPopupWidget: false,
        wam_site_hasMessagingWidget: false,
        wam_site_headerTreatment: "WideInset",
        wam_site_hasSlideshow: false,
        wam_site_hasFreemiumBanner: false,
        wam_site_homepageFirstWidgetType: "INTRODUCTION",
        wam_site_homepageFirstWidgetPreset: "introduction1",
        wam_site_businessCategory: "personal_health",
        wam_site_theme: "layout13",
        wam_site_locale: "en-IN",
        wam_site_fontPack: "abril-fatface",
        wam_site_cookieBannerEnabled: true,
        wam_site_hasHomepageHTML: false,
        wam_site_hasHomepageShop: false,
        wam_site_hasHomepageOla: false,
        wam_site_hasHomepageBlog: false,
        wam_site_hasShop: false,
        wam_site_hasOla: false,
        wam_site_planType: "overFree",
        wam_site_isHomepage: false,
        wam_site_htmlWidget: true,
      };
      window.networkInfo &&
        window.networkInfo.downlink &&
        (i = Object.assign({}, i, {
          ["wam_site_networkSpeed"]: window.networkInfo.downlink.toFixed(2),
        })),
        window.tti.setCustomProperties(i),
        window.tti._collectVitals({ name: t, value: e });
    });
  }),
  t.setAttribute("src", "//img1.wsimg.com/traffic-assets/js/tccl-tti.min.js"),
  document.body.appendChild(t);
