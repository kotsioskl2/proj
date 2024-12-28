import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/globals.css";
import React from "react";
import { AuthProvider } from "./AuthContext";

import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default MyApp;
