import React from 'react'
import { Config } from "./components/Config";
import { Transfer } from "./components/Transfer";

export const App = () => {

  return (
    <div className="w-screen h-screen flex flex-col bg-stone-500">
      <Config />
      <Transfer />
    </div>
  )
}
