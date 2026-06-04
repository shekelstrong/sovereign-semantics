"use client";

import Script from "next/script";

/**
 * Yandex.Metrica counter.
 * Активируется только если в env задан NEXT_PUBLIC_YANDEX_METRIKA_ID.
 * По умолчанию в `ym(...)` включён webvisor + clickmap — это полноценный
 * российский аналог GA4 с heatmap и записью сессий. Можно отключить,
 * поменяв параметры в `counterParams`.
 *
 * Тэг noscript нужен для отключённого JS и CDN-кеша Vercel —
 * браузер всё равно отправит hit /mc.yandex.ru/watch/...
 */
export function YandexMetrika() {
  const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  if (!id) return null;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${JSON.stringify(id)}, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true,
            lang: "ru",
            ecommerce: false
          });
        `}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
            width={1}
            height={1}
          />
        </div>
      </noscript>
    </>
  );
}
