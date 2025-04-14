# TikTok Auto Swiper

A Chrome extension that automatically generates views on TikTok videos by simulating swipes between videos.

![TikTok Auto Swiper](https://i.imgur.com/PLACEHOLDER.png)

## 📋 Overview

TikTok Auto Swiper is a Chrome extension that automates the process of viewing TikTok videos by simulating swipes up and down between videos. This can be useful for content creators who want to test how their videos perform with increased view counts.

## ⚠️ Disclaimer

This extension is for educational purposes only. Using tools to artificially inflate view counts may violate TikTok's terms of service. Use at your own risk. The creator of this extension is not responsible for any consequences resulting from its use.

## ✨ Features

- Automatically swipes up and down between TikTok videos
- Customizable number of views to generate
- Adjustable delay between swipes
- Visual counter showing progress
- Works on TikTok mobile view in Chrome

## 🔧 Installation

### Method 1: Manual Installation (Developer Mode)

1. **Download the Code**
   - Clone this repository or download it as a ZIP file and extract it
   ```
   git clone https://github.com/your-username/tiktok-auto-swiper.git
   ```

2. **Prepare the Extension Files**
   - Make sure you have all these files in your folder:
     - `manifest.json`
     - `popup.html`
     - `popup.js`
     - `content.js`
   - Create an `images` folder and add icon files:
     - `icon16.png` (16x16 pixels)
     - `icon48.png` (48x48 pixels)
     - `icon128.png` (128x128 pixels)

3. **Load the Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" using the toggle in the top right corner
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

## 🚀 How to Use

### Important: Proper Setup for Targeting a Video

1. **Go to TikTok in Chrome**
   - Visit TikTok.com in your Chrome browser
   - Make sure you're using the mobile view for best results
     - You can toggle mobile view by pressing F12, then clicking the mobile device icon in the top left of the developer tools

2. **Navigate to the Target Video**
   - **IMPORTANT**: First go to the profile of the user who posted the video
   - Then click on the specific video you want to target
   - Make sure the video is fully loaded and playing

3. **Using the Extension**
   - Click on the TikTok Auto Swiper extension icon in your Chrome toolbar
   - Set the desired number of views to generate
   - Set the delay between swipes (in seconds)
     - Lower values = faster swiping (more views per minute)
     - Higher values = more reliable operation
   - Click "Start Swiping"
   - A counter will appear on the screen showing the current progress
   - You can stop the process at any time by clicking "Stop Swiping"

## 🔍 How It Works

The extension works by simulating the actions a user would take to view TikTok videos:

1. **Finding the Target**
   - When you start the extension, it identifies your current video as the target

2. **Swipe Simulation**
   - The extension uses multiple methods to simulate swipes:
     - Programmatic scrolling
     - Keyboard navigation events
     - Click simulation on navigation elements
     - Touch event simulation

3. **View Counting**
   - Each complete cycle (swipe up + swipe down) is counted as one view
   - The counter tracks progress toward your target view count

## 📁 Code Structure

The extension consists of three main files:

### manifest.json
Contains the extension configuration, permissions, and metadata.

### popup.html
The user interface for the extension, including:
- Input field for number of views
- Input field for delay time
- Start and stop buttons
- Status indicator

### popup.js
The main functionality of the extension:
- Handles user interactions
- Injects the swiping logic into the TikTok page
- Manages the view counting process

### content.js
Background script that:
- Detects TikTok's interface
- Communicates with the popup
- Provides environment information

## 🔧 Modifying the Code

### Adjusting Swipe Speed
To modify the minimum delay between swipes:
1. Open `popup.html`
2. Find the input field with id="delayTime"
3. Change the `min` attribute to your desired minimum delay
4. Note that very low values may cause performance issues

### Customizing the UI
To change the appearance of the extension:
1. Modify the CSS styles in `popup.html`
2. Replace the icon files in the `images` folder

## 📝 Technical Notes

- The extension uses multiple methods to simulate swipes for maximum compatibility
- The swipe simulation is designed to work with TikTok's mobile interface
- The extension stores its state using Chrome's storage API

## 🐛 Troubleshooting

- **Swiping Not Working**: Make sure you're using TikTok in mobile view
- **Counts But No Visible Swiping**: This is normal, the extension is still working
- **Extension Not Finding Videos**: Navigate to a specific user's profile, then click on a video
- **Extension Not Appearing**: Make sure it's installed correctly and enabled

## 🔄 Updates

Check back for updates or submit issues on GitHub if you encounter any problems.

---

Created for educational purposes only.