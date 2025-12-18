import { useActionState, useOptimistic } from "react";
import "./Chat.css";

const preAvailableMessages = [
  {
    id: 1,
    text: "Hello! How can I assist you today?",
    sender: "bot",
    timestamp: "2023-10-01T10:00:00Z",
  },
  {
    id: 2,
    text: "I need help with my account.",
    sender: "user",
    timestamp: "2023-10-01T10:01:00Z",
  },
  {
    id: 3,
    text: "Sure! What seems to be the issue?",
    sender: "bot",
    timestamp: "2023-10-01T10:02:00Z",
  },
  {
    id: 4,
    text: "I'm unable to log in.",
    sender: "user",
    timestamp: "2023-10-01T10:03:00Z",
  },
  {
    id: 5,
    text: "Have you tried resetting your password?",
    sender: "bot",
    timestamp: "2023-10-01T10:04:00Z",
  },
];

export type MessageType = (typeof preAvailableMessages)[number] & {
  isPending?: boolean;
};

const Chat = () => {
  const [allMessages, addOptimisticMessage] = useOptimistic<
    MessageType[],
    MessageType[]
  >(preAvailableMessages, (state, newMessages) => {
    return [...state, ...newMessages];
  });

  const [error, action, isPending] = useActionState<Error | null, FormData>(
    async (_currentState, formData) => {
      const messageText = formData?.get("message") as string;

      const newMessage: MessageType = {
        id: allMessages.length + 1,
        text: messageText,
        sender: "user",
        timestamp: new Date().toISOString(),
        isPending: true,
      };

      // Optimistically add the new message
      addOptimisticMessage([newMessage]);

      // Simulate a server request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would normally handle the server response

      return new Error("Simulated server error");
    },
    null
  );
  return (
    <div>
      <h2>Chats</h2>
      <ul>
        {allMessages.map((message) => (
          <li className={message.sender} key={message.id}>
            {message.text}
            {message.isPending && (
              <span className="pending"> (Sending...)</span>
            )}
          </li>
        ))}
      </ul>

      <form action={action}>
        <input type="text" name="message" />
        <button type="submit">{isPending ? "Sending..." : "Send"}</button>
        {error && <p className="error">Error: {error?.message}</p>}
      </form>
    </div>
  );
};

export default Chat;
