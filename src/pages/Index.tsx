import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-black/[0.02]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-accent">
            <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-medium tracking-tight text-black">SHIFT</span>
        </div>
        <button 
          onClick={() => navigate("/auth")}
          className="text-sm font-medium px-4 py-2 rounded-lg text-black/70 hover:text-black transition-colors"
        >
          Sign in
        </button>
      </nav>

      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to SHIFT</h1>
          <p className="text-xl text-gray-600">Your pocket psychologist for high achievers.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;