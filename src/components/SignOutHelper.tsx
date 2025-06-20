
import { useEffect } from 'react';
import { useAuthContext } from '@/components/AuthProvider';

export const SignOutHelper = () => {
  const { signOut } = useAuthContext();

  useEffect(() => {
    const performSignOut = async () => {
      console.log('Signing out user...');
      await signOut();
    };
    
    performSignOut();
  }, [signOut]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">Signing out...</p>
      </div>
    </div>
  );
};
