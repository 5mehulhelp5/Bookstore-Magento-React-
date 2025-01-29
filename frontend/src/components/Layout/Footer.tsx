import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <>
      <footer className="overflow-hidden py-16 pb-0 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex flex-wrap justify-between">
              {/* Logo Section */}
                        <Link to="/home" className="mx-4">
                            <img src="/images/logo.png" alt="Logo" className="h-28 w-28" />
                          </Link>

              {/* Quick Links Section */}
              <div className="w-full lg:w-1/6 sm:w-1/2 pb-8">
                <div>
                  <h4 className="font-normal text-lg pb-2 uppercase tracking-wider text-[#141414]">Quick Links</h4>
                  <ul className="space-y-2">
                    <li className="uppercase">
                      <Link to="/about" className="text-[#212529] hover:text-[#bb1b1e] transition-colors">About</Link>
                    </li>
                    <li className="uppercase">
                      <Link to="/products" className="text-[#212529] hover:text-[#bb1b1e] transition-colors">Shop</Link>
                    </li>
                    <li className="uppercase">
                      <Link to="/contact" className="text-[#212529] hover:text-[#bb1b1e] transition-colors">Contact</Link>
                    </li>
                    <li className="uppercase">
                      {isAuthenticated ? (
                        <Link to="/logout" className="text-[#212529] hover:text-[#bb1b1e] transition-colors">Logout</Link>
                      ) : (
                        <Link to="/login" className="text-[#212529] hover:text-[#bb1b1e] transition-colors">Sign-in</Link>
                      )}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="w-full lg:w-1/4 sm:w-1/2 pb-8">
                <div>
                  <h4 className="font-normal text-lg pb-2 uppercase tracking-wider text-[#141414]">Contact info</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-[#212529] hover:text-[#bb1b1e] transition-colors">
                        Abdulrahman Ahmed, Cairo, EGYPT
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-[#212529] hover:text-[#bb1b1e] transition-colors">
                        abdulrahmanahmed.github.io
                      </a>
                    </li>
                    <li>
                      <a href="mailto:iamabduahmed@gmail.com" className="text-[#212529] hover:text-[#bb1b1e] transition-colors">
                        iamabduahmed@gmail.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Social Info Section */}
              <div className="w-full lg:w-1/4 sm:w-1/2 pb-8">
                <div>
                  <h4 className="font-normal text-lg pb-2 uppercase tracking-wider text-[#141414]">Social info</h4>
                  <p className="pb-4 text-[#212529] text-lg font-light">You can follow us on our social platforms to get updates.</p>
                  <div className="social-links">
                    <ul className="flex space-x-8">
                      <li>
                        <a href="#" className="text-[#999999] hover:text-[#bb1b1e] transition-colors">
                          <Facebook className="w-5 h-5" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-[#999999] hover:text-[#bb1b1e] transition-colors">
                          <Instagram className="w-5 h-5" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-[#999999] hover:text-[#bb1b1e] transition-colors">
                          <Twitter className="w-5 h-5" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-[#999999] hover:text-[#bb1b1e] transition-colors">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-[#999999] hover:text-[#bb1b1e] transition-colors">
                          <Youtube className="w-5 h-5" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="border-[#999999]" />
        </div>
      </footer>
      
      {/* Footer Bottom */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full">
              <div className="text-center text-[#212529] my-4">
                <p>All rights reserved © Designed & Created by Abdulrahman Ahmed 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;