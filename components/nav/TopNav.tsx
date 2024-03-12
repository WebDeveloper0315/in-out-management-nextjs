import Image from 'next/image';
import Link from 'next/link';
import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faInstagram,
  faGithub
} from '@fortawesome/free-brands-svg-icons';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/test' },
  { name: 'Contact', href: '/test' }
];

export default function Navbar() {
  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-8 lg:px-12">
            <div className="flex justify-between h-24">
              <div className="flex items-center">
                <span>
                  <Image
                    src="/logo.svg"
                    alt="Robin Vriens Logo"
                    width={55}
                    height={47}
                  />
                </span>

                <div className="hidden md:flex h-full pl-8">
                  {navigation.map(({ name, href }) => (
                    <Link href={href} key={name}>
                      <a className="inline-flex items-center px-8 py-2 font-medium rounded-md text-gray-400 hover:text-gray-700 duration-300">
                        <span>{name}</span>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex">
                <div className="flex items-center md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-600 duration-300">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-7 w-7" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-7 w-7" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="hidden md:flex items-center">
                  <Link href="/test">
                    <a className="inline-flex items-center px-8 py-2 font-medium rounded-md text-zinc-400 hover:text-zinc-600 duration-300">
                      <span>Sign In</span>
                    </a>
                  </Link>
                  <Link href="/test">
                    <a className="inline-flex items-center px-8 py-2 font-medium rounded-md text-white bg-gradient-to-r from-[#D9A94C] to-[#E136B8] shadow-rv shadow-red-500/50">
                      <span>Sign Up</span>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden border-t-2 border-zinc-200">
            <div className="px-10 py-8 space-y-8">
              {navigation.map(({ name, href }) => (
                <Link href={href} key={name}>
                  <Disclosure.Button
                    as="a"
                    className="group flex justify-between cursor-pointer"
                  >
                    <span className="text-zinc-600 font-medium group-hover:translate-x-2 duration-300">
                      {name}
                    </span>
                    <ChevronRightIcon className="text-zinc-400 group-hover:text-zinc-600 block h-7 w-7 duration-300" />
                  </Disclosure.Button>
                </Link>
              ))}

              <Link href="/test">
                <a className="group flex justify-between">
                  <span className="text-zinc-600 font-medium group-hover:translate-x-2 duration-300">
                    Sign In
                  </span>
                </a>
              </Link>

              <div className="py-6">
                <Link href="/test">
                  <a className="w-full inline-flex items-center justify-center px-8 py-2 font-medium rounded-md text-white bg-gradient-to-r from-[#D9A94C] to-[#E136B8] shadow-rv shadow-red-500/50">
                    <span>Sign Up</span>
                  </a>
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-6">
                <a
                  href="https://www.github.com/robinvriens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-2xl text-zinc-400 hover:text-zinc-600 duration-300"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
                <a
                  href="https://www.instagram.com/robinvriens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-2xl text-zinc-400 hover:text-zinc-600 duration-300"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                  href="https://www.twitter.com/robinvriens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-2xl text-zinc-400 hover:text-zinc-600 duration-300"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}