import AppLayout from "@/components/Layout/AppLayout";
import { STORE_CONTEXT } from "@/context/context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <STORE_CONTEXT>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </STORE_CONTEXT>
  );
}
