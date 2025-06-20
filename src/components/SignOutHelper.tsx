
import { useEffect } from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';

export const SignOutHelper = () => {
  const { signOut } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const performSignOut = async () => {
      console.log('SignOutHelper: Starting sign out...');
      try {
        const { error } = await signOut();
        if (error) {
          console.error('SignOutHelper: Sign out failed:', error);
        } else {
          console.log('SignOutHelper: Sign out successful, redirecting to home');
          // Force redirect to home page after successful sign out
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('SignOutHelper: Unexpected error during sign out:', error);
        // Even if there's an error, try to redirect to home
        navigate('/', { replace: true });
      }
    };
    
    performSignOut();
  }, [signOut, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">Signing out...</p>
      </div>
    </div>
  );
};
