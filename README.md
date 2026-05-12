# Grama-Yatri Android App Development Plan
<img width="1355" height="649" alt="Screenshot 2026-05-12 112221" src="https://github.com/user-attachments/assets/b5102332-09ce-426c-933c-de3efaecac0f" />

Build a complete Android application named "Grama-Yatri" from the provided Stitch UI design files using Kotlin and Jetpack Compose in Android Studio.

## Core Requirements

* Preserve the Stitch UI design exactly, including layout, spacing, typography, colors, icons, and navigation flow.
* Convert every provided screen into fully functional Jetpack Compose screens.
* Ensure smooth navigation between screens using Navigation Compose.
* Follow clean MVVM architecture with Repository pattern.
* Use Firebase Realtime Database for real-time bus tracking and live ETA updates.
* Optimize the app for low-data usage and fast performance.

## Tech Stack

* Kotlin
* Jetpack Compose
* Material 3
* MVVM Architecture
* Hilt Dependency Injection
* Firebase Realtime Database
* Firebase Authentication
* Room Database (offline cache)
* Coroutines + Flow
* Navigation Compose

## Features to Implement

### 1. Splash Screen

* App logo animation
* Auto navigation to Home Screen

### 2. Home Screen

* Route listing
* Search functionality
* Current bus status
* Last updated timestamp
* Bottom navigation

### 3. Route Details Screen

* Vertical timeline/stepper view
* Live bus position
* ETA calculation for villages
* Arrival status indicators

### 4. Bus Ping System

Users can:

* Report “Bus just passed me”
* Report “I am on the bus”

Store:

* Reporter name
* Stop name
* Timestamp
* Route ID

### 5. Live ETA System

* Calculate ETA using average travel time between villages
* Instantly sync ETA updates for all users

### 6. Alert System

* Bus canceled
* Bus delayed
* Road blocked
* Strike alerts

Display:

* Alert banner
* Reporter source
* Timestamp

### 7. Offline Support

* Cache latest routes and ETA using Room
* Show last known data offline

## Architecture Structure

com.gramayatri
│
├── data
│   ├── model
│   ├── repository
│   ├── remote
│   └── local
│
├── domain
├── ui
│   ├── screens
│   ├── components
│   ├── navigation
│   └── theme
│
├── viewmodel
├── utils
└── MainActivity.kt

## Firebase Requirements

* Setup Firebase Realtime Database
* Add real-time listeners
* Sync live tracking updates instantly
* Include setup instructions for `google-services.json`

## UI Requirements

* Lightweight rural-friendly design
* Material 3 styling
* Green + Blue transport theme
* Responsive Compose UI
* Smooth animations

## Deliverables

Generate:

* Complete Android Studio project
* Kotlin source files
* Compose UI code
* Navigation setup
* Firebase integration
* ViewModels and repositories
* Gradle build files
* AndroidManifest permissions
* README setup guide
* APK-ready project structure

## Final Goal

Create a production-ready Grama-Yatri Android app with real-time rural bus tracking while keeping the provided Stitch UI design exactly unchanged.
