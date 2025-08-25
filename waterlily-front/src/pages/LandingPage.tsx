import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
    const [activeShortcut, setActiveShortcut] = useState("");
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();

            if (key === "s") {
                setActiveShortcut("s");
                setTimeout(() => setActiveShortcut(""), 300);
                document.getElementById("take-survey-btn")?.click();
            }
            if (key === "v") {
                setActiveShortcut("v");
                setTimeout(() => setActiveShortcut(""), 300);
                document.getElementById("view-responses-btn")?.click();
            }
            if (key === "l") {
                setActiveShortcut("l");
                setTimeout(() => setActiveShortcut(""), 300);
                document.getElementById("sign-out-btn")?.click();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-50/70">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-5 bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 8a2 2 0 114 0 2 2 0 01-4 0zm2 6a6 6 0 01-6-6h12a6 6 0 01-6 6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SurveyHub</span>
                </div>
                <Button
                    id="sign-out-btn"
                    variant="secondary"
                    className=" transition-colors duration-200 font-medium"
                    onClick={()=>{
                        logout()
                        navigate("/")
                    }}
                >
                Sign Out
            </Button>
        </nav>

            {/* Hero Section */ }
    <main className="flex flex-1 flex-col items-center justify-center text-center px-6 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-indigo-100 text-indigo-700 mb-8 animate-pulse">
                🚀 Your opinion matters - Help us improve!
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Share Your Thoughts, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Shape the Future</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Your feedback is the key to our improvement process. It only takes a minute to make a difference!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                    id="take-survey-btn"
                    size="lg"
                    className="relative overflow-hidden group"
                    onClick={() => navigate("/survey")}

                >
                    <span className="relative z-10 flex items-center">
                        Take Survey
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </Button>

                <Button
                    id="view-responses-btn"
                    size="lg"
                    variant="outline"
                    className="border-gray-300 hover:border-indigo-400 text-gray-700 hover:text-indigo-700 transition-all duration-200"
                    onClick={() => navigate("/sessions")}

                >
                    View Previous Responses
                </Button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200/70 shadow-sm inline-flex flex-col items-center">
                <p className="text-sm font-medium text-gray-500 mb-2">⌨️ Keyboard Shortcuts</p>
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <kbd className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-sans font-medium text-sm border border-gray-200 shadow-sm ${activeShortcut === "s" ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-gray-50 text-gray-600"}`}>S</kbd>
                        <span className="text-xs text-gray-500 mt-1">Survey</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <kbd className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-sans font-medium text-sm border border-gray-200 shadow-sm ${activeShortcut === "v" ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-gray-50 text-gray-600"}`}>V</kbd>
                        <span className="text-xs text-gray-500 mt-1">View</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <kbd className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-sans font-medium text-sm border border-gray-200 shadow-sm ${activeShortcut === "l" ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-gray-50 text-gray-600"}`}>L</kbd>
                        <span className="text-xs text-gray-500 mt-1">Logout</span>
                    </div>
                </div>
            </div>
        </div>
    </main>

    {/* Decorative elements */ }
            <div className="hidden md:block absolute top-1/4 left-10 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
            <div className="hidden md:block absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl opacity-40 animate-pulse-slow delay-1000"></div>
        </div >
    );
};

export default LandingPage;