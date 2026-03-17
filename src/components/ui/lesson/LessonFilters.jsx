import AgeLevelPicker from "@/components/ui/lesson/AgeLevelPicker";

export default function LessonFilters({ search, setSearch, age, setAge, level, setLevel }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
      <div className="space-y-4">
        <input
          type="text"
          className="w-full rounded-2xl bg-gray p-3 md:p-4 text-lg md:text-2xl text-black outline-none transition-all duration-300 hover:bg-lightblue/20 focus:bg-white focus:ring-2 focus:ring-lightblue"
          placeholder="Fruits and vegetables"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <AgeLevelPicker
          age={age}
          setAge={setAge}
          level={level}
          setLevel={setLevel}
          toggle={true}
        />
      </div>
    </div>
  );
}