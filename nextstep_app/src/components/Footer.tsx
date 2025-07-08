"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="relative border-t border-gray-800 bg-primary">
      {/* Glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-6 md:mb-0"
          >
            <Link href="/" className="text-2xl font-bold">
                          <Image
                            src="/logo.png"
                            alt="NextStep-AI Logo"
                            width={250}
                            height={150}
                            className="inline-block mr-2"
                          />
            </Link>
          </motion.div>
          
          {/* Links */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex space-x-6 mb-6 md:mb-0"
          >
            <Link href="/github" className="text-gray-400 hover:text-secondary transition-colors duration-300">
              GitHub
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-secondary transition-colors duration-300">
              Contact
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-secondary transition-colors duration-300">
              Terms
            </Link>
          </motion.div>
          
          {/* Copyright */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-500 text-sm"
          >
            &copy; {new Date().getFullYear()} NextStep-AI. All rights reserved.
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer