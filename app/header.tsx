import React from 'react';

export default function Header() {
  return (
    <header className="bg-red-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">You-Downloads</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#home" className="hover:text-gray-300">
                Video Downloader
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-gray-300">
                FAQ
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-gray-300">
                Contacts
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}