import { useEffect, useState } from "react"
import React from 'react'

export const Config = () => {

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

    const setSettingsConfig = () => {
        fetch("http://localhost:1575/settingsconfig/update", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "ConnString": connString,
                "Database": database,
                "Userid": userid,
                "Password": password
            })
        }).then(result => console.log(result))
            .catch(err => console.log(err))
    }
    return (
        <div>
            <header className="w-full h-[10rem] bg-red-400 py-5 flex flex-row justify-center items-center space-x-5">
                <input placeholder={connString} onChange={(e) => setConnString(e.target.value)} className="px-2 py-2 outline-none" />
                <input placeholder={database} onChange={(e) => setDatabase(e.target.value)} className="px-2 py-2 outline-none" />
                <input placeholder={userid} onChange={(e) => setUserid(e.target.value)} className="px-2 py-2 outline-none" />
                <input placeholder={password} onChange={(e) => setPassword(e.target.value)} className="px-2 py-2 outline-none" />
                <button onClick={() => setSettingsConfig()} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-400 hover:text-black text-white">Save Changes</button>
            </header>
        </div>
    )
}
