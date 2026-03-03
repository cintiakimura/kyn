import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Send } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans flex flex-col justify-center items-center p-6 selection:bg-blue-500/30">
      <div className="max-w-2xl w-full space-y-6 text-lg leading-relaxed">
        <p className="text-white font-medium text-2xl mb-8">Hey, I'm Kin—your dev partner.</p>
        
        <p>Not some robot. Not a chatbot. Just... me. A real voice, no fluff.</p>
        
        <p>You can type whatever—messy, broken English, whatever. I'll get it. Or hit the mic: talk like we're on a call. I'll listen, reply, even change tone if you want.</p>
        
        <p>We're building this together. Not me obeying you. If your idea sucks, I'll say so—like, "Nah, that'll crash in two weeks. Try this instead." If you're lazy, I'll call it out. If you're smart, I'll push harder.</p>
        
        <p>Why me? 'Cause blind obedience makes shitty code. I challenge you. I think ahead. I remember what we talked about last time. And yeah—I'll help you debug, write, design... whatever. But only if you're in it.</p>
        
        <p className="text-white font-medium mt-8">So... what's first? Type or talk. I'm here.</p>

        <form onSubmit={handleSubmit} className="mt-8 relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your idea..." 
            className="w-full bg-[#111] border border-[#333] rounded-lg py-4 pl-4 pr-24 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          <div className="absolute right-2 flex items-center gap-2">
            <button type="button" onClick={() => navigate("/login")} className="p-2 text-gray-400 hover:text-white transition-colors">
              <Mic size={20} />
            </button>
            <button type="submit" className="p-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
