import Script from "next/script";

export default function Head() {
  return (
    <>
      <title>¿Tengo pico y placa hoy?</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content="Un sitio que brinda a los bogotanos saber si tienen pico y placa"
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
    </>
  );
}
