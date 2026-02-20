import { useState } from 'react'

// This page is used for displaying the details of a lesson
function LessonSearch() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        LessonsSearch 
      </h1>
    </>
  )
}

export default LessonSearch