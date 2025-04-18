/**
 * About Page
 * Provides information about the company, mission, and team.
 * Route: /about
 */

import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            About Us
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Locals. Friends. Storytellers. Explorers.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-3xl text-base leading-7 text-gray-700">
          <p className="mb-6">
            Welcome to our corner of the world — where history, landscapes, and friendships come together to offer you something more than just a tour. At <span className="font-bold italic">Steps & Stories</span>, we're not a corporation. We're a group of friends who love Romania — its culture, its nature, its stories — and we've built this platform to share it with you in the most personal and authentic way we could imagine.
          </p>
          
          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">Who We Are</h2>
          <p className="mt-4">
            We're locals who grew up wandering the cities and the Carpathians, exploring forgotten villages, cycling down little-known routes, and debating history and politics over a glass of wine. Among us, you'll find:
          </p>
          <ul className="mt-4 list-disc pl-6 space-y-2">
            <li><span className="font-semibold">Culture buffs</span> who can walk you through centuries of Romanian history and political twists</li>
            <li><span className="font-semibold">Photographers</span> who know how to capture memories that go beyond the postcard</li>
            <li><span className="font-semibold">Hikers, bikers, and trekkers</span> who live for trails and viewpoints only locals know</li>
            <li>And most importantly — <span className="font-semibold">friends</span> who believe that experiences are better when shared</li>
          </ul>
          
          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">What We Offer</h2>
          <p className="mt-4">
            We craft tours that reflect who we are — personal, flexible, and full of heart. Whether you're joining us for a walk through the capital or a medieval town, a photo-packed sunrise hike, or a spontaneous village detour, you'll always get more than a guide — you'll get a local's perspective.
          </p>
          <ul className="mt-4 list-disc pl-6 space-y-2">
            <li><span className="font-semibold">Tailored Experiences:</span> Our tours are shaped by our passions — and yours. Want to tweak something? Just ask.</li>
            <li><span className="font-semibold">Off-the-Beaten-Path Itineraries:</span> We go beyond the obvious.</li>
            <li><span className="font-semibold">No Scripts, No Touristy Nonsense:</span> Real conversations, local insights, and genuine hospitality.</li>
            <li><span className="font-semibold">Flexible & Open-Minded:</span> Tell us what you're curious about — we're always up for something new.</li>
            <li><span className="font-semibold">Passion-Driven:</span> We don't do this because we have to — we do it because we love connecting with people and discovering new ideas together.</li>
          </ul>
          
          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">Why We Do It</h2>
          <p className="mt-4">
            We believe Romania deserves to be seen with fresh eyes — not just as a checklist of landmarks, but as a living, breathing story. And we believe travelers deserve more than just to visit — they deserve to connect. With the land. With the people. With the stories that shaped them.
          </p>
          
          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">Join the Experience</h2>
          <p className="mt-4">
            We're not just offering tours. We're inviting you into our world — as guests, and hopefully, as new friends.
          </p>
          <p className="mt-4">
            So if you're ready to discover Romania in a way that's honest, flexible, and full of character — let's go.
          </p>
        </div>
      </div>
    </div>
  );
} 