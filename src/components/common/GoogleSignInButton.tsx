import React from 'react';
import { User } from 'firebase/auth';

interface GoogleSignInButtonProps {
  user: User | null;
  isLoading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  user,
  isLoading,
  onSignIn,
  onSignOut,
}) => {
  if (user) {
    return (
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1A1A1F] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'Google Account'}
              className="w-8 h-8 rounded-full border border-white/10"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#7FE3C0]/20 text-[#7FE3C0] flex items-center justify-center font-bold text-xs">
              {user.displayName?.[0] || 'U'}
            </div>
          )}
          <div className="text-left">
            <p className="text-xs font-semibold text-[#F2F2F0] leading-tight">
              {user.displayName || 'Connected Student'}
            </p>
            <p className="text-[11px] text-[#8A8A93] leading-tight mt-0.5 truncate max-w-[180px]">
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg hover:bg-rose-500/10 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1A1A1F] hover:bg-[#222228] border border-white/[0.1] rounded-2xl text-sm font-medium text-[#F2F2F0] shadow-[-1px_-1px_2px_rgba(255,255,255,0.04),2px_4px_12px_rgba(0,0,0,0.5)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white/20 border-t-[#7FE3C0] rounded-full animate-spin" />
      ) : (
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-5 h-5 shrink-0"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
      )}
      <span>{isLoading ? 'Connecting...' : 'Sign in with Google'}</span>
    </button>
  );
};
