
import { useAuthContext } from "@/components/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

export const UserInfo = () => {
  const { user, signOut, loading } = useAuthContext();
  const { profileData, loading: profileLoading } = useProfile();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-3 bg-green-100 px-3 py-2 rounded-lg border border-green-300 hover:bg-green-200">
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
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">Account</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {profileLoading ? (
          <DropdownMenuItem disabled>
            <User className="mr-2 h-4 w-4" />
            Loading profile...
          </DropdownMenuItem>
        ) : profileData ? (
          <>
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              PROFILE INFORMATION
            </DropdownMenuLabel>
            <div className="px-2 py-1 text-sm space-y-2">
              <div>
                <span className="font-medium text-xs text-muted-foreground">Purpose:</span>
                <p className="text-sm">{profileData.purpose}</p>
              </div>
              <div>
                <span className="font-medium text-xs text-muted-foreground">Role:</span>
                <p className="text-sm">{profileData.role}</p>
              </div>
              {profileData.team_size && (
                <div>
                  <span className="font-medium text-xs text-muted-foreground">Team Size:</span>
                  <p className="text-sm">{profileData.team_size}</p>
                </div>
              )}
              {profileData.company_size && (
                <div>
                  <span className="font-medium text-xs text-muted-foreground">Company Size:</span>
                  <p className="text-sm">{profileData.company_size}</p>
                </div>
              )}
              {profileData.industry && (
                <div>
                  <span className="font-medium text-xs text-muted-foreground">Industry:</span>
                  <p className="text-sm">{profileData.industry}</p>
                </div>
              )}
              {profileData.referral_sources && profileData.referral_sources.length > 0 && (
                <div>
                  <span className="font-medium text-xs text-muted-foreground">How did you hear about us:</span>
                  <p className="text-sm">{profileData.referral_sources.join(', ')}</p>
                </div>
              )}
            </div>
            <DropdownMenuSeparator />
          </>
        ) : (
          <>
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              No profile data found
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
