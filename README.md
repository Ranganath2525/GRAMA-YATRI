Grama-Yatri 🚍
Community-Powered Rural Transit Network
<div align="center"> <img width="1200" height="475" alt="Grama-Yatri Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" /> </div>
📌 Overview

Grama-Yatri is a real-time rural mobility Android application designed to help villagers, students, and workers track village buses using community-powered live updates.

Passengers can report bus locations, delays, and cancellations, while the app calculates live ETAs for upcoming villages using Firebase Realtime Database synchronization.

The app is built using Kotlin, Jetpack Compose, Firebase, and MVVM Architecture with a lightweight UI optimized for low-data rural environments.

✨ Features
🚍 Real-time rural bus tracking
📍 Community-powered bus pings
⏱️ Live ETA calculation system
🛣️ Route timeline / village stepper UI
🔔 Bus cancellation & delay alerts
👤 Reporter source display
🌐 Firebase Realtime synchronization
📶 Offline caching support
⚡ Lightweight and fast performance
🎨 Modern Material 3 UI
🛠️ Tech Stack
Technology	Usage
Kotlin	Android Development
Jetpack Compose	Modern UI
Firebase Realtime Database	Live Tracking
Firebase Authentication	User Authentication
MVVM Architecture	Clean Architecture
Hilt	Dependency Injection
Room Database	Offline Cache
Coroutines + Flow	Async Operations
Navigation Compose	Screen Navigation
📱 Screens
Splash Screen
Home Screen
Route Details Screen
Alerts Screen
Settings Screen
🚀 Getting Started
Prerequisites
Android Studio Hedgehog or newer
Android SDK installed
Firebase Project
Kotlin support enabled
⚙️ Installation
1. Clone the Repository
git clone https://github.com/your-username/Grama-Yatri.git
2. Open in Android Studio

Open the project folder in Android Studio.

3. Setup Firebase

Create a Firebase project and download:

google-services.json

Place the file inside:

app/google-services.json
4. Enable Firebase Services

Enable:

Firebase Realtime Database
Firebase Authentication
5. Sync Gradle

Click:

Sync Project with Gradle Files
6. Run the App

Run on:

Android Emulator
Physical Android Device
🔥 Firebase Database Structure
routes/
  routeId/
    routeName
    villages

live_tracking/
  routeId/
    currentStop
    reporter
    timestamp

alerts/
  alertId/
    type
    message
    reporter
    timestamp
📂 Project Structure
com.gramayatri
│
├── data
│   ├── local
│   ├── remote
│   ├── model
│   └── repository
│
├── domain
│
├── ui
│   ├── screens
│   ├── components
│   ├── navigation
│   └── theme
│
├── viewmodel
│
├── utils
│
└── MainActivity.kt
📦 Build APK

To generate APK:

Build > Build APK(s)

Generated APK location:

app/build/outputs/apk/debug/app-debug.apk
🎯 Project Goals
Reduce waiting time at rural bus stops
Improve transportation predictability
Support workers and students
Provide low-data rural transit accessibility
Build a crowdsourced live transport network
📸 UI Design
Material 3 Design
Rural-friendly lightweight UI
Green & Amber transport theme
Smooth animations and transitions
🤝 Contributing

Contributions are welcome!

Fork the repository
Create a new branch
Commit your changes
Push to your branch
Open a Pull Request

👨‍💻 Developed With
Kotlin
Jetpack Compose
Firebase
Android Studio
