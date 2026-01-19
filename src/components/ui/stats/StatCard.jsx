import { Link } from "react-router-dom";

export default function StatCard({ title, value, note, route }) {
  return (
    <Link
      to={route}
      className="block rounded-2xl bg-blue-400 text-center hover:opacity-85 transition"
    >
      <button className="rounded-2xl bg-blue-400 p-4 text-center">
        <h3 className="text-3xl">{title}</h3>
        <div className="text-5xl my-4">{value}</div>
        <p className="text-2xl opacity-80">*{note}</p>
      </button>
    </Link>
  );
}
