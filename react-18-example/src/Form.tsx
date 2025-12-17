import React, { useState } from "react";

const Form = () => {
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    // Simulate an async operation
    // call api
    setTimeout(() => {
      console.log("Submitted name:", name);
      setIsPending(false);
    }, 500);
  };
  return (
    <form>
      <input type="text" name="name" onChange={handleChange} />
      {isPending ? <p>Loading ...</p> : <p>Hello is React 18 {name}</p>}
      <button onClick={handleSubmit} disabled={isPending}>
        Submit
      </button>
    </form>
  );
};

export default Form;
