// WallpaperManager.jsx
import React, { useState } from 'react';

// Icons as separate components that work in both environments
export const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" />
    <line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" />
    <line x1="4" y1="18" x2="20" y2="18" strokeWidth="2" />
  </svg>
);

export const WallpaperIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 2h16v16H2z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 14l4-4 10 10" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="14" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 3v2M10 15v2M3 10H5M15 10h2M4.5 4.5l1.4 1.4M14.1 14.1l1.4 1.4M4.5 15.5l1.4-1.4M14.1 5.9l1.4-1.4" 
      stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// Wallpaper data that can be imported or used directly
export const wallpaperData = [
  {
    id: 0,
    src: "/api/placeholder/400/320",  // Fantasy nighttime bridge with lanterns
    style: "bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900"
  },
  {
    id: 1,
    src: "/api/placeholder/400/320",  // Daytime clouds
    style: "bg-gradient-to-r from-blue-500 to-blue-300"
  },
  {
    id: 2,
    src: "/api/placeholder/400/320",  // Minimal beige landscape
    style: "bg-gradient-to-br from-orange-100 to-yellow-100"
  },
  {
    id: 3,
    src: "/api/placeholder/400/320",  // Purple sunset lake
    style: "bg-gradient-to-r from-purple-600 to-pink-500"
  }
];

const WallpaperManager = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showWallpaperSelect, setShowWallpaperSelect] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState(0);
  const [changing, setChanging] = useState(false);

  const handleWallpaperChange = (index) => {
    setChanging(true);
    setShowWallpaperSelect(false);
    setShowMenu(false);
    setTimeout(() => {
      setCurrentWallpaper(index);
      setChanging(false);
    }, 1500);
  };

  const handleChangeClick = () => {
    setShowWallpaperSelect(true);
    setShowMenu(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      {/* Main Display */}
      <div className={`w-full h-full relative transition-all duration-500 ${wallpaperData[currentWallpaper].style}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <span className="text-xl font-normal opacity-95 mb-1">Monday 9 January</span>
          <span className="text-7xl font-medium tracking-wider">15:16:45</span>
        </div>
      </div>

      {/* Menu Button */}
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="absolute top-6 right-6 text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
      >
        <MenuIcon />
      </button>

      {/* Menu Panel */}
      {showMenu && (
        <div className="absolute top-0 right-0 w-80 h-full bg-[#1c1c1e]/95 text-white backdrop-blur-sm">
          <div className="p-6">
            <h2 className="text-2xl font-medium mb-8">Controls</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <WallpaperIcon />
                  <span className="text-[17px]">Wallpaper</span>
                </div>
                <button 
                  onClick={handleChangeClick}
                  className="px-4 py-1.5 text-sm text-white/90 hover:bg-white/10 rounded-md transition-colors"
                >
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SunIcon />
                  <span className="text-[17px]">Light Mode</span>
                </div>
                <div className="w-11 h-6 bg-[#343434] rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all" />
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <button className="w-full text-left text-[17px] py-1 flex justify-between items-center">
                Apps
                <svg className="w-4 h-4 rotate-0" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                  <path d="M4 6l4 4 4-4" strokeWidth="1.5" />
                </svg>
              </button>
              <button className="w-full text-left text-[17px] py-1 flex justify-between items-center">
                Folder
                <svg className="w-4 h-4 rotate-0" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                  <path d="M4 6l4 4 4-4" strokeWidth="1.5" />
                </svg>
              </button>
              <button className="w-full text-left text-[17px] py-1">Settings</button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {changing && (
        <div className="absolute inset-0 bg-[#1c1c1e] flex flex-col items-center justify-center text-white">
          <h2 className="text-2xl font-medium mb-2">Currently Changing Wallpapers</h2>
          <p className="text-base text-white/80">This will only take a moment..</p>
        </div>
      )}

      {/* Wallpaper Selection */}
      {showWallpaperSelect && (
        <div className="absolute bottom-6 inset-x-0 px-4">
          <div className="flex justify-center items-center gap-3">
            {wallpaperData.map((wallpaper, index) => (
              <button
                key={wallpaper.id}
                onClick={() => handleWallpaperChange(index)}
                className={`relative w-24 h-14 rounded-xl overflow-hidden ${
                  currentWallpaper === index ? 'ring-2 ring-white' : ''
                }`}
              >
                <div className={`w-full h-full ${wallpaper.style}`} />
                {currentWallpaper === index && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="black">
                        <path d="M4 8l3 3 5-5" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
            <button className="w-14 h-14 bg-black/30 rounded-xl flex items-center justify-center text-white text-2xl backdrop-blur-sm">
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WallpaperManager;
