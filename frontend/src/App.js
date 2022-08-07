import { useEffect, useState } from "react"
import React from 'react'

export const App = () => {

  const [connString, setConnString] = useState("");
  const [database, setDatabase] = useState();
  const [userid, setUserid] = useState();
  const [password, setPassword] = useState();
  
  useEffect(() => {
    fetch("http://localhost:1575/settingsconfig", {
      method: "GET"
    }).then(result => result.json())
      .then(config => {
        setConnString(config.SQLConnection.ConnString)
        setDatabase(config.SQLConnection.Database)
        setUserid(config.SQLConnection.Userid)
        setPassword(config.SQLConnection.Password)
      })
      .catch(err => console.log(err))
  }, []);


  return (
    <div className="w-screen h-screen bg-stone-500">
      <header className="w-full h-[10rem] bg-red-400 py-5 flex flex-row justify-center items-center space-x-5">
        <input placeholder={connString} className="px-2 py-2 outline-none" />
        <input placeholder={database} className="px-2 py-2 outline-none" />
        <input placeholder={userid} className="px-2 py-2 outline-none" />
        <input placeholder={password} className="px-2 py-2 outline-none" />
        <button className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-400 hover:text-black text-white">Save Changes</button>
      </header>
    </div>
  )
}
