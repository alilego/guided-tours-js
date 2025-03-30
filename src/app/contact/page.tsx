import Image from 'next/image';

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-indigo-800">
        <div className="absolute inset-0">
          <Image
            src="/images/contact-hero.jpg"
            alt="Contact us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-8 px-4 sm:py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Get in Touch
          </h1>
          <p className="mt-2 text-base text-indigo-100 max-w-3xl">
            Have questions about our tours? We're here to help! Contact us today and let's start planning your next adventure.
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-base font-medium text-gray-900">Email</h3>
              <p className="mt-1 text-sm text-gray-500">
                <a href="mailto:alexandra.drimba.s@gmail.com" className="text-indigo-600 hover:text-indigo-500">
                    alexandra.drimba.s@gmail.com
                </a>
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-base font-medium text-gray-900">Phone</h3>
              <p className="mt-1 text-sm text-gray-500">
                <a href="tel:+40752766279" className="text-indigo-600 hover:text-indigo-500">
                  +40 752 766 279
                </a>
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-base font-medium text-gray-900 text-center">Office Hours</h3>
              <p className="mt-1 text-sm text-gray-500 text-center">
                Monday - Friday: 11:00 AM - 6:00 PM<br />
                Saturday: 11:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            <span className="block">Ready to start your journey?</span>
            <span className="block text-indigo-600">Contact us today!</span>
          </h2>
          <div className="mt-4 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="tel:+40752766279"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
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