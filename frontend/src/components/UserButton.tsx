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
  const user_profile_picture = `${user.picture}`;


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getFirstName = (name: string) => {
    const firstPart = name.split(' ')[0];
    return firstPart.toUpperCase();
  };

  return (
    <div className="relative">
      <Button className="h-10 w-auto pt-5 pb-5" onClick={toggleDropdown}>
        <div className="flex items-center space-x-2 p-1 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user_profile_picture} alt="User Avatar" />
            <AvatarFallback className="bg-gray-200 text-gray-800">{user.name ? user.name[0] : 'U'}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-bold">{getFirstName(user.name)}</div>
        </div>
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border text-foreground rounded-lg shadow-lg">
          <a href="/profile" className="block px-4 py-2 hover:bg-secondary">Profile</a>
          <a href="/settings" className="block px-4 py-2 hover:bg-secondary">Settings</a>
          <a href="/logout" className="block px-4 py-2 hover:bg-secondary">Logout</a>
        </div>
      )}
    </div>
  );
}