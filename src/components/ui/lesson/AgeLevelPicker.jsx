const LEVELS = ["A0", "A1", "A2", "B1", "B2", "C1"];

const baseBtn =
  "text-2xl rounded-2xl p-4 w-full border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]";

function pickCls(isActive, hasError) {
  return [
    baseBtn,
    hasError ? "border-red-500" : "border-transparent",
    isActive
      ? "bg-lightblue shadow-md"
      : "bg-gray hover:bg-lightblue/70 hover:shadow-md",
  ].join(" ");
}

export default function AgeLevelPicker({
  age,
  setAge,
  level,
  setLevel,
  toggle = false,
  ageError = false,
  levelError = false,
}) {
  function handleAge(value) {
    setAge(toggle ? (prev) => (prev === value ? "all" : value) : value);
  }

  function handleLevel(value) {
    setLevel(toggle ? (prev) => (prev === value ? "all" : value) : value);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {["Children", "Adult"].map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => handleAge(a)}
            className={pickCls(age === a, ageError && !age)}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {LEVELS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => handleLevel(l)}
            className={pickCls(level === l, levelError && !level)}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}