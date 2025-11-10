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
    '{"adEndpoint":"/markup/ad","isPublish":true,"containerId":"freemium-ad-72660"}'
  )
);
window.wsb["context-bs-1"] = JSON.parse(
  '{"env":"production","renderMode":"PUBLISH","fonts":["abril-fatface","helvetica",""],"colors":["#ffffff"],"locale":"en-US","language":"en","resellerId":1,"internalLinks":{"81c1306d-006f-468c-9984-0e7be55668b9":{"pageId":"7da90275-2b7e-44b0-9d4c-cfcaf7bf49a0","routePath":"/"}},"isInternalPage":true,"navigationMap":{"0f439c68-4c5f-44ae-91f5-e5178b1dd766":{"isFlyoutMenu":false,"active":false,"pageId":"0f439c68-4c5f-44ae-91f5-e5178b1dd766","name":"Our Journey","href":"/our-journey","target":"","visible":false,"isSectionLink":false,"requiresAuth":false,"tags":["HTML"],"rel":"","type":"page","showInFooter":false},"2e70feea-130c-4210-9ca4-12489cd58666":{"isFlyoutMenu":false,"active":false,"pageId":"2e70feea-130c-4210-9ca4-12489cd58666","name":"About Us","href":"/about-us","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["ABOUT"],"rel":"","type":"page","showInFooter":true},"6bd61cd7-07d9-4bfe-b38b-3f4ba36de799":{"isFlyoutMenu":false,"active":false,"pageId":"6bd61cd7-07d9-4bfe-b38b-3f4ba36de799","name":"404","href":"/404","target":"","visible":false,"requiresAuth":false,"tags":["404","INTRODUCTION"],"rel":"","type":"page","showInFooter":false},"7da90275-2b7e-44b0-9d4c-cfcaf7bf49a0":{"isFlyoutMenu":false,"active":false,"pageId":"7da90275-2b7e-44b0-9d4c-cfcaf7bf49a0","name":"Home","href":"/","target":"","visible":true,"requiresAuth":false,"tags":["CONTENT","INTRODUCTION","LOGOS","SOCIAL"],"rel":"","type":"page","showInFooter":false},"88201acd-80f5-4be9-a3b5-dba4b8926241":{"isFlyoutMenu":false,"active":true,"pageId":"88201acd-80f5-4be9-a3b5-dba4b8926241","name":"Contact Us","href":"/contact-us","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["CONTACT"],"rel":"","type":"page","showInFooter":true},"ac00ed26-f70a-447e-a9ae-58c847e89ece":{"isFlyoutMenu":false,"active":false,"pageId":"ac00ed26-f70a-447e-a9ae-58c847e89ece","name":"Ace Gallery","href":"/ace-gallery","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["HTML"],"rel":"","type":"page","showInFooter":true},"af8d1fbf-0f2b-4cf8-b81e-1cdc4a02b643":{"isFlyoutMenu":false,"active":false,"pageId":"af8d1fbf-0f2b-4cf8-b81e-1cdc4a02b643","name":"Our Products","href":"/our-products","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["CONTENT","LOGOS","MENU"],"rel":"","type":"page","showInFooter":true}},"dials":{"colors":[{"id":"#ffffff","meta":{"primary":"rgb(255, 255, 255)","accent":"rgb(17, 17, 17)","neutral":"rgb(255, 255, 255)"}}],"fonts":{"primary":{"id":"abril-fatface","description":"","tags":["serif","classic","conservative"],"meta":{"order":1,"primary":{"id":"abril-fatface","name":"Abril Fatface","url":"//fonts.googleapis.com/css?family=Abril+Fatface:400&display=swap","family":"\'Abril Fatface\', Georgia, serif","size":16,"weight":400,"weights":[400,700],"styles":{"letterSpacing":"2px"}},"alternate":{"id":"droid-sans","name":"Droid Sans","url":"//fonts.googleapis.com/css?family=Droid+Sans:300,400,700,800&display=swap","family":"\'Droid Sans\', arial, sans-serif","size":16,"weight":400,"weights":[300,400,700,800],"styles":{"letterSpacing":"normal","textTransform":"none"}}},"overridesAlternate":[{"locales":["ta-IN","mr-IN","hi-IN"],"meta":{"alternate":{"family":"Arial, sans-serif"}}}],"overridesPrimary":[{"locales":["vi-VN"],"meta":{"primary":{"family":"Georgia, serif"}}},{"locales":["ta-IN","mr-IN","hi-IN"],"meta":{"primary":{"family":"Georgia, serif"}}}]},"alternate":{"id":"helvetica","description":"","tags":[],"meta":{"order":6,"alternate":{"id":"helvetica","name":"Helvetica","url":"","family":"Helvetica, arial, sans-serif","size":16,"weight":400,"weights":[400,700],"styles":{"letterSpacing":"normal","textTransform":"none"}}}}}},"theme":"Theme13"}'
);
Core.utils.deferBootstrap(
  {
    elId: "bs-1",
    componentName: "@widget/LAYOUT/bs-Hamburger-Component",
    props: JSON.parse(
      '{"toggleId":"n-72659-navId-mobile","uniqueId":"n-72659","style":{"color":"highContrast",":hover":{"color":"highlight"},"@md":{"display":"none"}},"widgetId":"4b7f16d7-6066-4948-8f8c-2acbcf355f2f","section":"default","category":"primary","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
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
      '{"toggleId":"more-72668","label":"More","dataAid":"NAV_MORE","navBarId":"navBarId-72665","parentId":"nav-72667","widgetId":"4b7f16d7-6066-4948-8f8c-2acbcf355f2f","section":"default","category":"primary","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
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
    '{"navId":"nav-72667","logoImageId":"logo-72664","containerId":"navBarId-72665"}'
  )
);
window.wsb["context-bs-3"] = JSON.parse(
  '{"env":"production","renderMode":"PUBLISH","fonts":["abril-fatface","helvetica",""],"colors":["#ffffff"],"fontScale":"medium","locale":"en-US","language":"en","resellerId":1,"internalLinks":{"81c1306d-006f-468c-9984-0e7be55668b9":{"pageId":"7da90275-2b7e-44b0-9d4c-cfcaf7bf49a0","routePath":"/"}},"isInternalPage":true,"navigationMap":{"0f439c68-4c5f-44ae-91f5-e5178b1dd766":{"isFlyoutMenu":false,"active":false,"pageId":"0f439c68-4c5f-44ae-91f5-e5178b1dd766","name":"Our Journey","href":"/our-journey","target":"","visible":false,"isSectionLink":false,"requiresAuth":false,"tags":["HTML"],"rel":"","type":"page","showInFooter":false},"2e70feea-130c-4210-9ca4-12489cd58666":{"isFlyoutMenu":false,"active":false,"pageId":"2e70feea-130c-4210-9ca4-12489cd58666","name":"About Us","href":"/about-us","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["ABOUT"],"rel":"","type":"page","showInFooter":true},"6bd61cd7-07d9-4bfe-b38b-3f4ba36de799":{"isFlyoutMenu":false,"active":false,"pageId":"6bd61cd7-07d9-4bfe-b38b-3f4ba36de799","name":"404","href":"/404","target":"","visible":false,"requiresAuth":false,"tags":["404","INTRODUCTION"],"rel":"","type":"page","showInFooter":false},"7da90275-2b7e-44b0-9d4c-cfcaf7bf49a0":{"isFlyoutMenu":false,"active":false,"pageId":"7da90275-2b7e-44b0-9d4c-cfcaf7bf49a0","name":"Home","href":"/","target":"","visible":true,"requiresAuth":false,"tags":["CONTENT","INTRODUCTION","LOGOS","SOCIAL"],"rel":"","type":"page","showInFooter":false},"88201acd-80f5-4be9-a3b5-dba4b8926241":{"isFlyoutMenu":false,"active":true,"pageId":"88201acd-80f5-4be9-a3b5-dba4b8926241","name":"Contact Us","href":"/contact-us","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["CONTACT"],"rel":"","type":"page","showInFooter":true},"ac00ed26-f70a-447e-a9ae-58c847e89ece":{"isFlyoutMenu":false,"active":false,"pageId":"ac00ed26-f70a-447e-a9ae-58c847e89ece","name":"Ace Gallery","href":"/ace-gallery","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["HTML"],"rel":"","type":"page","showInFooter":true},"af8d1fbf-0f2b-4cf8-b81e-1cdc4a02b643":{"isFlyoutMenu":false,"active":false,"pageId":"af8d1fbf-0f2b-4cf8-b81e-1cdc4a02b643","name":"Our Products","href":"/our-products","target":"","visible":true,"isSectionLink":false,"requiresAuth":false,"tags":["CONTENT","LOGOS","MENU"],"rel":"","type":"page","showInFooter":true}},"dials":{"colors":[{"id":"#ffffff","meta":{"primary":"rgb(255, 255, 255)","accent":"rgb(17, 17, 17)","neutral":"rgb(255, 255, 255)"}}],"fonts":{"primary":{"id":"abril-fatface","description":"","tags":["serif","classic","conservative"],"meta":{"order":1,"primary":{"id":"abril-fatface","name":"Abril Fatface","url":"//fonts.googleapis.com/css?family=Abril+Fatface:400&display=swap","family":"\'Abril Fatface\', Georgia, serif","size":16,"weight":400,"weights":[400,700],"styles":{"letterSpacing":"2px"}},"alternate":{"id":"droid-sans","name":"Droid Sans","url":"//fonts.googleapis.com/css?family=Droid+Sans:300,400,700,800&display=swap","family":"\'Droid Sans\', arial, sans-serif","size":16,"weight":400,"weights":[300,400,700,800],"styles":{"letterSpacing":"normal","textTransform":"none"}}},"overridesAlternate":[{"locales":["ta-IN","mr-IN","hi-IN"],"meta":{"alternate":{"family":"Arial, sans-serif"}}}],"overridesPrimary":[{"locales":["vi-VN"],"meta":{"primary":{"family":"Georgia, serif"}}},{"locales":["ta-IN","mr-IN","hi-IN"],"meta":{"primary":{"family":"Georgia, serif"}}}]},"alternate":{"id":"helvetica","description":"","tags":[],"meta":{"order":6,"alternate":{"id":"helvetica","name":"Helvetica","url":"","family":"Helvetica, arial, sans-serif","size":16,"weight":400,"weights":[400,700],"styles":{"letterSpacing":"normal","textTransform":"none"}}}}}},"theme":"Theme13"}'
);
Core.utils.deferBootstrap(
  {
    elId: "bs-3",
    componentName: "@widget/CONTACT/bs-contact3-contact-form",
    props: JSON.parse(
      '{"formTitle":"Drop us a line!","formFields":[{"type":"SINGLE_LINE","label":"Name","required":true,"keyName":"name"},{"type":"EMAIL","label":"Email","validation":"email","required":true,"replyTo":true,"keyName":"email"},{"type":"MULTI_LINE","label":"Message","required":true,"keyName":"message"},{"type":"ATTACHMENT","label":"Attachments","required":false},{"type":"SUBMIT","label":"Send","required":false}],"blankInfo":false,"formSubmitHost":"https://contact.apps-api.instantpage.secureserver.net","showMap":true,"recaptchaEnabled":true,"recaptchaType":"V3","domainName":"ace138.godaddysites.com","formSuccessMessage":"Thank you for your inquiry! We will get back to you within 48 hours.","formEnabled":true,"websiteId":"e889fc1c-062b-4df4-8ad6-5c678ede1e6f","pageId":"88201acd-80f5-4be9-a3b5-dba4b8926241","accountId":"1e477b55-9f65-11f0-95d3-008cfafff06e","staticContent":{"today":"Today","submitButtonLoadingLabel":"Sending","contactFormResponseErrorMessage":"Something went wrong while sending your message, please try again later","phoneValidationErrorMessage":"Please enter a valid phone number.","defaultCancelButtonLabel":"Cancel","byAppointment":"By Appointment","defaultSubmitButtonLabel":"Send","unsupportedFileType":"Unsupported file type","maxFileCountLimit":"Only {0} files are allowed","closed":"Closed","attachments":"Attachments","termsOfSerivce":"Terms of Service","attachFiles":"Attach Files","recaptchaDisclosure":"This site is protected by reCAPTCHA and the Google {privacyPolicy} and {termsOfSerivce} apply.","emailValidationErrorMessage":"Please enter a valid email address.","mapCTA":"Get directions","privacyPolicyURL":"https://policies.google.com/privacy","requiredValidationErrorMessage":"Please fill in this required field","openToday":"Open today","couldNotAttach":"Could not attach the following file(s)","totalFileSizeLimit":"Total files would exceed {0} limit","privacyPolicy":"Privacy Policy","termsOfSerivceURL":"https://policies.google.com/terms","fileSizeLimit":"File exceeds {0} limit","emailMaxCountValidationErrorMessage":"Your email address is too long"},"emailOptInEnabled":false,"emailOptInMessage":"Sign up for our email list for updates, promotions, and more.","emailConfirmationMessage":"We\'ve sent you a confirmation email, please click the link to verify your address.","widgetId":"cbd099c6-3fc5-465a-ba04-e6555c4c82e1","section":"default","category":"neutral","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
    ),
    context: JSON.parse(
      '{"widgetId":"cbd099c6-3fc5-465a-ba04-e6555c4c82e1","widgetType":"CONTACT","widgetPreset":"contact3","group":"Content","groupType":"Default","section":"default","category":"neutral","fontSize":"medium","fontFamily":"alternate","websiteThemeOverrides":{"ButtonPrimary":{"value":{"color":"HIGHCONTRAST"}},"ButtonSpotlight":{"value":{"color":"HIGHCONTRAST"}},"ButtonSecondary":{"value":{"color":"HIGHCONTRAST"}},"HeadingDelta":{"byType":{"MenuHeading":{"value":{"typography":"HeadingDelta","style":{}}}}}},"widgetThemeOverrides":{}}'
    ),
    contextKey: "context-bs-3",
    radpack: "@widget/CONTACT/bs-contact3-contact-form",
  },
  false
);
Core.utils.deferBootstrap(
  {
    elId: "bs-4",
    componentName: "@widget/CONTACT/bs-Component",
    props: JSON.parse(
      '{"structuredHours":[{"hour":{"day":"Monday","dayOfWeek":1,"openTime":"09:00","closeTime":"17:00","byAppointmentOnly":false,"closed":false}},{"hour":{"day":"Tuesday","dayOfWeek":2,"openTime":"09:00","closeTime":"17:00","byAppointmentOnly":false,"closed":false}},{"hour":{"day":"Wednesday","dayOfWeek":3,"openTime":"09:00","closeTime":"17:00","byAppointmentOnly":false,"closed":false}},{"hour":{"day":"Thursday","dayOfWeek":4,"openTime":"09:00","closeTime":"17:00","byAppointmentOnly":false,"closed":false}},{"hour":{"day":"Friday","dayOfWeek":5,"openTime":"09:00","closeTime":"17:00","byAppointmentOnly":false,"closed":false}},{"hour":{"day":"Saturday","dayOfWeek":6,"openTime":"09:00","closeTime":"17:00","byAppointmentOnly":false,"closed":true}},{"hour":{"day":"Sunday","dayOfWeek":0,"openTime":"09:00","closeTime":"17:00","byAppointmentOnly":false,"closed":true}}],"staticContent":{"today":"Today","submitButtonLoadingLabel":"Sending","contactFormResponseErrorMessage":"Something went wrong while sending your message, please try again later","phoneValidationErrorMessage":"Please enter a valid phone number.","defaultCancelButtonLabel":"Cancel","byAppointment":"By Appointment","defaultSubmitButtonLabel":"Send","unsupportedFileType":"Unsupported file type","maxFileCountLimit":"Only {0} files are allowed","closed":"Closed","attachments":"Attachments","termsOfSerivce":"Terms of Service","attachFiles":"Attach Files","recaptchaDisclosure":"This site is protected by reCAPTCHA and the Google {privacyPolicy} and {termsOfSerivce} apply.","emailValidationErrorMessage":"Please enter a valid email address.","mapCTA":"Get directions","privacyPolicyURL":"https://policies.google.com/privacy","requiredValidationErrorMessage":"Please fill in this required field","openToday":"Open today","couldNotAttach":"Could not attach the following file(s)","totalFileSizeLimit":"Total files would exceed {0} limit","privacyPolicy":"Privacy Policy","termsOfSerivceURL":"https://policies.google.com/terms","fileSizeLimit":"File exceeds {0} limit","emailMaxCountValidationErrorMessage":"Your email address is too long"},"collapsible":true,"widgetId":"cbd099c6-3fc5-465a-ba04-e6555c4c82e1","section":"default","category":"neutral","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
    ),
    context: JSON.parse(
      '{"widgetId":"cbd099c6-3fc5-465a-ba04-e6555c4c82e1","widgetType":"CONTACT","widgetPreset":"contact3","group":"Content","groupType":"Default","section":"default","category":"neutral","fontSize":"medium","fontFamily":"alternate","websiteThemeOverrides":{"ButtonPrimary":{"value":{"color":"HIGHCONTRAST"}},"ButtonSpotlight":{"value":{"color":"HIGHCONTRAST"}},"ButtonSecondary":{"value":{"color":"HIGHCONTRAST"}},"HeadingDelta":{"byType":{"MenuHeading":{"value":{"typography":"HeadingDelta","style":{}}}}}},"widgetThemeOverrides":{}}'
    ),
    contextKey: "context-bs-3",
    radpack: "@widget/CONTACT/bs-Component",
  },
  false
);
Core.utils.deferBootstrap(
  {
    elId: "bs-5",
    componentName: "@widget/CONTACT/bs-genericMap",
    props: JSON.parse(
      '{"lat":"18.9430864","lon":"72.8271764","address":"Marine Lines, Mumbai, Maharashtra, India","type":"google","isEditMode":false,"zoom":14,"staticContent":{"today":"Today","submitButtonLoadingLabel":"Sending","contactFormResponseErrorMessage":"Something went wrong while sending your message, please try again later","phoneValidationErrorMessage":"Please enter a valid phone number.","defaultCancelButtonLabel":"Cancel","byAppointment":"By Appointment","defaultSubmitButtonLabel":"Send","unsupportedFileType":"Unsupported file type","maxFileCountLimit":"Only {0} files are allowed","closed":"Closed","attachments":"Attachments","termsOfSerivce":"Terms of Service","attachFiles":"Attach Files","recaptchaDisclosure":"This site is protected by reCAPTCHA and the Google {privacyPolicy} and {termsOfSerivce} apply.","emailValidationErrorMessage":"Please enter a valid email address.","mapCTA":"Get directions","privacyPolicyURL":"https://policies.google.com/privacy","requiredValidationErrorMessage":"Please fill in this required field","openToday":"Open today","couldNotAttach":"Could not attach the following file(s)","totalFileSizeLimit":"Total files would exceed {0} limit","privacyPolicy":"Privacy Policy","termsOfSerivceURL":"https://policies.google.com/terms","fileSizeLimit":"File exceeds {0} limit","emailMaxCountValidationErrorMessage":"Your email address is too long"},"viewDevice":null,"widgetId":"cbd099c6-3fc5-465a-ba04-e6555c4c82e1","section":"default","category":"neutral","locale":"en-US","env":"production","renderMode":"PUBLISH"}'
    ),
    context: JSON.parse(
      '{"widgetId":"cbd099c6-3fc5-465a-ba04-e6555c4c82e1","widgetType":"CONTACT","widgetPreset":"contact3","group":"Map","groupType":"Banner","section":"default","category":"neutral","fontSize":"medium","fontFamily":"alternate","websiteThemeOverrides":{"ButtonPrimary":{"value":{"color":"HIGHCONTRAST"}},"ButtonSpotlight":{"value":{"color":"HIGHCONTRAST"}},"ButtonSecondary":{"value":{"color":"HIGHCONTRAST"}},"HeadingDelta":{"byType":{"MenuHeading":{"value":{"typography":"HeadingDelta","style":{}}}}}},"widgetThemeOverrides":{}}'
    ),
    contextKey: "context-bs-3",
    radpack: "@widget/CONTACT/bs-genericMap",
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
  .getElementById("page-72658")
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
        wam_site_htmlWidget: false,
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
