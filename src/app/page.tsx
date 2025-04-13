import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Discover Romania with Expert Guides
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Experience authentic local culture, unforgettable history and adventures with our carefully curated tours and expert local guides. Start your journey today!
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a
                  href="/tours"
                  className="inline-flex items-center rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  Browse Tours
                </a>
                <a href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="relative w-full">
              <Image
                className="w-full h-auto rounded-lg"
                src="/parliament-guided-tour-sunset.png"
                alt="Palace of Parliament in Bucharest"
                width={2070}
                height={1380}
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
