import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // For demo purposes, just navigate to home
    navigate('/');
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6" 
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop')" 
      }}
    >
      <div className="text-center text-white bg-black/50 p-8 rounded-xl backdrop-blur-sm max-w-md w-full">
        <h1 className="text-5xl font-heading font-semibold mb-2">Terra</h1>
        <p className="text-lg mb-8">Your climate action companion.</p>
        
        <div className="space-y-4">
          <Button 
            onClick={handleLogin}
            className="w-full bg-terra-green hover:bg-terra-green-light text-white py-6 text-lg rounded-full"
          >
            Continue with Google
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLogin}
            className="w-full bg-transparent border-white text-white hover:bg-white/10 py-6 text-lg rounded-full"
          >
            Sign up with email
          </Button>
        </div>
        
        <p className="mt-8 text-sm">
          Already have an account? 
          <button 
            onClick={handleLogin}
            className="font-semibold underline ml-1 hover:text-terra-green-light transition-colors"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;