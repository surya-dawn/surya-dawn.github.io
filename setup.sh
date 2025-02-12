# Create and enter project directory
mkdir wallpaper-manager
cd wallpaper-manager

# Initialize git
git init

# Create necessary files
# Create these files with the code we made earlier:
# - WallpaperManager.jsx
# - index.html

# Create a README.md
echo "# Wallpaper Manager" > README.md

# Create .gitignore
echo "node_modules/" > .gitignore
echo ".DS_Store" >> .gitignore
echo "*.log" >> .gitignore

# Initialize npm and install dependencies
npm init -y
npm install --save-dev http-server
