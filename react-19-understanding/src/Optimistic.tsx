// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useOptimistic, useState, useRef, startTransition } from "react";
import { deliverMessage } from "./action";
import { toast } from "sonner";

function Thread({ messages, sendMessageAction }) {
  const formRef = useRef();
  function formAction(formData) {
    try {
      // ? no we do not have to reset form if we are using form Action in react 19
      // formRef.current.reset();
      startTransition(async () => {
        addOptimisticMessage(formData.get("message"));
        await sendMessageAction(formData);
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.log("error");
    }
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      {
        text: newMessage,
        sending: true,
      },
      ...state,
    ]
  );

  return (
    <>
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
    </>
  );
}

export default function Optimistic() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 },
  ]);
  async function sendMessageAction(formData) {
    startTransition(async () => {
      try {
        const sentMessage = await deliverMessage(formData.get("message"));
        setMessages((messages) => [{ text: sentMessage }, ...messages]);
      } catch (_error) {
        toast.error("Failed to send message");
      }
    });
  }
  return <Thread messages={messages} sendMessageAction={sendMessageAction} />;
}
