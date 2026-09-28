// Base URL for the backend API.
//
// The backend is deployed on Render (free tier), so the app works on any
// device or emulator without running a local server.
//
// NOTE: Render's free tier puts the service to sleep after ~15 minutes of
// inactivity. The first request after that can take 30-60 seconds while it
// wakes up; after that it responds normally.
//
// To run against a LOCAL backend instead, swap in one of these:
// - Android emulator:  http://10.0.2.2:5000/api
// - Physical device:   http://<your-computer-LAN-IP>:5000/api (same Wi-Fi)
export const API_BASE_URL = 'https://todo-api-yzxs.onrender.com/api';
