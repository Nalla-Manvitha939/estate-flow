"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Heart,
  Maximize,
} from "lucide-react";

const properties = [
  {
    id: 1,
    title: "Modern Waterfront Villa",
    location: "Gold Coast, Australia",
    price: "$1,250,000",
    image: "/properties/property-1.jpg",
    beds: 4,
    baths: 3,
    area: "2,850 sq.ft",
    type: "For Sale",
  },
  {
    id: 2,
    title: "Luxury City Residence",
    location: "Melbourne, Australia",
    price: "$980,000",
    image: "/properties/property-2.jpg",
    beds: 3,
    baths: 2,
    area: "2,150 sq.ft",
    type: "For Sale",
  },
  {
    id: 3,
    title: "Contemporary Family Home",
    location: "Sydney, Australia",
    price: "$1,480,000",
    image: "/properties/property-3.jpg",
    beds: 5,
    baths: 4,
    area: "3,420 sq.ft",
    type: "For Sale",
  },
];

export default function FeaturedProperties() {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 bg-[#EEF5FC] px-6 pt-20 pb-12 lg:px-8 lg:pt-24 lg:pb-14"
    >
      <div className="mx-auto max-w-7xl">

        
        <div className="mb-12 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-3xl">

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-[#0B63F6]">
              Featured Properties
            </p>

            <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#06255C] sm:text-5xl lg:text-6xl">
              Discover Your Next
              <br />
              <span className="bg-gradient-to-r from-[#0B63F6] via-[#2F8CFF] to-[#4DA3FF] bg-clip-text text-transparent">
                Perfect Property
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#526A88]">
              Explore carefully selected properties from trusted owners and
              agents, all managed through the EstateFlow platform.
            </p>

          </div>

          
          <Link
            href="/properties"
            className="group flex w-fit shrink-0 items-center gap-3 rounded-xl border border-[#BFD9F7] bg-[#FFFFFF] px-6 py-4 text-sm font-semibold text-[#06255C] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2F8CFF] hover:shadow-lg hover:shadow-[#0B63F6]/10"
          >
            View All Properties

            <ArrowUpRight
              className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>

        
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

          {properties.map((property) => (
            <article
              key={property.id}
              className="group overflow-hidden rounded-3xl border border-[#D6E5F5] bg-[#FFFFFF] shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#8CBFFF] hover:shadow-2xl hover:shadow-[#0B63F6]/10"
            >

              
              <div className="relative h-[320px] overflow-hidden bg-[#DCEBFA]">

                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />

                
                <div className="absolute inset-0 bg-gradient-to-t from-[#03132B]/50 via-transparent to-transparent" />

                
                <div className="absolute left-5 top-5">
                  <span className="rounded-full bg-gradient-to-r from-[#0B63F6] to-[#2F8CFF] px-4 py-2 text-xs font-bold text-[#FFFFFF] shadow-lg shadow-[#06255C]/25">
                    {property.type}
                  </span>
                </div>

                
                <button
                  type="button"
                  aria-label={`Save ${property.title}`}
                  className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#D6E5F5] bg-[#FFFFFF]/95 text-[#526A88] shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-[#4DA3FF] hover:text-[#0B63F6]"
                >
                  <Heart className="h-5 w-5" />
                </button>

              </div>

              
              <div className="p-6">

                
                <p className="text-sm font-medium text-[#526A88]">
                  {property.location}
                </p>

                
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#06255C] transition-colors duration-300 group-hover:text-[#0B63F6]">
                  {property.title}
                </h3>

                
                <div className="mt-4">
                  <span className="text-3xl font-bold tracking-tight text-[#06255C]">
                    {property.price}
                  </span>
                </div>

                
                <div className="my-5 h-px bg-[#D6E5F5]" />

                
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#526A88]">

                  <div className="flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-[#0B63F6]" />
                    <span>{property.beds} Beds</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-[#0B63F6]" />
                    <span>{property.baths} Baths</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Maximize className="h-5 w-5 text-[#0B63F6]" />
                    <span>{property.area}</span>
                  </div>

                </div>

                
                <Link
                  href={`/properties/${property.id}`}
                  className="group/button mt-6 flex items-center justify-between rounded-xl border border-[#BFD9F7] px-5 py-4 text-sm font-bold text-[#06255C] transition-all duration-300 hover:border-[#2F8CFF] hover:bg-[#E7F2FF] hover:text-[#0B63F6]"
                >
                  View Property

                  <ArrowUpRight
                    className="h-5 w-5 transition-transform duration-300 group-hover/button:-translate-y-1 group-hover/button:translate-x-1"
                  />
                </Link>

              </div>
            </article>
          ))}

        </div>

        
        <div className="mt-10 flex flex-col items-center justify-center text-center">

          <div className="flex items-center gap-3">

            <span className="h-2.5 w-2.5 rounded-full bg-[#0B63F6]" />

            <span className="text-sm font-semibold text-[#06255C]">
              Trusted properties managed through EstateFlow
            </span>

          </div>

          <p className="mt-2 text-sm text-[#526A88]">
            Verified listings • Trusted owners • Smarter property management
          </p>

        </div>

      </div>
    </section>
  );
}