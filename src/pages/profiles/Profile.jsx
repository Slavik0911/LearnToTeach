import StatCard from "@/components/ui/stats/StatCard";
import StatGrid from "@/components/ui/stats/StatGrid";
import { BarChart } from "lucide-react";
import { Folder } from "lucide-react";
import ProfileSidebar from "@/components/ui/profile/ProfileSidebar";

// This page is used for displaying the user's profile
export default function Profile() {
    const folders = [
    { id: "andrew", title: "Andrew", value: 27 },
    { id: "slavik", title: "Slavik", value: 44 },
  ];
  return (
    <div className="grid grid-cols-[1fr_1.35fr] gap-6">
      {/* Left panel */}
      <ProfileSidebar
        name="Yaroslav Pylypiuk"
        email="yaroslavpylypiuk@gmail.com"
        onEditProfile={() => console.log("edit")}
        onOpenSettings={() => console.log("settings")}
        onUpgrade={() => console.log("upgrade")}
        onSignOut={() => console.log("sign out")}
        onDelete={() => console.log("delete")}
      />

      {/* Right panel (2 rows) */}
      <div className="grid grid-rows-2 gap-6">
        <div className="bg-gray-100 px-10 pb-10 pt-0 rounded-2xl">
          <h3 className="text-3xl mb-6 flex items-center gap-2">
            Overview <BarChart size={30} />
          </h3>

          <StatGrid cols={3}>
            <StatCard title="Favorite" value={27} note="" route="/favorites" />
            <StatCard title="Recently watched" value={35} note="" route="/recently-watched" />
            <StatCard title="Downloaded" value="81" note="" route="/downloaded" />
          </StatGrid>
        </div>

        <div className="bg-gray-100 px-10 pb-10 pt-0 rounded-2xl">
          <h3 className="text-3xl mb-6 flex items-center gap-2">
            Folders <Folder size={35} />
          </h3>

          <StatGrid cols={3}>
            {folders.map((f) => (
              <StatCard
                key={f.id}
                title={f.title}
                value={f.value}
                note=""
                route={`/folders/${f.id}`}
              />
            ))}

            <StatCard add note="" route="/folders/new" />
          </StatGrid>
        </div>
      </div>
    </div>
  );
}