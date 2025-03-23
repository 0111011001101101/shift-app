
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to onboarding
    navigate("/onboarding", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        <p className="text-secondary-600">Redirecting to onboarding...</p>
      </div>
    </div>
  );
}
