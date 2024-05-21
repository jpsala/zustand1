import React from 'react';

interface HeaderProps {
  currentTime: string;
}

const Header: React.FC<HeaderProps> = ({ currentTime }) => {
  return (
    <header>
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl">My App</h1>
        <p className="text-lg">Current Time: {currentTime}</p>
      </div>
    </header>
  );
};

export default Header;
