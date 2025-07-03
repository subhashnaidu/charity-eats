import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 bg-gradient-to-br from-yellow-100 via-orange-100 to-blue-50">
        <Image
          src="/file.svg"
          alt="Charity Eats Logo"
          width={80}
          height={80}
          className="mb-4"
        />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-4">
          Charity Eats
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mb-6">
          Effortlessly manage your charity events, connect with vendors, and delight
          your supporters. Boost your cause's revenue with a seamless food ordering
          experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/auth"
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="px-6 py-3 bg-white border border-blue-600 text-blue-700 rounded-full font-semibold shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-blue-50">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-10">
          Why Choose Charity Eats?
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <Image
              src="/file.svg"
              alt="Event Management"
              width={40}
              height={40}
              className="mb-3"
            />
            <h3 className="font-semibold text-lg mb-2 text-blue-700">
              Effortless Event Management
            </h3>
            <p className="text-gray-600 text-center">
              Create, manage, and track charity events with just a few clicks. No
              technical skills required.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <Image
              src="/window.svg"
              alt="Vendor Marketplace"
              width={40}
              height={40}
              className="mb-3"
            />
            <h3 className="font-semibold text-lg mb-2 text-blue-700">
              Vendor Marketplace
            </h3>
            <p className="text-gray-600 text-center">
              Showcase a variety of vendors and products. Let supporters choose from
              the best local options.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <Image
              src="/globe.svg"
              alt="Customer Experience"
              width={40}
              height={40}
              className="mb-3"
            />
            <h3 className="font-semibold text-lg mb-2 text-blue-700">
              Easy for Customers
            </h3>
            <p className="text-gray-600 text-center">
              Mobile-first design makes ordering simple for everyone. No app download
              required.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <Image
              src="/globe.svg"
              alt="Increased Spending"
              width={40}
              height={40}
              className="mb-3"
            />
            <h3 className="font-semibold text-lg mb-2 text-blue-700">
              Increased Spending
            </h3>
            <p className="text-gray-600 text-center">
              Engaging UI and upsell features encourage higher order values, maximizing
              your fundraising.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <Image
              src="/globe.svg"
              alt="Real-Time Insights"
              width={40}
              height={40}
              className="mb-3"
            />
            <h3 className="font-semibold text-lg mb-2 text-blue-700">
              Real-Time Insights
            </h3>
            <p className="text-gray-600 text-center">
              Track sales, participation, and revenue in real time. Make data-driven
              decisions for your cause.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <Image
              src="/file.svg"
              alt="More Revenue"
              width={40}
              height={40}
              className="mb-3"
            />
            <h3 className="font-semibold text-lg mb-2 text-blue-700">
              More Revenue for Your Cause
            </h3>
            <p className="text-gray-600 text-center">
              Lower fees and optimized workflows mean more money goes directly to your
              charity.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-10">
          How It Works
        </h2>
        <ol className="max-w-3xl mx-auto space-y-8">
          <li className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-xl">
                1
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Set Up Your Event</h3>
              <p className="text-gray-600">
                Create a new charity event, invite vendors, and customize your event
                page in minutes.
              </p>
            </div>
          </li>
          <li className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-xl">
                2
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Vendors Add Menus</h3>
              <p className="text-gray-600">
                Vendors easily upload their products and manage orders from a simple
                dashboard.
              </p>
            </div>
          </li>
          <li className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-xl">
                3
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Customers Order & Support</h3>
              <p className="text-gray-600">
                Supporters browse, order, and pay online—no lines, no hassle. More
                orders, more impact!
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-blue-700 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Ready to make a difference?
        </h2>
        <p className="mb-8 text-lg">
          Join Charity Eats and start raising more for your cause today.
        </p>
        <a
          href="/auth"
          className="inline-block px-8 py-4 bg-white text-blue-700 font-bold rounded-full shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Get Started
        </a>
      </section>

      <footer className="py-6 text-center text-gray-500 text-sm bg-white border-t mt-auto">
        &copy; {new Date().getFullYear()} Charity Eats. All rights reserved.
      </footer>
    </main>
  );
}
