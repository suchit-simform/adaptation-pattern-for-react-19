/* eslint-disable @typescript-eslint/no-explicit-any */
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const submitFormAction = async (previousState: any, formData: any) => {
  const name = formData.get("inputName");
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ...previousState, name };
};

function Loader() {
  const { pending } = useFormStatus();
  return pending ? <p>Loading ...</p> : null;
}
function RenderName({ name }: { name: string }) {
  const { pending } = useFormStatus();
  return !pending && <p> Hello in react 19 {name}</p>;
}
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

const Form = () => {
  const [state, formAction] = useActionState(submitFormAction, {
    name: "",
  });

  return (
    <form action={formAction}>
      <input type="text" name="inputName" />
      <Loader />
      <RenderName name={state?.name} />
      <SubmitButton />
    </form>
  );
};

export default Form;
