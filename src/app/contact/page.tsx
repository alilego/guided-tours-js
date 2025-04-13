import Image from 'next/image';

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-emerald-800">
        <div className="absolute inset-0">
          <Image
            src="/images/contact-hero.jpg"
            alt="Contact us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-emerald-800 mix-blend-multiply" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mt-2 text-base text-emerald-100 max-w-3xl">
            Have questions about our tours? Want to customize an experience? We're here to help!
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Email</h3>
                <a href="mailto:alexandra.drimba.s@gmail.com" className="text-emerald-600 hover:text-emerald-500">
                  alexandra.drimba.s@gmail.com
                </a>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                <a href="tel:+40752766279" className="text-emerald-600 hover:text-emerald-500">
                  +40 752 766 279
                </a>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
            <span className="block text-emerald-600">Contact us today!</span>
            <p className="mt-2 text-sm text-gray-500">
              We'll get back to you as soon as possible.
            </p>
            <button
              type="submit"
              className="mt-4 w-full rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-emerald-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            <span className="block">Ready to start your journey?</span>
            <span className="block text-emerald-600">Contact us today!</span>
          </h2>
          <div className="mt-4 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="tel:+40752766279"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 