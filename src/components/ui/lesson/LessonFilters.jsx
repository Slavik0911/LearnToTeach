const selectBtn =
  "text-2xl rounded-2xl p-4 w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]";

const pickBtn = (isActive) =>
  `${selectBtn} ${
    isActive
      ? "bg-lightblue shadow-md"
      : "bg-gray hover:bg-lightblue/70 hover:shadow-md"
  }`;

export default function LessonFilters({
  search,
  setSearch,
  age,
  setAge,
  level,
  setLevel,
}) {
  return (
    <div className="grid grid-cols-2 gap-10">
      <div className="space-y-4">
        <input
          type="text"
          className="w-full rounded-2xl bg-gray p-4 text-2xl text-black outline-none transition-all duration-300 hover:bg-lightblue/20 focus:bg-white focus:ring-2 focus:ring-lightblue"
          placeholder="Fruits and vegetables"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setAge((a) => (a === "Children" ? "all" : "Children"))}
            className={pickBtn(age === "Children")}
          >
            Children
          </button>

          <button
            type="button"
            onClick={() => setAge((a) => (a === "Adult" ? "all" : "Adult"))}
            className={pickBtn(age === "Adult")}
          >
            Adult
          </button>
        </div>

        <div className="grid grid-cols-6 gap-4">
          <button type="button" onClick={() => setLevel((l) => (l === "A0" ? "all" : "A0"))} className={pickBtn(level === "A0")}>A0</button>
          <button type="button" onClick={() => setLevel((l) => (l === "A1" ? "all" : "A1"))} className={pickBtn(level === "A1")}>A1</button>
          <button type="button" onClick={() => setLevel((l) => (l === "A2" ? "all" : "A2"))} className={pickBtn(level === "A2")}>A2</button>
          <button type="button" onClick={() => setLevel((l) => (l === "B1" ? "all" : "B1"))} className={pickBtn(level === "B1")}>B1</button>
          <button type="button" onClick={() => setLevel((l) => (l === "B2" ? "all" : "B2"))} className={pickBtn(level === "B2")}>B2</button>
          <button type="button" onClick={() => setLevel((l) => (l === "C1" ? "all" : "C1"))} className={pickBtn(level === "C1")}>C1</button>
        </div>
      </div>
    </div>
  );
}