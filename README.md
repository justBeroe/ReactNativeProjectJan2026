# ReactNativeProjectJan2026


🚀 **How to download .apk file**:  
[Download APK](https://github.com/justBeroe/ReactNativeProjectJan2026/releases/download/1/songShopDT.apk)

📱 **ReactNativeProjectJan2026**  
🎓 **React Native – Exam Project**  
🎵 **Category:** Music Application  

---

## 1. Project Overview

**Application Name:** ReactNativeProjectJan2026  
**Application Category / Topic:** Music  

**Main Purpose:**  
This mobile application allows users to listen to music and radio streams for free using public APIs. Authenticated users can:  
- Browse artists  
- View song details  
- Stream previews  
- Edit profile information  
- Upload a profile picture using the mobile camera  

💡 The app demonstrates authentication handling, API integration, CRUD operations, advanced navigation, and native device feature usage.

---

## 2. User Access & Permissions

### Guest (Not Authenticated) ❌
**Available screens or actions:**  
- Login Screen  
- Register Screen  

Unauthenticated users cannot access any other application functionality.

### Authenticated User ✅
**Main Sections / Tabs:**  
- Home  
- Artists  
- Picture  
- Profile  

**Details Screens:**  
- Artist Details  
- Song Details  

**Create / Edit / Delete Actions:**  
- Fetch artists from public APIs  
- Edit artist name  
- Edit album title  
- Delete songs  
- Upload profile picture  
- Edit username and email  

💡 Logged-in users have full access to all tabs and screens.  

---

## 3. Authentication & Session Handling 🔐

**Authentication Flow:**  

1. **What happens when the app starts?**  
   - Login screen is displayed.  
   - User must log in or register to continue.  

2. **How authentication status is checked**  
   - AuthService checks AsyncStorage for a stored session.  
   - If session exists → AppNavigator is loaded  
   - If not → AuthNavigator (Login/Register) is shown  

3. **What happens on successful login or registration**  
   - User redirected to main AppNavigator  
   - Artists can be fetched from:  
     - Deezer API 🎵  
     - Jamendo API 🎶  
     - Online Radio API 📻  
   - Songs can be previewed  
   - Artist/song data can be edited or deleted  
   - Profile picture can be uploaded  

4. **What happens on logout**  
   - AsyncStorage is cleared  
   - User session removed  
   - App redirects back to Login screen  
   - All authenticated functionality becomes unavailable  

**Session Persistence:**  
- Stored in AsyncStorage; user data in MongoDB  
- On app restart, session persists until logout

---

## 4. Navigation Structure 🗺️

**Root Navigation Logic:**  
- Authenticated → AppNavigator  
- Not Authenticated → AuthNavigator  
- Logic handled inside `RootNavigator`

**Main Navigation:**  
- AppNavigator has 4 Bottom Tab screens:  
  - Home  
  - Artists  
  - Picture  
  - Profile  

**Home Tab:**  
- Contains Drawer Navigator  
- Includes: Song, Song2, Radio music options  

**Artists Tab:**  
- Uses Stack Navigator  
- Flow: `ArtistScreen → SongList → DetailsSong`  

**Nested Navigation:**  
- Drawer inside Home tab  
- Stack inside Artists tab  

**Navigation types used:**  
- BottomTabNavigator  
- StackNavigator  
- DrawerNavigator

---

## 5. List → Details Flow 📋➡️🔍

**List / Overview Screen:**  
- Data: Song & Song2 arrays from Deezer, Jamendo, Online Radio API  
- User Interaction:  
  - Artists Tab → Select Artist → View Songs → Select Song → Navigate to Details  

**Details Screen:**  
- Navigation Trigger: Artists Tab → Artist → Song → DetailsSong  
- Data via route params: `itemId` of selected song  
- Only selected song’s data displayed  

---

## 6. Data Source & Backend 💻

**Backend Type:**  
- MongoDB  
- Node.js + Express  
- Hosted on Debian 12 server  

**Backend handles:**  
- Authentication  
- User management  
- Profile picture updates  
- CRUD operations  

---

## 7. Data Operations (CRUD) 🛠️

**Read (GET):**  
- Fetch artists from public APIs  
- Fetch user data from MongoDB  

**Create (POST):**  
- Register new user  
- Upload profile picture  
- Fetch artists  

**Update / Delete:**  
- Update: Edit artist name, album title, username, email  
- Delete: Delete songs  

💡 **UI updates automatically** using React `useState`  

---

## 8. Forms & Validation 📝

**Forms Used:**  
- Login Screen  
- Register Screen  
- Profile Edit Form  

**Validation Rules:**  

**Email (LoginScreen):**  
- Required  
- Must match email regex  

**Password (LoginScreen):**  
- Required  
- Login button disabled if invalid  

**RegisterScreen:**  
- Password min length: 6  
- Confirm password must match  

---

## 9. Native Device Features 📱

**Used Feature:** Camera (Expo Camera / Image Picker)  

**Usage:**  
- Picture Tab → Capture & upload profile picture  
- Image displayed in Profile tab  

---

## 10. Typical User Flow 🚶‍♂️

1. Register & log in  
2. Navigate to Artists tab  
3. Fetch & select artist  
4. View songs → edit/delete if needed  
5. Click “Open Preview Stream” to listen  
6. Navigate to Picture tab → enable camera → capture photo → upload  
7. View updated profile info in Profile tab  

---

## 11. Error & Edge Case Handling ⚠️

**Authentication Errors:**  
- Invalid credentials → Login failed – 401 Unauthorized  

**Network / Data Errors:**  
- Axios network error handling  
- Registration error if user already exists  
- Backend unavailable → connection error message  

**Empty / Missing Data States:**  
- Required email & password fields  
- Password min length validation  
- Confirm password match validation  
- Disabled login button if form invalid  

---
