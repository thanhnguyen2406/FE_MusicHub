import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useRegisterForm } from './useRegisterForm';
import RegisterForm from './RegisterForm';

const Register: React.FC = () => {
  const {
    displayName,
    setDisplayName,
    email,
    setEmail,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    password,
    setPassword,
    isLoading,
    onSubmit,
  } = useRegisterForm();

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="basis-[60%] bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Join MoodMix</h1>
          <p className="text-xl">Create your account and start your musical journey</p>
        </div>
      </div>

      <div className="basis-[40%] flex flex-col items-center justify-center h-full pl-10">
        <RegisterForm
          displayName={displayName}
          setDisplayName={setDisplayName}
          email={email}
          setEmail={setEmail}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          password={password}
          setPassword={setPassword}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default Register; 