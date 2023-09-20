import React from "react";
import styles from "./layout.module.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";

type Props = {
  children: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};
