import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

type Testimonial = {
  name: string;
  text: string;
  rating: number;
};

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Alterna para o próximo depoimento a cada 5 segundos
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-[#00F2FF]/30 shadow-[0_0_15px_rgba(0,242,255,0.3)]">
      <div className="relative overflow-hidden">
        <div className="transition-all duration-500 ease-in-out">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center bg-[#0B3D91] rounded-full mb-3">
              <span className="text-2xl font-bold text-white">{testimonials[currentIndex].name.charAt(0)}</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-center">{testimonials[currentIndex].name}</h3>
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-5 h-5 text-yellow-400 fill-yellow-400" 
                />
              ))}
            </div>
            <p className="text-center text-[#e1e1e1] italic mb-3">"{testimonials[currentIndex].text}"</p>
            <div className="flex space-x-1 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-[#00F2FF] w-4' : 'bg-gray-500'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}