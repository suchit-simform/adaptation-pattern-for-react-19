/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from "react";
import Optimistic from "./Optimistic";
import "./App.css";
import Form from "./Form";
import BlogPost from "./BlogPost";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      {/* <BlogPost
        post={{
          metaTitle: "19:Hello",
          title: "Hello world from React 19!",
          keywords: [
            "react",
            "react-19",
            "metadata",
            "blog",
            "hello-world",
            "example",
          ],
        }}
      /> */}
      {/* <Form />; */}
      <Optimistic />
      <Toaster richColors />
    </>
  );
}

export default App;
