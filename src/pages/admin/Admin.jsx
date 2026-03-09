import { useNavigate } from "react-router-dom";

// This page is only accessible to admins
export default function Admin() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Admin Page</h1>
      <p>Only accessible to admins.</p>

      <button className="bg-black text-white p-2 rounded" onClick={() => navigate("/addlesson")}>
        Add lesson
      </button>
    </div>
  );
}
