import { Center } from '@/components/ui/center';
import { Link } from '@/components/ui/link';
import React from 'react';

const StepTwo = () => {
  return (
    <Center className="flex-1">
      <Link href="/tabs/(wizardForm)/stepOne">Next</Link>
    </Center>
  );
};

export default StepTwo;
