'use client'

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState(false);
  const [channel, setChannel] = useState(false);
  const [thumbnail, setThumbnail] = useState(false);
  const [videoData, setVideoData] = useState(null);

  const handleDownload = async () => {
    if (!url.trim()) {
      alert("Por favor, insira um link válido");
      return;
    }

    const token = await getToken();
    if (!token) {
      alert("Não foi possível obter seu token.");
      return;
    }

    const fields = ["formats"];
    if (title) fields.push("title");
    if (channel) fields.push("channel");
    if (thumbnail) fields.push("thumbnail");

    if (fields.length === 0) {
      alert("Selecione pelo menos um campo.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/video/info?url=${encodeURIComponent(url)}&fields=${fields.join(",")}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error("Erro ao buscar os dados do vídeo.");
      }

      setVideoData(data.data);
    } catch (error) {
      console.error("Erro ao buscar vídeo:", error);
      alert("Erro ao buscar video");
    }
  };

  const getToken = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/generate-simple-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      const data = await response.json();
      if (data.success) {
        return data.data.access_token;
      } else {
        throw new Error("Erro ao obter token");
      }
    } catch (error) {
      console.error("Erro ao gerar token:", error);
      alert("Erro ao gerar token.");
      return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-red-500 mb-6 text-center">
        Baixe vídeos do YouTube
      </h1>

      {/* Entrada de URL */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <input
          type="text"
          placeholder="Cole o link do vídeo..."
          className="flex-1 p-3 border border-gray-600 bg-gray-800 rounded-lg text-white focus:outline-none focus:border-red-500"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleDownload}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
        >
          Buscar 
        </button>
      </div>

      {/* Opções de seleção */}
      <div className="mt-4 flex gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={title} onChange={(e) => setTitle(e.target.checked)} />
          Título
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={channel} onChange={(e) => setChannel(e.target.checked)} />
          Canal
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={thumbnail} onChange={(e) => setThumbnail(e.target.checked)} />
          Thumbnail
        </label>
      </div>

      {/* Exibição dos dados do vídeo */}
      {videoData && (
        <div className="bg-gray-800 p-6 mt-6 rounded-lg shadow-lg w-full max-w-lg">
          {/* Título do vídeo */}
          {videoData.title && <h2 className="text-xl font-bold mb-3">{videoData.title}</h2>}

          {/* Informações do canal */}
          {videoData.channel && (
            <div className="flex items-center gap-4">
              <img
                src={videoData.channel.photo_url}
                alt={`Foto do canal ${videoData.channel.name}`}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-lg font-medium">{videoData.channel.name}</p>
                <a
                  href={videoData.channel.channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  Visitar canal
                </a>
              </div>
            </div>
          )}

          {/* Thumbnail do vídeo */}
          {videoData.thumbnail && (
            <div className="mt-4">
              <img
                src={videoData.thumbnail.url}
                alt="Thumbnail do vídeo"
                className="rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Lista de formatos disponíveis */}
          {videoData.formats && (
            <div className="mt-4">
              <h3 className="font-semibold">Formatos disponíveis:</h3>
              <ul className="mt-2 space-y-2">
                {videoData.formats
                  .filter(format => format.hasAudio) // Apenas formatos com áudio
                  .map((format, index) => (
                    <li key={index} className="p-2 border border-gray-600 rounded-lg">
                      <a
                        href={format.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 font-medium"
                      >
                        {format.format} - {format.qualityVideo || format.qualityAudio}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
