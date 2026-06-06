import Script from "next/script";

/**
 * Yandex.Metrica counter.
 *
 * Разбит на 2 компонента по спецификации HTML:
 *   • <YandexMetrika />         — inline <script>, рендерится в <head>
 *                                  через strategy="beforeInteractive",
 *                                  загружается ДО hydration → hit успеет
 *                                  уйти даже если посетитель мгновенно
 *                                  закрыл вкладку
 *   • <YandexMetrikaNoScript />  — <noscript> + <img> пиксель, рендерится
 *                                  в <body>. Спецификация HTML запрещает
 *                                  <noscript> внутри <head>, поэтому
 *                                  выносим отдельно.
 *
 * ID берётся из env NEXT_PUBLIC_YANDEX_METRIKA_ID; если env не задан
 * (например, локальный dev или Vercel env ещё не заполнен) — fallback
 * на захардкоженный 109644337, чтобы счётчик работал «из коробки».
 *
 * Параметры init 1:1 из ЛК Яндекс.Метрики:
 *   ssr: true                  — учитывать Client-Side Rendering (App Router)
 *   webvisor: true             — запись сессий
 *   clickmap: true             — кликабельная карта (heatmap)
 *   ecommerce: "dataLayer"     — DataLayer для будущей e-commerce
 *   referrer + url             — реальные referrer/URL после SPA-навигации
 *   accurateTrackBounce: true  — точный отказ (выход при <15с неактивности)
 *   trackLinks: true           — outbound-клики по внешним ссылкам
 */
export function getMetrikaId(): string {
  return process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() || "109688406";
}

export function YandexMetrika() {
  return (
    <Script id="yandex-metrika-counter" strategy="beforeInteractive">
      {`    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=109688406', 'ym');

    ym(109688406, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});`}
    </Script>
  );
}

export function YandexMetrikaNoScript() {
  return (
    <noscript>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://mc.yandex.ru/watch/109688406"
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
          width={1}
          height={1}
        />
      </div>
    </noscript>
  );
}
