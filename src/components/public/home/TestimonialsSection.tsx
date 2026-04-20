"use client";
import { useState, useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";
import type { z } from "zod";
import type { TestimonialSchema } from "@/app/admin/settings/schema";

type Testimonial = z.infer<typeof TestimonialSchema>;

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  if (testimonials.length === 0) {
    return null;
  }

  const [current, setCurrent] = useState(0);

  // Auto-advance every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const testimonial = testimonials[current];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <SectionTitle>Testimonials</SectionTitle>

      {/* Carousel */}
      <div className="relative bg-black text-white rounded-2xl p-8 md:p-12 min-h-64 flex flex-col justify-between">
        {/* Quote Text */}
        <blockquote className="text-xl md:text-2xl leading-relaxed italic">
          "{testimonial.text}"
        </blockquote>

        {/* Author */}
        <div className="mt-6">
          <p className="font-bold text-base">{testimonial.author}</p>
          {(testimonial.role || testimonial.company) && (
            <p className="text-sm opacity-80">
              {testimonial.role}
              {testimonial.role && testimonial.company && " • "}
              {testimonial.company}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={() =>
              setCurrent(
                (prev) =>
                  (prev - 1 + testimonials.length) % testimonials.length
              )
            }
            className="w-10 h-10 rounded-full border border-white/30 hover:border-white flex items-center justify-center text-white transition"
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <button
            onClick={() =>
              setCurrent((prev) => (prev + 1) % testimonials.length)
            }
            className="w-10 h-10 rounded-full border border-white/30 hover:border-white flex items-center justify-center text-white transition"
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition ${
                i === current ? "bg-white" : "bg-white/30"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
