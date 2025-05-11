import React, { ReactNode } from 'react';

const AutoplaySlider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="logos relative overflow-hidden">
      <span className="logos-slide space-x-10 sm:space-x-20">{children}</span>
    </div>
  );
};

export default AutoplaySlider;
