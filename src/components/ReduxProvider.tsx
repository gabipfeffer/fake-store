"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "src/store";

type Props = {
  children: React.ReactNode;
};

export default async function ReduxProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>;
}
