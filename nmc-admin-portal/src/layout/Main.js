import React from 'react'

const Main = ({ children }) =>{
  return (
    <main className="h-full overflow-y-auto">
      <div className="w-full grid px-6">{children}</div>
    </main>
  )
}

export default Main

