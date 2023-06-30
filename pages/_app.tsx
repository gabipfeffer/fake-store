import "src/styles/globals.css";
import type { AppProps } from "next/app";
import SessionProvider from "src/components/SessionProvider";
import { persistor, store } from "src/store";
import { Provider } from "react-redux";
import Header from "src/components/Header";
import { PersistGate } from "redux-persist/integration/react";
import Loader from "src/components/Loader";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Header />
          <Loader />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
