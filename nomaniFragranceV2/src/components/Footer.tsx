import Link from "next/link"
import { Instagram, Facebook } from "lucide-react"
import { Button } from "./ui/button"

export default function Footer() {
  return (
    <footer
      className="w-full relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-10 px-6 flex flex-col items-center rounded-t-2xl shadow-2xl mt-16"
      style={{ overflow: 'hidden' }}
    >
      {/* Animated Gradient Overlay */}
      <div
        className="absolute inset-0 z-0 animate-gradient-move"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,215,0,0.08) 0%, rgba(0,255,198,0.07) 50%, rgba(255,99,166,0.08) 100%)",
          filter: "blur(8px)",
        }}
      />
      {/* Main Footer Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-4xl gap-8 animate-fade-in">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <img src="/nlogo.png" alt="Noamani Perfumes Logo" className="w-14 h-14 rounded-full shadow-lg border-2 border-gold-400 bg-white" />
          <span className="font-bold text-2xl tracking-wide text-gold-400 drop-shadow">Noamani Perfumes</span>
        </div>
        {/* Contact Details */}
        <div className="flex flex-col items-center md:items-end text-base gap-1">
          <span>✉️ <a href="mailto:noamaniperfumes@gmail.com" className="text-gold-300 hover:underline">noamaniperfumes@gmail.com</a></span>
          <span>📞 <a href="tel:9821744247" className="text-gold-300 hover:underline">9821744247</a></span>
        </div>
      </div>
      {/* Divider */}
      <div className="w-full max-w-4xl h-px bg-gradient-to-r from-gold-400/30 via-white/10 to-gold-400/30 my-6" />
      {/* Credit Line */}
      <div className="relative z-10 text-sm text-gray-300 text-center animate-fade-in" style={{animationDelay: '0.3s'}}>
        Made with <span className="animate-heart">❤️</span> by <span className="text-gold-400 font-semibold">Noamani Developer Team</span> | © {new Date().getFullYear()} Noamani Perfumes
      </div>
      {/* Animations */}
      <style jsx>{`
        .text-gold-300 { color: #FFD700; }
        .text-gold-400 { color: #FFC300; }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradientMove 8s ease-in-out infinite;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          10%, 30%, 50%, 70%, 90% { transform: scale(1.2); }
          20%, 40%, 60%, 80% { transform: scale(0.95); }
        }
        .animate-heart {
          display: inline-block;
          animation: heartBeat 1.8s infinite;
        }
      `}</style>
    </footer>
  )
}
