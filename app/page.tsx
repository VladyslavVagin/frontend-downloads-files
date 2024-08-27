'use client';

import { useEffect, useState } from 'react';
import { FileData } from './types/file';

export default function Home() {
  const [files, setFiles] = useState<FileData[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}/file`)
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleClick = (fileName: string) => {
    setLoading(true);
    fetch(`${apiUrl}/file/${fileName}`)
      .then((res) => res.blob())
      .then((blob) => {
        // Create a new URL for the blob object
        const url = window.URL.createObjectURL(blob);
  
        // Create a link and click it to start the download
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
  
        // Revoke the URL to clean up memory
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  if(loading) return <h2 className='text-center font-semibold text-3xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>Loading...</h2>

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-5xl border border-gray-600 p-4 rounded-3xl shadow-md shadow-white mb-20">
        Download these files if you want:
      </h1>
      <ul className="flex flex-col items-start gap-6">
        {files.length > 0 &&
          files.map((file) => (
            <li
              key={file.name}
              onClick={() => handleClick(file.name)}
              className="cursor-pointer transition-colors duration-500 hover:text-blue-700"
            >
              <p className="text-xl">
                {file.name}{' '}
                <span className="text-sm text-black">({file.size})</span>
              </p>
              <span className="text-sm text-gray-600">
                Last changes: {new Date(file.lastModified).toLocaleString()}
              </span>
            </li>
          ))}
      </ul>
    </main>
  );
}
