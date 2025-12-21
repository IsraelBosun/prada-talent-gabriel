'use client'
import { useRef } from 'react'
import Image from 'next/image'

const CARD_WIDTH = 420
const GAP = 24

export default function SpecializedTalents() {
  const sliderRef = useRef(null)

  const talents = [
    {
      title: "Finance & Accounting",
      description:
        "From accountants to finance officers, we source top candidates with in-demand skills and experience—and manage the entire hiring process for you.",
      image: "/images/tech.png",
    },
    {
      title: "Tech",
      description:
        "From software developers to AI engineers, we source top candidates with in-demand skills and experience—and manage the entire hiring process for you.",
      image: "/images/tech.png",
    },
    {
      title: "Creatives and Marketing",
      description:
        "From digital marketers to social media managers and designers, we source top candidates with in-demand skills and experience—and manage the entire hiring process for you.",
      image: "/images/creatives.png",
    },
    {
      title: "Admin and Customer Support",
      description:
        "From virtual assistants to customer support representatives, we source top candidates with in-demand skills and experience—and manage the entire hiring process for you.",
      image: "/images/creatives.png",
    },
  ]

  const scrollByAmount = (direction) => {
    if (!sliderRef.current) return
    sliderRef.current.scrollBy({
      left: direction === 'right'
        ? CARD_WIDTH + GAP
        : -(CARD_WIDTH + GAP),
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10 max-w-4xl">
          Add specialized ready-to-hire talents across every field to your organization
        </h2>

        {/* Carousel */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        >
{talents.map((talent, index) => (
  <div
    key={index}
    className="flex-shrink-0 w-[360px] lg:w-[420px]"
  >
    <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full hover:shadow-lg transition-shadow flex flex-col">

      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {talent.title}
      </h3>

      <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">
        {talent.description}
      </p>

      {/* Button + Image */}
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-end gap-4 mt-auto">

        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap sm:min-h-[42px] flex items-center justify-center">
          Learn more
        </button>

        <div className="w-[220px] sm:w-[190px] sm:ml-auto">
          <Image
            src={talent.image}
            alt={talent.title}
            width={400}
            height={250}
            className="rounded-lg object-cover"
          />
        </div>
      </div>

    </div>
  </div>
))}
        </div>

        {/* Navigation */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => scrollByAmount('left')}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            ←
          </button>
          <button
            onClick={() => scrollByAmount('right')}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
          >
            →
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
