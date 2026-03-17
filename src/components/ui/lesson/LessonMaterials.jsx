import { Lock } from "lucide-react";

// Component for displaying lesson materials download buttons OR buy button
// Shows buy button if lesson is premium and not purchased
// Shows materials if lesson is not premium OR purchased
export default function LessonMaterials({ lesson, isPurchased, onBuyLesson }) {
  // If lesson is premium and NOT purchased - show Get lesson button
  if (lesson.isPremium && !isPurchased) {
    return (
      <div className="mt-6 sm:mt-8">
        <button
          type="button"
          onClick={onBuyLesson}
          className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto rounded-2xl bg-yellow-500 px-6 py-3 text-lg sm:text-xl font-semibold text-gray-900 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg active:scale-[0.97]"
        >
          <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Get lesson</span>
        </button>
      </div>
    );
  }

  // Define available materials
  const materials = [
    {
      label: "Student's version",
      url: lesson.studentVersion || null,
    },
    {
      label: "Teacher's version",
      url: lesson.teacherVersion || null,
    },
    {
      label: "Online presentation",
      url: lesson.presentationUrl || null,
    },
    {
      label: "Worksheets",
      url: lesson.worksheetsUrl || null,
    },
  ];

  // Filter out materials that don't have URLs
  const availableMaterials = materials.filter(m => m.url);

  // Don't show section if no materials available
  if (availableMaterials.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 sm:mt-8">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Materials</h3>
      
      {/* Grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {availableMaterials.map((material, index) => (
          <MaterialButton
            key={index}
            label={material.label}
            url={material.url}
          />
        ))}
      </div>
    </div>
  );
}

// Individual material download button
function MaterialButton({ label, url }) {
  const handleClick = () => {
    if (url) {
      // Download file
      window.open(url, '_blank');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-navy px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base text-white transition-all duration-300 hover:opacity-95 active:scale-[0.99]"
    >
      <span className="font-medium">{label}</span>
    </button>
  );
}