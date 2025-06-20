
import { useAuthContext } from "@/components/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export const UserInfo = () => {
  const { user, signOut } = useAuthContext();

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) return null;

  const initials = user.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : "U";

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-blue-100 text-blue-600">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-900">{user.email}</p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleSignOut}
        className="text-gray-600 hover:text-gray-900"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden md:inline ml-2">Sign Out</span>
      </Button>
    </div>
  );
};
