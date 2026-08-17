import { Globe, Users, MessageCircle } from 'lucide-react';
// removed unused Link import

export function LandingFooter() {
  return (
    <footer className="bg-neutral-50 py-12 border-t border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-600 font-bold text-white">
                R
              </div>
              <span className="font-display text-xl font-bold text-neutral-900">
                RedBank
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-500">
              Your trusted partner for modern, intelligent, and secure financial
              management.
            </p>
            <div className="mt-6 flex gap-4 text-neutral-400">
              <a href="#" className="hover:text-primary-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <MessageCircle size={20} />
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                <span className="sr-only">GitHub</span>
                <Globe size={20} />
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Users size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Product</h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-500">
              <li>
                <a href="#" className="hover:text-primary-600">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600">
                  Resources
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-500">
              <li>
                <a href="#" className="hover:text-primary-600">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-neutral-200 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} RedBank Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
