/* eslint-disable @next/next/no-css-tags */
// pages/_app.tsx
import { AppProps } from "next/app";
import Head from "next/head";
import { IronfishUIProvider, LoadFonts, MDXRenderer } from "@/lib/ui";
import { IntlProvider } from "../intl/IntlProvider";
import { SessionProvider } from "next-auth/react";

import hljs from "highlight.js/lib/core";
import "highlight.js/styles/atom-one-dark.css";
import javascript from "highlight.js/lib/languages/javascript";
import rust from "highlight.js/lib/languages/rust";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MainLayout } from "../layouts/Main/Main";

import "../styles/global.css";
import { ThirdwebProvider } from "@/components/wallet/thirdweb";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("rust", rust);

const queryClient = new QueryClient();

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>
          Depressionhub | Private, anonymous, and easy way to fix ur life
        </title>
        <link href="./output.css" rel="stylesheet" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <MDXRenderer.Provider>
          <IntlProvider>
            <QueryClientProvider client={queryClient}>
              <ThirdwebProvider>
                <IronfishUIProvider>
                  <LoadFonts />
                  <MainLayout>
                    <Component {...pageProps} />
                  </MainLayout>
                </IronfishUIProvider>
              </ThirdwebProvider>
            </QueryClientProvider>
          </IntlProvider>
        </MDXRenderer.Provider>
      </SessionProvider>
    </>
  );
}

export default App;
