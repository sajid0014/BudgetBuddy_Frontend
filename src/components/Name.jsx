import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import profile from '../api/profile';

const UserGreeting = ({ styles }) => {
  const [name, setName] = useState(null);

  useEffect(() => {
    const getName = async () => {
      try {
        const response = await profile();
        if (response.ok) {
          const tempName = await response.json();
          const fullname = tempName.firstName + " "+  tempName.lastName;
          setName(fullname);
          console.log('This is the name:', tempName);
        } else {
          const errorData = await response.json();
          console.log('Response failed:', errorData);
        }
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    };

    getName();
  }, []);

  return (
    <>
      <Text style={styles.name}>{name || 'Loading...'}</Text>
    </>
  );
};

export default UserGreeting;