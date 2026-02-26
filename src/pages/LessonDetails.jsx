import { useState } from "react";
import { Bookmark } from "lucide-react";
import LevelBadge from "@/components/ui/general/LevelBadge";

// This page is used for displaying the details of a lesson
function LessonDetails() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = {
    title: "Fruits and vegatables",
    description:
      "This lesson helps students explore the colorful world of fruits and vegetables while building useful English vocabulary. Through engaging activities, pictures, and short speaking tasks, learners will practice naming different fruits and vegetables, describing their taste and color, and using them in simple conversations. The materials are designed to make learning fun, interactive, and practical — perfect for young learners or beginners.",
    age: "Children",
    level: "A2",
    topic: "Food",
    images: [
      "https://res.cloudinary.com/dfoe7fxgu/image/upload/v1771966254/d2a72ldveqtdbryx5omt.jpg",
      "https://res.cloudinary.com/dfoe7fxgu/image/upload/v1771965476/jl4jsfnpl5dvrrx6u12s.jpg",
      "https://res.cloudinary.com/dfoe7fxgu/image/upload/v1771965477/v3ni7cna3rvgdxa2x3ai.jpg",
      "https://res.cloudinary.com/dfoe7fxgu/image/upload/v1771965479/vz09dszgnajeaxnqmgxm.jpg",
    ],
    saved: 141,
  };

  const images = data.images ?? [];
  const safeIndex = Math.min(currentIndex, Math.max(images.length - 1, 0));
  const mainImg = images[safeIndex];

  return (
    <div className="grid grid-cols-[1.25fr_1fr] gap-10">
      <div className="w-full">
        <div className="bg-gray rounded-xl overflow-hidden h-[460px]">
          {mainImg ? (
            <img
              src={mainImg}
              alt="lesson"
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <div className="grid grid-cols-4 gap-6 mt-6">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`rounded-lg overflow-hidden aspect-[4/3] border-2 transition ${
                safeIndex === i ? "border-navy" : "border-transparent"
              }`}
              title={`Open image ${i + 1}`}
            >
              <img
                src={img}
                alt={`thumb-${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="relative pb-12">
        <h1 className="text-4xl font-medium">{data.title}</h1>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="bg-lightblue px-5 py-2 rounded-xl text-sm font-medium">
            {data.age}
          </span>

          <LevelBadge level={data.level} />

          <span className="text-3xl">#{String(data.topic).toUpperCase()}</span>
        </div>

        <p className="mt-6 text-xl leading-relaxed">{data.description}</p>

        <div className="absolute bottom-0 right-0 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-navy" />
          <span className="text-xl">{data.saved}</span>
        </div>
      </div>
    </div>
  );
}

export default LessonDetails;