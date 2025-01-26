'use client';

import { ActiveLink } from './active-link';
import { Menu, X } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Button
} from '@heroui/react';

const navigationItems = [
  { href: '/create', label: 'Create' },
  { href: '/generate', label: 'Generate' },
  { href: '/list', label: 'List' },
];

export function NavigationSidebar() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <button
        onClick={onOpen}
        className="fixed top-4 left-4 p-2 text-gray-300 hover:text-white z-50"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <Drawer 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        placement="left" 
        size="sm"
        backdrop='blur'
        closeButton={
          <Button 
            isIconOnly
            variant="light" 
            onPress={onClose}
            className="text-gray-300 hover:text-white"
          >
            <X size={20} />
          </Button>
        }
      >
        <DrawerContent className="bg-gray-800">
          {(_) => (
            <>
              <DrawerHeader className="flex justify-between items-center border-b border-gray-800">
                <h2 className="text-xl font-semibold text-white">Navigation</h2>
              </DrawerHeader>
              <DrawerBody>
                <nav>
                  <ul className="space-y-2">
                    {navigationItems.map((item) => (
                      <li key={item.href}>
                        <ActiveLink href={item.href}>
                          <button className="w-full h-full" type="button" onClick={onClose}>
                            {item.label}
                          </button>
                        </ActiveLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
} 