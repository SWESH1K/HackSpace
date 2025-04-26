import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface MessageCardProps {
  profileImage: string;
  userName: string;
  messageText: string;
  createdAt: Date;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  profileImage,
  userName,
  messageText,
  createdAt,
}) => {
  return (
    <div className="flex items-start space-x-3 p-3">
      {/* Avatar */}
      <Avatar>
        <AvatarImage src={profileImage} alt={`${userName}'s profile`} />
        <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      {/* Message Bubble */}
      <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl shadow-md min-w-[300px] max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
            {userName}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        {/* Message Text */}
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{messageText}</p>
      </div>
    </div>
  );
};