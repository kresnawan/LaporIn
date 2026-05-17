import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { baseURL } from "../axios/axiosInstance";

export default function ReportItemImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-100 bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg border">
        Tidak ada gambar
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-100 overflow-hidden bg-gray-100 group">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((item, index) => (
          <div key={index} className="w-full h-full shrink-0">
            <img
              src={`${baseURL}/uploads/report/${item.image_url}`}
              alt={`Aduan-${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#4a7ce7] hover:bg-[#6493f8] text-white border border-gray-300 w-10 h-20 flex items-center justify-center shadow-md transition-all duration-200 active:scale-95"
            aria-label="Previous Slide"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
          </button>

          <button
            onClick={nextSlide}
            className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#4a7ce7] hover:bg-[#6493f8] text-white border border-gray-300 w-10 h-20 flex items-center justify-center shadow-md transition-all duration-200 active:scale-95"
            aria-label="Next Slide"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}