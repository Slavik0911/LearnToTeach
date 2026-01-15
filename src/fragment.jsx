import { useState } from 'react'
import './App.css'
import './index.css'

function Fragmant() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </>
  )
}

export default Fragmant
