import Document, { Head, Html, Main, NextScript } from "next/document";

import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
  static async getInitialProps(context: any) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = context.renderPage;
    try {
      context.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(context);
      return {
        ...initialProps,
        host:
          context.req.headers["x-forwarded-server"] ?? context.req.headers.host,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head></Head>
        <body>
          <title>바로팩토리 - 3D 모니터링</title>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
