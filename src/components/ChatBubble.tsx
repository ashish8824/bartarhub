type Props = {
  message: Message;
  isSender: boolean;
};

export default function ChatBubble({ message, isSender }: Props) {
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
          isSender ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        <p>{message.content}</p>
        <div className="text-[10px] text-right mt-1">
          {message.sender_profile?.username}
        </div>
      </div>
    </div>
  );
}
