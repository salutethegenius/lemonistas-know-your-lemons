import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Make sure we're using the proper fonts from Google
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Montserrat:wght@400;500;600&display=swap";
document.head.appendChild(link);

// Font Awesome for icons
const faScript = document.createElement("script");
faScript.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js";
faScript.crossOrigin = "anonymous";
faScript.referrerPolicy = "no-referrer";
document.head.appendChild(faScript);

createRoot(document.getElementById("root")!).render(<App />);
