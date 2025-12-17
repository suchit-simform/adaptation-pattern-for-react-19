export async function deliverMessage(message: string) {
  await new Promise((res) => setTimeout(res, 1000));
  // throw new Error("Failed to deliver message");
  return message;
}
