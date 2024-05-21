import React from 'react';

interface FooterProps {
  currentTime: string;
}

const Footer: React.FC<FooterProps> = ({ currentTime }) => {
  return (
    <footer>
      <div className="container mx-auto flex justify-end items-center px-4">
        <p className="text-lg">Current Time: {currentTime}</p>
      </div>
    </footer>
  );
};

export default Footer;
