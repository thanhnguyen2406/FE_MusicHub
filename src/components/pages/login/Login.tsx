import React from 'react';
import { useLoginForm } from './useLoginForm';
import LoginForm from './LoginForm';
import { ToastContainer } from 'react-toastify';

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
      <ToastContainer />
      <div className="basis-[60%] bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to MoodMix</h1>
          <p className="text-xl">Your personal music mood manager</p>
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