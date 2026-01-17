import { useState } from 'react'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Home
      </h1>
    </>
  )
}

export default Home