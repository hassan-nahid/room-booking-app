import { Globe } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  AirCover
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Anti-discrimination
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Disability support
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Cancellation options
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Report neighborhood concern
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Hosting</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:underline">
                  Airbnb your home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  AirCover for Hosts
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Hosting resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Community forum
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Hosting responsibly
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Join a free Hosting class
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Airbnb</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:underline">
                  Newsroom
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  New features
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Investors
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Gift cards
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Airbnb.org emergency stays
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>© 2025 Airbnb, Inc.</span>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Sitemap
            </a>
            <a href="#" className="hover:underline">
              Company details
            </a>
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:underline">
              <Globe className="w-4 h-4" />
              <span>English (US)</span>
            </button>
            <button className="text-sm text-gray-600 hover:underline">$ USD</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
