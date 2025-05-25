import { Link } from "react-router";

export function Footer() {
  return (
  <footer className="bg-base-200 text-neutral text-sm mt-24 border-t border-base-300">
    <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Company Info */}
      <div>
        <h3 className="text-lg font-bold mb-2">TimeWeaver</h3>
        <p>Effortless task and project management for individuals and teams.</p>
        <p className="mt-4">© {new Date().getFullYear()} TimeWeaver Inc. All rights reserved.</p>
      </div>

      {/* Contact Info */}
      <div>
        <h4 className="text-lg font-bold mb-2">Contact</h4>
        <p>Email: support@timeweaver.io</p>
        <p>Phone: +34 912 345 678</p>
        <p>Address: C/ Inventada 123, 28001 Madrid, Spain</p>
      </div>

      {/* Navigation Links */}
      <div>
        <h4 className="text-lg font-bold mb-2">Quick Links</h4>
        <ul className="space-y-1">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/signup" className="hover:underline">Sign Up</Link></li>
          <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
          <li><Link to="/about" className="hover:underline">About Us</Link></li>
        </ul>
      </div>
    </div>
  </footer>
  );
}
