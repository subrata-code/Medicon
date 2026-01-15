import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Medicon</h3>
            <p className="text-sm">
              Connecting patients with qualified healthcare professionals.
              Making healthcare accessible and convenient for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/find-doctors"
                  className="hover:text-white transition-colors"
                >
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link
                  to="/loginDashboard"
                  className="hover:text-white transition-colors"
                >
                  Register as Patient
                </Link>
              </li>
              <li>
                <Link
                  to="/loginDashboard"
                  className="hover:text-white transition-colors"
                >
                  Join as Doctor
                </Link>
              </li>
              <li>
                <Link
                  to="https://github.com/Soumojit08/Medicon"
                  className="hover:text-white transition-colors"
                  target="_blank"
                >
                  Want to contribute?
                </Link>
              </li>
              <li>
                <Link
                  to="/buymeacoffee"
                  className="hover:text-white transition-colors"
                >
                  Buy us a Coffee
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91 7439932564</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>medicon2k25@gmail.com</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-6 w-6 mr-2" />
                <span>
                  National Highway 6, Banitabla, Uluberia, Howrah, West Bengal
                  711316
                </span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Soumojit08/Medicon"
                className="hover:text-white transition-colors"
                target="_blank"
              >
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <div className="flex justify-center items-center">
            <p className="mr-2 text-base font-semibold text-white ">
              Developed by :
            </p>
            <ul className="flex items-center gap-3">
              <li>
                <a
                  href="https://github.com/Soumojit08"
                  className="hover:text-white transition-colors"
                  target="_blank"
                >
                  Soumojit Banerjee
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/subrata-code"
                  className="hover:text-white transition-colors"
                  target="_blank"
                >
                  Subrata Bag
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Samiran2004"
                  className="hover:text-white transition-colors"
                  target="_blank"
                >
                  Samiran Samanta
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/SayanRik"
                  className="hover:text-white transition-colors"
                  target="_blank"
                >
                  Sayan Ghosh
                </a>
              </li>
            </ul>
          </div>
          <p>&copy; {new Date().getFullYear()} Medicon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
