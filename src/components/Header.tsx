import React from 'react';

const Header = () => (
  <header className="bg-transparent text-secondary p-4 md:flex md:justify-between md:items-center">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Logo</h1>
      <div className="md:hidden">
        {/* Here you can add a button for a dropdown menu when on mobile */}
      </div>
    </div>
    <nav className="hidden md:block space-x-10">
      <a href="#home" className="text-lg">Home</a>
      <a href="#about" className="text-lg">About</a>
      <a href="#contact" className="text-lg">Contact</a>
    </nav>
  </header>
);

export default Header;