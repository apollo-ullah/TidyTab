import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">TidyTab</span>
            </Link>
          </div>

          <div className="flex items-center">
            <Menu as="div" className="ml-3 relative">
              <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                {user.photoURL ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.photoURL}
                    alt={user.displayName || 'User profile'}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-medium">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-gray-500 truncate">{user.email}</p>
                  </div>

                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block px-4 py-2 text-sm text-gray-700`}
                      >
                        My Tabs
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={signOut}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                      >
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}; 