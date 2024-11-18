import React, { useState } from 'react';
import { Play, Clock } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

const videos = [
  {
    id: 1,
    title: "Technique de brossage correcte",
    duration: "3:45",
    thumbnail: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80",
    views: "1.2k",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Replace with actual video URL
  },
  {
    id: 2,
    title: "Comment utiliser le fil dentaire",
    duration: "2:30",
    thumbnail: "https://images.unsplash.com/photo-1570357321498-e6900b8e5f8a?auto=format&fit=crop&q=80",
    views: "856",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Replace with actual video URL
  },
  {
    id: 3,
    title: "Guide du brossage pour enfants",
    duration: "4:15",
    thumbnail: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80",
    views: "2.1k",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Replace with actual video URL
  }
];

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  return (
    <div className="mb-20">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Vidéos Éducatives</h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
            <div className="relative group cursor-pointer" onClick={() => setSelectedVideo(video)}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <div className="bg-white rounded-full p-3 transform group-hover:scale-110 transition">
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded-md flex items-center">
                <Clock className="h-4 w-4 text-white mr-1" />
                <span className="text-white text-sm">{video.duration}</span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{video.title}</h4>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{video.views} vues</span>
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Regarder
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <VideoPlayer
          videoUrl={selectedVideo.videoUrl}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}