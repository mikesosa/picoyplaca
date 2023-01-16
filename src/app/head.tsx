import Script from "next/script";

export default function Head() {
  return (
    <>
      <title>¿Tengo pico y placa hoy?</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content="Un sitio que brinda a los Bogotános saber si tienen Pico y Placa"
      />
      <link rel="icon" href="/favicon.ico" />

      <Script
        strategy="afterInteractive"
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-L3ZSJ0W36Q"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-L3ZSJ0W36Q');
        `}
      </Script>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4475122295223891"
        crossOrigin="anonymous"
      />
    </>
  );
}
