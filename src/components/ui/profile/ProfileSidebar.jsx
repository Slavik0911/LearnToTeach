import { Settings, LogOut, Trash2, Crown, Pencil } from "lucide-react";

export default function ProfileSidebar({
  name = "Yaroslav Pylypiuk",
  email = "nataliababiuk@gmail.com",
  plan = "free",
  onEditProfile,
  onOpenSettings,
  onUpgrade,
  onSignOut,
  onDelete,
}) {
  return (
    <div className="space-y-8">
      {/* Profile card */}
      <div className="rounded-2xl bg-gray-100 p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-semibold truncate">{name}</h2>

              {plan === "pro" && (
                <span className="inline-flex items-center gap-2 rounded-full bg-lightblue px-4 py-1.5 text-base font-semibold">
                  <Crown size={20} />
                  PRO
                </span>
              )}
            </div>

            <p className="text-lg opacity-70 truncate mt-1">{email}</p>
          </div>

          <button
            type="button"
            onClick={onEditProfile}
            className="rounded-xl bg-white/70 p-3 hover:bg-white transition"
            title="Edit profile"
          >
            <Pencil size={22} />
          </button>
        </div>
      </div>

      {/* Actions card */}
      <div className="rounded-2xl bg-gray-100 p-3">
        <ActionRow icon={<Settings size={24} />} label="Settings" onClick={onOpenSettings} />
        {plan !== "pro" && (
          <ActionRow icon={<Crown size={24} />} label="Upgrade to PRO" onClick={onUpgrade} />
        )}

        <div className="my-3 h-px bg-black/10" />

        <ActionRow icon={<LogOut size={24} />} label="Sign out" onClick={onSignOut} />
        <ActionRow
          icon={<Trash2 size={24} />}
          label="Delete account"
          onClick={onDelete}
          danger
        />
      </div>
    </div>
  );
}

function ActionRow({ icon, label, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition
        ${danger ? "hover:bg-red-500/10" : "hover:bg-black/5"}
      `}
    >
      <span className={`${danger ? "text-red-600" : "text-black/80"}`}>
        {icon}
      </span>

      <span className={`text-xl ${danger ? "text-red-600" : ""}`}>
        {label}
      </span>
    </button>
  );
}