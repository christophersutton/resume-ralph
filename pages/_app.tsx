import Layout from "@/components/Layout";
import { STORE_CONTEXT } from "@/lib/context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <STORE_CONTEXT>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </STORE_CONTEXT>
  );
}
