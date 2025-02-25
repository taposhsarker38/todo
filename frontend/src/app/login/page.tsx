'use client';

import { useState } from 'react';
;

import { useRouter } from 'next/navigation';
import { login } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({ username, password }));
  };

  if (isAuthenticated) {
    router.push('/tasks');
    return null;
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e)=> setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e)=> setPassword(e.target.value)} 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p>{error.detail || 'Login failed'}</p>}
    </div>
  );
}
