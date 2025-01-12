import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

interface UserButtonProps {
  user: {
    name: string;
    picture: string;
  };
}

export default function UserButton({ user }: UserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const user_profile_picture = `${user.picture}`

  console.log("User profile picture URL:", user_profile_picture);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getFirstName = (name: string) => {
    const firstPart = name.split(' ')[0];
    return firstPart.toUpperCase();
  };

  return (
    <div className="relative">
      <Button className="h-12 w-auto pt-7 pb-7" onClick={toggleDropdown}>
        <div className="flex items-center space-x-2 p-2 rounded-lg">
          <Avatar>
            <AvatarImage src={user_profile_picture} alt="User Avatar" />
            <AvatarFallback className="bg-gray-200 text-gray-800">{user.name ? user.name[0] : 'U'}</AvatarFallback>
          </Avatar>
          <div className="text-l font-bold">{getFirstName(user.name)}</div>
        </div>
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border text-foreground rounded-lg shadow-lg">
          <a href="/profile" className="block px-4 py-2 hover:bg-emerald-600">Profile</a>
          <a href="/settings" className="block px-4 py-2 hover:bg-emerald-600">Settings</a>
          <a href="/logout" className="block px-4 py-2 hover:bg-emerald-600">Logout</a>
        </div>
      )}
    </div>
  );
}