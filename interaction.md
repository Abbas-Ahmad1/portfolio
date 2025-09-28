# Portfolio Website Interaction Design

## Core Interactive Features

### 1. Typewriter Hero Animation
- **Effect**: Typewriter animation for main heading "Hi, I'm Abbas Ahmad"
- **Trigger**: Page load
- **Behavior**: Text types out character by character, then cursor blinks
- **Fallback**: Static text if JavaScript fails

### 2. Sticky Navigation with Active Section Highlighting
- **Behavior**: Navbar sticks to top on scroll, highlights current section
- **Trigger**: Scroll events and Intersection Observer API
- **Visual**: Active section link changes color and adds underline
- **Smooth Scroll**: All internal links scroll smoothly to sections

### 3. Dark/Light Mode Toggle
- **Button**: Toggle switch in navbar
- **Functionality**: Switches between light and dark themes
- **Persistence**: Saves preference to localStorage
- **Animation**: Smooth color transitions across all elements

### 4. Skills Grid Interaction
- **Layout**: Responsive grid of skill cards
- **Hover Effect**: Cards lift with shadow and slight scale
- **Content**: Each card shows skill icon and name
- **Animation**: Staggered fade-in on page load

### 5. Project Cards with Hover Effects
- **Layout**: Grid of project showcase cards
- **Hover Effects**: 
  - Card lifts with enhanced shadow
  - Image zooms slightly
  - Buttons appear with slide animation
- **Buttons**: "Live Demo" and "Source Code" with working links

### 6. Contact Form with Validation
- **Fields**: Name, Email, Message
- **Validation**: Real-time validation with visual feedback
- **Submission**: Prevents default form submission
- **Success**: Shows toast notification on valid submission
- **Error Handling**: Highlights invalid fields with error messages

### 7. Scroll Animations
- **Fade-in Animation**: Sections fade in as they enter viewport
- **Stagger Effect**: Elements appear with slight delays
- **Trigger**: Intersection Observer API
- **Performance**: Optimized with passive listeners

### 8. Mobile Menu Toggle
- **Trigger**: Hamburger menu button on mobile
- **Behavior**: Slides in mobile navigation overlay
- **Close**: Click outside or close button
- **Animation**: Smooth slide transition

## User Journey Flow

1. **Landing**: User sees hero with typewriter animation
2. **Navigation**: Sticky navbar helps navigate between sections
3. **About**: Learns about Abbas with smooth scroll
4. **Skills**: Views technical skills in interactive grid
5. **Projects**: Explores project portfolio with hover details
6. **Contact**: Sends message through validated form
7. **Theme**: Can toggle between light/dark modes

## Accessibility Features

- Keyboard navigation support
- Focus indicators on all interactive elements
- Screen reader friendly semantic HTML
- High contrast mode support
- Reduced motion preferences respected