import { useActionState, useState } from "react";

const ActionStateExample = () => {
  const [data, action, isPending] = useActionState(
    async (currentState, formData) => {
      const name = formData.get("name") as string;
      await new Promise((resolve) =>
        setTimeout(() => resolve("Fetched Data"), 1000)
      );
      return {
        success: true,
        name,
      };
    },
    null
  );

  return (
    <form action={action}>
      <input name="name" />
      <button>{isPending ? "Updating..." : "Update"}</button>
      <span>{data?.success && "Changes Saved!"}</span>
    </form>
  );
};

export default ActionStateExample;
