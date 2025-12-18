import { use } from "react";

const ExampleUsageOfUse = ({
  awaitedPromise,
  shouldCall,
}: {
  awaitedPromise: Promise<string>;
  shouldCall?: boolean;
}) => {
  let resolveData: string =
    "Dynamic props base condition content dose not get called";
  if (shouldCall) {
    resolveData = use(awaitedPromise);
  }
  return (
    <div>
      Example usage of <code>use</code> api
      <p>{String(resolveData)}</p>
    </div>
  );
};

export default ExampleUsageOfUse;
