import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
          <div className="px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pb-56 lg:pt-48 xl:col-span-6">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Discover Romania with Expert Guides
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Experience authentic local culture, unforgettable history and adventures with our carefully curated tours and expert local guides. Start your journey today!
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a
                  href="/tours"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Browse Tours
                </a>
                <a href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
          <div className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
            <Image
              className="aspect-[3/2] w-full bg-gray-50 object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
              src="/parliament-married-kiss.jpg"
              alt="Palace of Parliament in Bucharest"
              width={2070}
              height={1380}
              priority
            />
          </div>
        </div>
      </div>

      {/* Featured Tours Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Tours</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Explore our most popular guided tours and start your next adventure.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Example Tour Cards - These will be dynamic in the future */}
            {[1, 2, 3].map((tour) => (
              <article key={tour} className="flex flex-col items-start">
                <div className="relative w-full">
                  <Image
                    src={`https://images.unsplash.com/photo-${tour === 1 ? '1507525428034-b723cf961d3e' : tour === 2 ? '1469474968028-56623f02e42e' : '1472214103451-9374bd1c798e'}?auto=format&fit=crop&w=800&h=600&q=80`}
                    alt={`Tour ${tour} preview`}
                    width={800}
                    height={600}
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time dateTime="2024-03-16" className="text-gray-500">
                      Available year-round
                    </time>
                    <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                      Cultural
                    </span>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <a href="/tours/1">
                        <span className="absolute inset-0" />
                        Example Tour {tour}
                      </a>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                      Experience the beauty and culture of this amazing destination with our expert local guides.
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
