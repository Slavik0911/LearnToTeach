import { useState } from 'react'

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