import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-500">
      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center">
          <MessageSquare className="w-12 h-12 text-zinc-400" />
        </div>
        <h2 className="text-2xl font-bold">Welcome to Buzzit!</h2>
        <p className="text-center max-w-sm">
          Select a chat to start messaging with your friends and family.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
