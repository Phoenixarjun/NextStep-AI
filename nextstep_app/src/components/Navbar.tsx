"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'


const Navbar = () => {
  const [active, setActive] = useState('Home')
  const links = ['Home', 'Agents', 'Docs', 'About']

  return (
    <nav className="sticky top-0 z-50 bg-primary/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <Image
              src="/logo.png"
              alt="NextStep-AI Logo"
              width={250}
              height={150}
              className="inline-block mr-2"
            />
          </Link>

          <div className="hidden md:flex space-x-8">
            {links.map((link) => (
              <motion.div 
                key={link}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/${link.toLowerCase()}`}
                  className={`relative px-3 py-2 ${active === link ? 'text-secondary' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setActive(link)}
                >
                  {link}
                  {active === link && (
                    <motion.span
                      layoutId="underline"
                      className="absolute left-0 top-full h-0.5 w-full bg-secondary"
                      initial={false}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          <button className="md:hidden text-gray-300 hover:text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar