# Grama-Yatri: Android Studio (Kotlin + Jetpack Compose) Prompt

Use the following prompt in an AI tool or as a specification for your Android project.

---

### Project Specification: Grama-Yatri (Rural Mobility App)

**Goal:** Build a "Community-Powered" bus tracking app for passengers in rural areas.

**Core Stack:**
- **Language:** Kotlin
- **UI Framework:** Jetpack Compose (Material 3)
- **Backend:** Firebase Firestore (for real-time pings)
- **Architecture:** MVVM with StateFlow for UI updates

**UI Components to Implement:**
1. **Vertical Stepper Route View:** 
   - A scrollable list of bus stops.
   - Each stop should have its Name, Kannada Name, and Estimated Time of Arrival (ETA).
   - Use a `LazyColumn` for efficiency.
   - Use a custom `Canvas` drawing for the connecting line between stops.

2. **Real-time Bus Indicator:**
   - A pulsing red dot showing the last reported location of the bus.
   - A "Reported by [User Name]" tag.

3. **Report Action (Bus Ping):**
   - A persistent floating action button or "Ping" buttons on each stop.
   - Action: Updates Firestore with the current timestamp and stop ID.

4. **ETA Calculation Logic:**
   - `ETA = LastPingTime + (AvgTravelTimeOfTargetStop - AvgTravelTimeOfCurrentStop)`.

**Material 3 Theme:**
- Primary Color: `#ED1C24` (KSRTC Red)
- Secondary Color: `#FFF200` (KSRTC Yellow)
- Use `ElevatedCard` for stop details.

**Android Specifics:**
- Implement `SplashScreen` API.
- Use `Dagger Hilt` or `Koin` for Dependency Injection.
- Use `Firebase Cloud Messaging` (FCM) for "Bus Cancelled" notifications.

---

### Suggested Directory Structure:
- `data/`
  - `TransitRepository.kt`: Handles Firestore listeners and writes.
  - `models/Stop.kt`, `models/Ping.kt`
- `ui/`
  - `theme/`: Type, Color, Theme.
  - `timeline/`: BusTimeline.kt, StopCard.kt
  - `DashboardViewModel.kt`: Processes logic for Live ETAs.
- `MainActivity.kt`: Root container.
