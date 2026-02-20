import { useState } from 'react'

// This page is used for displaying the details of a lesson
function LessonDetails() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        LessonDetails
      </h1>
    </>
  )
}

export default LessonDetails