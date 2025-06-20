
import { useAuthContext } from "@/components/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export const UserInfo = () => {
  const { user, signOut, loading } = useAuthContext();

  console.log('UserInfo component rendered');
  console.log('Loading state:', loading);
  console.log('User state:', user);

  const handleSignOut = async () => {
    console.log('Signing out user...');
    await signOut();
  };

  // Show loading state
  if (loading) {
    console.log('UserInfo showing loading state');
    return (
      <div className="flex items-center space-x-3 bg-yellow-100 px-3 py-2 rounded-lg border border-yellow-300">
        <div className="text-sm text-yellow-800">Loading user...</div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found in UserInfo component');
    return (
      <div className="flex items-center space-x-3 bg-red-100 px-3 py-2 rounded-lg border border-red-300">
        <div className="text-sm text-red-800">Not authenticated</div>
      </div>
    );
  }

  console.log('UserInfo rendering for user:', user.email);

  const initials = user.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : "U";

  return (
    <div className="flex items-center space-x-3 bg-green-100 px-3 py-2 rounded-lg border border-green-300">
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
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
        <span className="ml-1">Sign Out</span>
      </Button>
    </div>
  );
};
