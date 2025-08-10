import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, User } from 'lucide-react';

const AdminContact: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-peacock-500/20 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-peacock-500 to-blue-500 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Contact</h2>
          <p className="text-peacock-300">Get in touch with the lab administrator</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-dark-700/30 rounded-lg border border-dark-600">
            <div className="p-2 bg-peacock-500/20 rounded-lg">
              <Mail className="w-6 h-6 text-peacock-400" />
            </div>
            <div>
              <p className="text-peacock-300 text-sm">Email</p>
              <p className="text-white font-medium">admin@issacasimov.in</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-dark-700/30 rounded-lg border border-dark-600">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Phone className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-peacock-300 text-sm">Phone</p>
              <p className="text-white font-medium">+91 9876543210</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-dark-700/30 rounded-lg border border-dark-600">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <MapPin className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-peacock-300 text-sm">Location</p>
              <p className="text-white font-medium">Isaac Asimov Robotics Laboratory</p>
              <p className="text-peacock-300 text-sm">Ground Floor, Engineering Block</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-dark-700/30 rounded-lg border border-dark-600">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-peacock-300 text-sm">Office Hours</p>
              <p className="text-white font-medium">Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p className="text-peacock-300 text-sm">Saturday: 9:00 AM - 1:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-peacock-500/10 border border-peacock-500/20 rounded-lg">
          <h3 className="text-peacock-400 font-semibold mb-2">Important Notes:</h3>
          <ul className="text-peacock-300 text-sm space-y-1">
            <li>• For urgent requests, please call during office hours</li>
            <li>• Email responses typically within 24 hours</li>
            <li>• Component pickup available during office hours</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminContact;