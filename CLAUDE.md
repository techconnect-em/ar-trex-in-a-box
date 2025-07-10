# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AR (Augmented Reality) T-Rex experience built with A-Frame, MindAR, and vanilla JavaScript. The project allows users to interact with a 3D T-Rex model through image marker tracking, featuring feeding, petting, and capture functionality.

## Architecture

### Core Technologies
- **A-Frame 1.6.0**: WebXR framework for 3D/AR experiences
- **MindAR**: Image tracking library for marker-based AR
- **Vanilla JavaScript**: No frameworks, uses A-Frame component system
- **Static hosting**: Glitch.com deployment (no build process required)

### File Structure
- `index.html`: Main AR scene with A-Frame setup and UI elements
- `script.js`: Main A-Frame component (`ar-controller`) with all interaction logic
- `style.css`: UI styling for buttons, modals, and status panels
- `tap-move.js`: Experimental component for T-Rex movement (not actively used)
- `assets/`: Contains 3D model and AR tracking targets
  - `Running_T-Rex.glb`: 3D T-Rex model with animations
  - `targets.mind`: MindAR image tracking targets

### Key Components

#### AR Controller (`script.js`)
The main `ar-controller` A-Frame component handles:
- **Animation Management**: Cycles through idle, roar, and attack animations
- **Status System**: Tracks T-Rex happiness, hunger, and feeding count
- **Audio System**: Web Audio API for feeding and petting sound effects
- **Interaction Systems**: 
  - Feeding (increases hunger/happiness)
  - Petting (tap/click for happiness boost)
  - Screenshot capture with AR+camera overlay
- **UI Management**: Status panels, effects, and modal dialogs

#### Status Management
- Real-time happiness and hunger tracking
- Visual feedback with emoji indicators
- Automatic status decay over time
- Feeding counter and last feed time tracking

#### Audio System
- Web Audio API oscillator-based sound effects
- Auto-initialization on first user interaction
- Separate sounds for feeding ('eating') and petting ('heart')

### Development Workflow

Since this is a static site with no build process:

1. **Local Development**: Open `index.html` in a modern browser with AR support
2. **Testing**: Use browser developer tools for debugging
3. **Deployment**: Direct file upload to Glitch.com or similar static hosting

### AR Testing Requirements
- **Device**: Mobile device with camera support
- **Browser**: Chrome/Safari with WebXR support
- **Tracking Target**: Physical or displayed image matching `assets/targets.mind`
- **Permissions**: Camera access required for AR functionality

### Key Interaction Patterns

#### Event Handling
- Uses both A-Frame cursor events and vanilla DOM events
- Global click detection for T-Rex interaction area (200px radius from center)
- Touch event handling for mobile devices
- Button event listeners for UI controls

#### Animation Flow
- Continuous animation loop with timed transitions
- Special animations for feeding and petting interactions
- Animation state management to prevent conflicts

#### Visual Effects
- Particle systems for feeding effects
- Emoji animations for status feedback
- CSS animations for UI transitions

### Common Modifications

When working with this codebase:

1. **Adding New Interactions**: Extend the `ar-controller` component
2. **Modifying Animations**: Update the `animations` array in `script.js`
3. **Changing UI**: Edit CSS classes and DOM manipulation in `setupButtons()`
4. **Adding Sound Effects**: Extend `playEffectSound()` with new oscillator patterns
5. **Adjusting AR Settings**: Modify MindAR parameters in `index.html`

### Performance Considerations
- Uses `preserveDrawingBuffer: true` for screenshot functionality
- Implements efficient animation cycling to prevent memory leaks
- Status updates are throttled to 5-second intervals
- Audio context is lazy-loaded on first interaction

### External Dependencies
All dependencies are loaded via CDN:
- A-Frame and A-Frame Extras
- MindAR image tracking
- Font Awesome icons
- html2canvas for screenshot functionality

No local npm or build tools required - this is intentionally a simple static site.