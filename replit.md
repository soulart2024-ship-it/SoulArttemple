# SoulArt Temple

## Overview

SoulArt Temple is a spiritual wellness and self-therapy web application that provides users with a sacred digital space for healing and personal growth. The platform offers multiple interactive features including guided journeys, self-therapy tools, personalized soul cards, journaling capabilities, and emotion analysis. The application focuses on helping users "heal, harmonise, and embody their highest truth" through various mindfulness and therapeutic activities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend Architecture**
- Single-page application (SPA) built with vanilla HTML, CSS, and JavaScript
- Client-side routing implemented through JavaScript navigation functions
- Responsive design using CSS Grid and Flexbox layouts
- Dynamic content loading without page refreshes for seamless user experience

**UI/UX Design System**
- Custom CSS variables for consistent theming with spiritual color palette (gold, temple blue, cream)
- Typography system using Google Fonts (Cormorant Garamond for headers, Quicksand for body text)
- Fade transitions between page sections for smooth navigation
- Mobile-first responsive design approach

**Content Management**
- Static content served directly from HTML with JavaScript-based content switching
- Form data collection through external service integration
- Local storage utilized for persistent user data (journal entries, emotion tracking)

**Data Visualization**
- Chart.js integration for emotion tracking and analytics
- Dynamic chart generation and cleanup to prevent memory leaks
- Interactive data representation for user insights

## External Dependencies

**Form Processing**
- Formspree.io integration for contact form submissions and user initiation requests
- Handles email collection and user reflection submissions for personalized soul frequency snapshots

**Fonts and Icons**
- Google Fonts API for typography (Cormorant Garamond, Quicksand)
- Custom logo asset (logo.png) for branding

**Data Visualization**
- Chart.js CDN for emotion tracking charts and analytics dashboards
- Enables interactive data visualization without backend complexity

**File Sharing Integration**
- Support for external file sharing services (Dropbox, Google Drive, WeTransfer)
- Users can submit voice notes and video links through URL sharing