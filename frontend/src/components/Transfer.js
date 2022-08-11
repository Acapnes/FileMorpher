import React from 'react'
import { useEffect, useState } from "react"

export const Transfer = () => {

    const [paths, setPaths] = useState([]);
    const [fileTable, setFileTable] = useState("");
    const [folderName, setFolderName] = useState("");

    useEffect(() => {
        /// Backend de FileTable'ın hangi folder'a bağlı olduğu bilgisini çekip aktiflik durumunu kontrol ettimeli
        fetch("http://localhost:1575/paths", {
            method: "GET"
        }).then(result => result.json())
            .then(data => {
                console.log(data);
                setPaths(data);
            }).catch(err => console.log(err))
    }, []);


    return (
        <div className="flex flex-row space-x-4 px-10 py-20">
            <div className="flex flex-col w-full">
                <input readOnly={true} defaultValue="FileTables" className="px-2 py-2 outline-none border-2 border-red-500 text-center text-lg text-black" />
                {
                    paths.map((path, pathIndex) => (
                        <input key={pathIndex} defaultValue={path.FileTable} className="px-2 py-2 outline-none border-2 mt-1 border-gray-900 text-black" />
                    ))
                }

            </div>
            <div className="flex flex-col w-full">
                <input readOnly={true} defaultValue="FileTables" className="px-2 py-2 outline-none border-2 border-red-500 text-center text-lg text-black" />
                {
                    paths.map((path, pathIndex) => (
                        <input key={pathIndex} defaultValue={path.FolderName} className="px-2 py-2 outline-none border-2 mt-1 border-gray-900 text-black" />
                    ))
                }

            </div>
            <div className="flex flex-col w-1/12">
                <input readOnly={true} defaultValue="FileTables" className="px-2 py-2 outline-none border-2 border-red-500 text-center text-lg text-black" />
                {
                    paths.map((path, pathIndex) => (
                        <div className='flex flex-row px-2 py-2 h-[2.74rem] outline-none border-2 mt-1 space-x-3 border-gray-900 bg-white text-black'>
                            <input key={pathIndex} defaultValue={"Active"} className="w-full h-full outline-none " />
                            <input type={"checkbox"} checked={false} />
                        </div>

                    ))
                }

            </div>
        </div>
    )
}
