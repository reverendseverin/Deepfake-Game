# Deepfake Detective - AI Image Detection Game

🎮 **[Play Live Demo](https://reverendseverin.github.io/Deepfake-Game)** 🎮

An interactive touch-friendly game designed for iPad kiosks where players compete to identify AI-generated images from real ones.

## 🌐 Live Demo

The game is deployed and accessible at: **https://reverendseverin.github.io/Deepfake-Game**

## 🎮 Game Features

- **10 Challenging Questions**: Players face 10 rounds of real vs AI image pairs
- **Time Pressure**: 10-second timer per question with score bonuses for speed
- **Lives System**: 3 lives - lose one for each wrong answer or timeout
- **Dynamic Scoring**: Points based on response time (faster = more points)
- **Real-time Leaderboard**: Firebase integration for live scoreboards
- **Touch-Optimized**: Designed specifically for iPad kiosk interfaces
- **Offline Support**: Works without internet using localStorage fallback

## 🎯 Game Mechanics

### Scoring System
- **Millisecond Precision**: Score = remaining milliseconds ÷ 100
- **Example**: 8.301 seconds remaining = 8301ms ÷ 100 = 83 points
- **Example**: 6.428 seconds remaining = 6428ms ÷ 100 = 64 points  
- **Fast Response**: Under 1 second = 90+ points (9000+ms remaining)
- **Maximum Score**: 100 points (instant response)
- **Wrong Answer**: 0 points and lose a life

### Lives System
- Start with 3 lives (❤️❤️❤️)
- Lose a life for wrong answers
- Lose a life for timeouts
- Game ends when all lives are lost

### Image Selection
- 30 image pairs in the bank
- 10 pairs randomly selected per game
- Each pair contains one real and one AI-generated image
- Images presented in random order

## 🖥️ Technical Setup

### File Structure
```
deepfake_game/
├── index.html          # Main game interface
├── style.css           # Artistic styling and animations
├── script.js           # Game logic and Firebase integration
├── sw.js              # Service worker for offline support
├── FIREBASE_SETUP.md   # Firebase configuration guide
├── README.md          # This file
└── images/            # Image pairs folder
    ├── 1_real.jpg     # Real image from pair 1
    ├── 1_ai.jpg       # AI image from pair 1
    ├── 2_real.jpg     # Real image from pair 2
    ├── 2_ai.jpg       # AI image from pair 2
    └── ...            # Up to 30 pairs
```

### Image Requirements
- **Naming Convention**: `{number}_real.jpg` and `{number}_ai.jpg`
- **Pairs**: 30 total pairs (numbered 1-30)
- **Format**: JPG, PNG, or SVG
- **Size**: 512x512 pixels recommended
- **Quality**: High resolution for clear display

## 🚀 Deployment to GitHub Pages

This project is set up for automatic deployment to GitHub Pages using GitHub Actions.

### Quick Deployment Steps

1. **Create GitHub Repository**
   ```bash
   # Navigate to your project folder
   cd deepfake_game
   
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial commit: Deepfake Detective game"
   ```

2. **Push to GitHub**
   ```bash
   # Add your GitHub repository as origin
   git remote add origin https://github.com/reverendseverin/Deepfake-Game.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Source", select "GitHub Actions"
   - The deployment workflow will automatically run

4. **Access Your Game**
   - Your game will be available at: `https://reverendseverin.github.io/Deepfake-Game`
   - Updates to the main branch will automatically redeploy

### Alternative Deployment Methods

#### Option A: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

#### Option B: Local Development Server
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

#### Option C: Direct File Access
Open `index.html` in a web browser (limited functionality)

## 🎯 Getting Started

### 1. Set Up Images
1. Add 30 pairs of images to the `images/` folder
2. Follow the naming convention: `1_real.jpg`, `1_ai.jpg`, etc.
3. Ensure high quality and challenging AI vs real distinctions

### 2. Configure Firebase (Optional)
1. Follow the instructions in `FIREBASE_SETUP.md`
2. Replace the Firebase config in `script.js`
3. Set up Realtime Database rules for security

## 🎨 Design Features

### Visual Design
- **Gradient Backgrounds**: Artistic color gradients throughout
- **Glass Morphism**: Modern frosted glass UI elements
- **Animations**: Smooth transitions and hover effects
- **Typography**: Orbitron and Space Grotesk fonts for futuristic feel

### Touch Interactions
- **Large Touch Targets**: Optimized for finger navigation
- **Visual Feedback**: Immediate response to touches
- **Prevent Zoom**: Disabled double-tap zoom for kiosk use
- **Hover States**: Enhanced for touch devices

### Responsive Design
- **iPad Optimized**: Perfect for 1024x768 and similar resolutions
- **Orientation Support**: Works in landscape and portrait
- **Scalable**: Adapts to different screen sizes

## 🛠️ Customization

### Styling
Edit `style.css` to customize:
- Colors and gradients
- Fonts and typography
- Animation speeds
- Layout dimensions

### Game Logic
Modify `script.js` to adjust:
- Timer duration (currently 10 seconds)
- Number of lives (currently 3)
- Scoring formula
- Number of questions (currently 10)

### Content
Update image content:
- Add more image pairs (up to 30)
- Change image categories
- Adjust difficulty levels

## 📱 Kiosk Setup

### iPad Configuration
1. **Guided Access**: Enable in Settings > Accessibility
2. **Auto-Lock**: Set to "Never" in Settings > Display & Brightness
3. **Safari Settings**: Disable tabs, enable full screen
4. **Home Screen**: Add as web app for full-screen experience

### Browser Recommendations
- **Safari** (iOS): Best performance and touch support
- **Chrome** (Android): Good alternative with solid performance
- **Edge/Chrome** (Windows): For Windows-based kiosks

### Security Considerations
- Use kiosk mode browsers
- Disable navigation bars
- Lock device orientation
- Monitor Firebase usage and costs

## 🔧 Troubleshooting

### Common Issues

**Images not loading:**
- Check file names match the convention exactly
- Verify image files are in the correct folder
- Ensure file extensions are correct

**Firebase not working:**
- Verify configuration in `script.js`
- Check Firebase console for errors
- Confirm database rules allow writes

**Touch not responsive:**
- Clear browser cache
- Check for JavaScript errors in console
- Verify CSS touch styles are loading

**Performance issues:**
- Optimize image file sizes
- Enable image preloading
- Use appropriate image formats

## 📊 Analytics & Monitoring

### Metrics to Track
- Game completion rates
- Average scores
- Most difficult image pairs
- User engagement time
- Error rates

### Firebase Analytics
Enable Google Analytics in Firebase for:
- User behavior tracking
- Performance monitoring
- Error reporting
- Usage statistics

## 🔄 Updates & Maintenance

### Image Updates
1. Replace images in the `images/` folder
2. Maintain naming convention
3. Clear browser cache for updates
4. Test new images for difficulty balance

### Code Updates
1. Update version number in `sw.js`
2. Test on target devices
3. Monitor error logs
4. Update Firebase rules as needed

## 📄 License

This project is designed for educational and entertainment purposes. Ensure you have proper rights for all images used in production.

## 🤝 Contributing

To contribute to this project:
1. Test the game thoroughly
2. Suggest image content improvements
3. Report bugs and performance issues
4. Propose new features or enhancements

## 📞 Support

For technical support:
1. Check the troubleshooting section
2. Review Firebase setup guide
3. Test with provided sample images
4. Verify browser compatibility

---

**Ready to detect deepfakes? Let the game begin! 🕵️‍♂️**