import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useLoginForm } from './useLoginForm';
import LoginForm from './LoginForm';

const Login: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    onSubmit,
  } = useLoginForm();

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="basis-[60%] bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
          <p className="text-xl">Sign in to continue your musical journey</p>
        </div>
      </div>

      <div className="basis-[40%] flex flex-col items-center justify-center h-full pl-10">
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default Login;