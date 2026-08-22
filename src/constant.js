const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`

// export const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=YOUR_API_KEY";


//BELOW ARE DIFFERENT GEMINI MODELS
// gemini-flash-latest
// gemini-3-flash-preview  *
// gemini-3.5-flash-lite
// gemini-3.1-pro-preview