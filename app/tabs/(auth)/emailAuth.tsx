import React from 'react';
import GenericAuth from './genericAuth';

const AuthWithEmail = () => {
  console.log('EmailAuth component rendered');
  return <GenericAuth authType="email" />;
};

export default AuthWithEmail;
