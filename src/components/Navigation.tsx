'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                Guided Tours
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-indigo-500 hover:text-gray-700"
              >
                Home
              </Link>
              <Link
                href="/tours"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-indigo-500 hover:text-gray-700"
              >
                Tours
              </Link>
              <Link
                href="/bookings"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-indigo-500 hover:text-gray-700"
              >
                My Bookings
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-indigo-500 hover:text-gray-700"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-indigo-500 hover:text-gray-700"
              >
                Sign in
              </Link>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setIsOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 sm:hidden" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 pt-5 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <Link href="/" className="text-xl font-bold text-indigo-600">
                    Guided Tours
                  </Link>
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-2">
                  <nav className="bg-white px-4 py-3">
                    <div className="space-y-1">
                      <Link
                        href="/"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        onClick={() => setIsOpen(false)}
                      >
                        Home
                      </Link>
                      <Link
                        href="/tours"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        onClick={() => setIsOpen(false)}
                      >
                        Tours
                      </Link>
                      <Link
                        href="/bookings"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        onClick={() => setIsOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/contact"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        onClick={() => setIsOpen(false)}
                      >
                        Contact
                      </Link>
                    </div>
                  </nav>
                </div>
                <div className="mt-auto border-t border-gray-200 pt-4">
                  <div className="px-4">
                    <Link
                      href="/auth/signin"
                      className="block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-base font-medium text-white hover:bg-indigo-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </nav>
  );
} 