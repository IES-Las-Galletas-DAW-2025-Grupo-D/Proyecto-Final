import { Link } from "react-router";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHome,
  FaUserPlus,
  FaDollarSign,
  FaInfoCircle,
} from "react-icons/fa";

export function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content border-t border-base-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-start md:justify-items-center w-full max-w-7xl">
        {/* Company Info */}
        <nav>
          <h3 className="footer-title">TimeWeaver</h3>
          <p className="w-full">
            {" "}
            {/* Added width for better wrapping */}
            Effortless task and project management for individuals and teams.
          </p>
          <p className="mt-4">
            © {new Date().getFullYear()} TimeWeaver Inc. All rights reserved.
          </p>
        </nav>

        {/* Contact Info */}
        <nav>
          <h4 className="footer-title">Contact</h4>
          <a className="link link-hover flex items-center gap-2">
            <FaEnvelope /> support@timeweaver.io
          </a>
          <a className="link link-hover flex items-center gap-2">
            <FaPhone /> ‪+34 912 345 678‬
          </a>
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt /> C/ Inventada 123, 28001 Madrid, Spain
          </p>
        </nav>

        {/* Navigation Links */}
        <nav>
          <h4 className="footer-title">Quick Links</h4>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="link link-hover flex items-center gap-2">
                <FaHome /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="link link-hover flex items-center gap-2"
              >
                <FaUserPlus /> Sign Up
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="link link-hover flex items-center gap-2"
              >
                <FaDollarSign /> Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="link link-hover flex items-center gap-2"
              >
                <FaInfoCircle /> About Us
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
