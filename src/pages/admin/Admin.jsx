import { useNavigate } from "react-router-dom";

// This page is only accessible to admins
export default function Admin() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => navigate("/addlesson")}
                    className="rounded-2xl bg-navy px-5 py-3 text-2xl text-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg active:scale-[0.97]"
                >
                    + Add lessons
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/search")}
                    className="rounded-2xl bg-navy px-5 py-3 text-2xl text-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg active:scale-[0.97]"
                >
                    All lessons
                </button>
            </div>
        </div>
    );
}
