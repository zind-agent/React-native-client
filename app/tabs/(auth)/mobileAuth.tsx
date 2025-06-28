import React from 'react';
import GenericAuth from './genericAuth';

const AuthWithPhoneNumber = () => {
  console.log('MobileAuth component rendered');
  return <GenericAuth authType="phone" />;
};

export default AuthWithPhoneNumber;
