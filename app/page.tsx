'use client'

import { useState } from "react";

interface VideoData {
  title: string;
  channel: {
    name: string;
    channel_url: string;
    photo_url: string;
  };
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  formats: Array<{
    format: string;
    qualityVideo?: string;
    qualityAudio?: string;
    hasAudio: boolean;
    url: string;
  }>;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState(false);
  const [channel, setChannel] = useState(false);
  const [thumbnail, setThumbnail] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);

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
      alert("Selecione pelo menos um campo (Título, Canal, Thumbnail).");
      return;
    }

    try {
      const response = await fetch(`https://thiagotardelli76-github-io.onrender.com/video/info?url=${encodeURIComponent(url)}&fields=${fields.join(",")}`, {
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

      console.log("Vídeo encontrado:", data.data);
      setVideoData(data.data);  // Atualiza o estado com os dados do vídeo
    } catch (error) {
      console.error("Erro ao buscar vídeo:", error);
      alert("Erro ao buscar os dados do vídeo.");
    }
  };

  const getToken = async () => {
    try {
      const response = await fetch("https://thiagotardelli76-github-io.onrender.com/auth/generate-simple-token", {
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
    <div className="grid grid-collums-[20px_4fr_20px] items-center justify-items-center p-10 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-roboto)]">
      <div className="flex gap-6 items-center flex-col sm:flex-collums">
        <p className="text-3xl text-center sm:text-left font-[family-name:var(--font-roboto)]">
          Faça o download de vídeos do YouTube
        </p>
        <h1>
          1. Insira o url do video
        </h1>
        <input
          type="text"
          placeholder="Cole seu link aqui"
          className="border border-transparent-300 focus:outline-none rounded px-4 py-2 sm:w-130"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <h2>
          2. Selecione o que deseja exibir
        </h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="title">Título</label>
            <input type="checkbox" id="title" checked={title} onChange={(e) => setTitle(e.target.checked)} />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="channel">Canal</label>
            <input type="checkbox" id="channel" checked={channel} onChange={(e) => setChannel(e.target.checked)} />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="thumbnail">Thumbnail</label>
            <input type="checkbox" id="thumbnail" checked={thumbnail} onChange={(e) => setThumbnail(e.target.checked)} />
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#ffffff] hover:border-[#ff0000] hover:text-[#ff0000] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          Buscar
        </button>
      </div>

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start mt:10">
        {videoData && (
          <div className="p-4 border border-gray-300 rounded-lg mt-6">
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
                    className="text-blue-500 underline"
                  >
                    Visitar canal
                  </a>
                </div>
              </div>
            )}

            {/* Exibir thumbnail do vídeo */}
            {videoData.thumbnail && (
              <div className="mt-4">
                <img
                  src={videoData.thumbnail.url}
                  alt="Thumbnail do vídeo"
                  className="rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Exibir formatos disponíveis */}
            {videoData.formats && (
              <div className="mt-4">
                <h3 className="font-semibold">Formatos disponíveis:</h3>
                <ul className="list-disc list-inside">
                  {videoData.formats
                    .filter(format => format.hasAudio) // Apenas formatos com áudio
                    .map((format, index) => (
                      <li key={index}>
                        <a
                          href={format.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
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
      </main>
    </div>
  );
}