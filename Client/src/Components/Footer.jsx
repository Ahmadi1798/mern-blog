import {
  Footer,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from 'flowbite-react';
import { BsGithub, BsTwitter } from 'react-icons/bs';

const FooterComponent = () => {
  return (
    <Footer
      container
      className="bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 border-t border-slate-200 dark:border-zinc-800 rounded-none shadow-inner transition-all duration-300"
    >
      <div className="w-full px-4 md:px-16">
        <div className="flex flex-col md:flex-row md:justify-between items-center py-8 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
              MERN Blog
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              © {new Date().getFullYear()} MERN Blog. All rights reserved.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 sm:gap-12">
            <div>
              <FooterTitle
                title="Quick Links"
                className="uppercase tracking-wide"
              />
              <FooterLinkGroup col>
                <FooterLink
                  href="/"
                  className="hover:text-teal-600 transition-colors duration-150"
                >
                  Home
                </FooterLink>
                <FooterLink
                  href="/about"
                  className="hover:text-teal-600 transition-colors duration-150"
                >
                  About
                </FooterLink>
                <FooterLink
                  href="/contact"
                  className="hover:text-teal-600 transition-colors duration-150"
                >
                  Contact
                </FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Legal" className="uppercase tracking-wide" />
              <FooterLinkGroup col>
                <FooterLink
                  href="#"
                  className="hover:text-teal-600 transition-colors duration-150"
                >
                  Privacy Policy
                </FooterLink>
                <FooterLink
                  href="#"
                  className="hover:text-teal-600 transition-colors duration-150"
                >
                  Terms &amp; Conditions
                </FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
            Built with ❤️ using MERN Stack
          </span>
          <div className="mt-4 sm:mt-0 flex space-x-6 justify-center">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-150"
              aria-label="GitHub"
            >
              <BsGithub size={20} />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-sky-400 transition-colors duration-150"
              aria-label="Twitter"
            >
              <BsTwitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
