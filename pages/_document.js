import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="Content-Security-Policy" content="frame-ancestors 'self' https://www.notion.so https://*.notion.so" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 