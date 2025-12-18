import { Suspense } from "react";

const StyleSheetExample = () => {
  return (
    <Suspense fallback={<div>Loading styles...</div>}>
      <link rel="stylesheet" href="/styles/background.css" />
      <p className="dynamic-style-background-color">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto labore
        iste laborum necessitatibus quod cupiditate vel, nostrum deleniti error
        et quidem nam eum odio a ducimus debitis ipsum distinctio illo sapiente
        quaerat dolores, repudiandae laboriosam quis. Commodi vitae minus
        doloribus exercitationem magni dolor eaque expedita accusamus assumenda
        neque! Ipsum, iste.
      </p>
    </Suspense>
  );
};

export default StyleSheetExample;
