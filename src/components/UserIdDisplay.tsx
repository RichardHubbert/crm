import React from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const UserIdDisplay: React.FC = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();

  const copyToClipboard = async () => {
    if (user?.id) {
      try {
        await navigator.clipboard.writeText(user.id);
        toast({
          title: "Copied!",
          description: "User ID copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User ID</CardTitle>
          <CardDescription>You are not currently signed in</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your User ID</CardTitle>
        <CardDescription>This is your unique identifier in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <code className="flex-1 p-2 bg-gray-100 rounded text-sm break-all">
            {user.id}
          </code>
          <Button onClick={copyToClipboard} size="sm" variant="outline">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}; 