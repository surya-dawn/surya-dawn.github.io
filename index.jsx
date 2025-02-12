import React, { useState } from 'react';

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" />
    <line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" />
    <line x1="4" y1="18" x2="20" y2="18" strokeWidth="2" />
  </svg>
);

const WallpaperIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 2h16v16H2z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 14l4-4 10 10" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="14" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 3v2M10 15v2M3 10H5M15 10h2M4.5 4.5l1.4 1.4M14.1 14.1l1.4 1.4M4.5 15.5l1.4-1.4M14.1 5.9l1.4-1.4" 
      stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const WallpaperManager = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showWallpaperSelect, setShowWallpaperSelect] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState(0);
  const [changing, setChanging] = useState(false);

  const wallpapers = [
    { id: 0, style: "bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900" },
    { id: 1, style: "bg-gradient-to-r from-blue-500 to-blue-300" },
    { id: 2, style: "bg-gradient-to-br from-orange-100 to-yellow-100" },
    { id: 3, style: "bg-gradient-to-r from-purple-600 to-pink-500" }
  ];

  const handleWallpaperChange = (index) => {
    setChanging(true);
    setShowWallpaperSelect(false);
    setShowMenu(false);
    setTimeout(() => {
      setCurrentWallpaper(index);
      setChanging(false);
    }, 1500);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      <div className={`w-full h-full relative transition-all duration-500 ${wallpapers[currentWallpaper].style}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <span className="text-xl font-normal opacity-95 mb-1">Monday 9 January</span>
          <span className="text-7xl font-medium tracking-wider">15:16:45</span>
        </div>
      </div>

      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="absolute top-6 right-6 text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
      >
        <MenuIcon />
      </button>

      {showMenu && (
        <div className="absolute top-0 right-0 w-80 h-full bg-[#1c1c1e]/95 text-white backdrop-blur-sm p-6">
          <h2 className="text-2xl font-medium mb-8">Controls</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <WallpaperIcon />
              <button 
                onClick={() => setShowWallpaperSelect(true)}
                className="px-4 py-1.5 text-sm text-white/90 hover:bg-white/10 rounded-md transition-colors"
              >Change</button>
            </div>
          </div>
        </div>
      )}

      {changing && (
        <div className="absolute inset-0 bg-[#1c1c1e] flex flex-col items-center justify-center text-white">
          <h2 className="text-2xl font-medium mb-2">Changing Wallpaper...</h2>
        </div>
      )}

      {showWallpaperSelect && (
        <div className="absolute bottom-6 inset-x-0 px-4">
          <div className="flex justify-center items-center gap-3">
            {wallpapers.map((wallpaper, index) => (
              <button
                key={wallpaper.id}
                onClick={() => handleWallpaperChange(index)}
                className={`relative w-24 h-14 rounded-xl overflow-hidden ${
                  currentWallpaper === index ? 'ring-2 ring-white' : ''
                }`}
              >
                <div className={`w-full h-full ${wallpaper.style}`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WallpaperManager;
