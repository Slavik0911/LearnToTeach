import { useState } from 'react'
import StatCard from "@/components/ui/stats/StatCard";
import StatGrid from "@/components/ui/stats/StatGrid";

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      <div className="space-y-4">
        <h1 className="text-3xl">
          Ready-to-use ESL materials for teachers.
        </h1>
        <p className="text-gray-700">
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

    </>
  )
}

export default Home