import { useState, useTransition } from "react";

const TransitionExample = () => {
  const [name, setName] = useState("");
  const [data, setData] = useState<{ success: boolean; name: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  async function handleSubmit() {
    startTransition(async () => {
      await new Promise((resolve) =>
        setTimeout(() => resolve("Fetched Data"), 1000)
      );
      startTransition(() => {
        setData({
          success: true,
          name,
        });
      });
    });
  }
  return (
    <div>
      <input onChange={(e) => setName(e.target.value)} />
      <button type="button" onClick={handleSubmit}>
        {isPending ? "Updating..." : "Update"}
      </button>
      <span>{data?.success && "Changes Saved!"}</span>
    </div>
  );
};

export default TransitionExample;
