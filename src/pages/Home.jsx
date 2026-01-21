import StatCard from "@/components/ui/stats/StatCard";
import StatGrid from "@/components/ui/stats/StatGrid";
import LessonCard from "@/components/ui/lesson/LessonCard";
import LessonGrid from "@/components/ui/lesson/LessonGrid";

function Home() {
  return (
    <div className="space-y-10">
      <div className="max-w-[90rem] mx-auto  grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      <div className="space-y-4">
        <h1 className="text-3xl">
          Ready-to-use ESL materials for teachers.
        </h1>
        <p className="text-xl">
          Our site offers a variety of ready-made lesson plans, speaking activities, and grammar games that are not only effective but also fun for A1-C1 students. With our materials, you can focus on what matters most - teaching your students. Explore our site now and discover how we can help enhance your teaching experience!
        </p>
      </div>
      
        <div className="justify-self-end w-full max-w-md">
          <StatGrid>
            <StatCard title="Lessons" value="300+" note="unique" route="/lessons" />
            <StatCard title="Tests" value="70+" note="to every topic" route="/tests" />
          </StatGrid>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto ">
        <LessonGrid>
          <LessonCard level="Flyers" topic="Fruits and Vegetables" description="In this lesson, students will learn vocabulary related to fruits and vegetables, practice describing their taste, color, and shape, and talk about healthy eating habits. Through interactive games and speaking activities, they will improve their pronunciation and confidence in everyday conversations." />
          <LessonCard level="Starters" topic="Animals" description="Students will learn animal names, sounds they make, habitats, and basic facts about different animals. They'll practice describing animals using adjectives and engage in role-play activities to build speaking skills." />
          <LessonCard level="Movers" topic="Family Members" description="This lesson focuses on family vocabulary including relatives' names, relationships, and family roles. Students will practice describing family members' characteristics and sharing information about their own families." />
          <LessonCard level="Starters" topic="Food Preferences" description="Students will learn to express likes and dislikes about food items. They'll practice asking questions about preferences and sharing opinions on various dishes." />
          <LessonCard level="Flyers" topic="Daily Routines" description="In this lesson, students will learn vocabulary related to daily activities and routines. They will practice using present simple tense to describe their own routines and ask about others' routines through interactive speaking exercises." />
        </LessonGrid>
      </div>
    </div>
  )
}

export default Home