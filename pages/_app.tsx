import "src/styles/globals.css";
import type { AppProps } from "next/app";
import SessionProvider from "src/components/SessionProvider";
import { store } from "src/store";
import { Provider } from "react-redux";
import Header from "src/components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <Header />
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}
