/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { Suspense } from "react";
import Optimistic from "./Optimistic";
import "./App.css";
import Form from "./Form";
import BlogPost from "./BlogPost";
import { Toaster } from "sonner";
import TransitionExample from "./TransitionExample";
import ActionStateExample from "./ActionStateExample";
import Chat from "./Chat";
import ExampleUsageOfUse from "./ExampleUsageOfUse";
import StyleSheetExample from "./StyleSheetExample";

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
      {/* <Form /> */}
      {/* <Optimistic /> */}
      {/* <Toaster richColors /> */}
      {/* <TransitionExample /> */}
      {/* <ActionStateExample /> */}
      {/* <Chat /> */}
      {/* <Suspense fallback={<div>Loading...</div>}>
        <ExampleUsageOfUse
          awaitedPromise={
            new Promise((resolve) =>
              setTimeout(() => resolve("Data loaded!"), 2000)
            )
          }
          shouldCall={false}
        />
      </Suspense> */}
      <StyleSheetExample />
    </>
  );
}

export default App;
