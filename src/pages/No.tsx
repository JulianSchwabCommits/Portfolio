import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { use_theme } from "../context/ThemeContext";
import { DESIGN_TOKENS, commonPatterns } from "@/design-tokens";
import reasonsData from "@/data/reasons.json";

interface NoReason {
  reason: string;
  index: number;
  total: number;
}

const No = () => {
  const { theme } = use_theme();
  const [reason, setReason] = useState<NoReason | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getRandomReasonFromLocal = (): NoReason => {
    const randomIndex = Math.floor(Math.random() * reasonsData.length);
    return {
      reason: reasonsData[randomIndex],
      // Return 1-based index for human-readable display
      index: randomIndex + 1,
      total: reasonsData.length
    };
  };

  const fetchReason = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/no");
      
      // Check if we got HTML back (dev mode fallback)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Fallback to local data in development
        console.log("API not available, using local data");
        setReason(getRandomReasonFromLocal());
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error("Failed to fetch reason");
      }
      
      const data = await response.json();
      setReason(data);
    } catch (err) {
      // Fallback to local data on error
      console.log("Error fetching from API, using local data:", err);
      setReason(getRandomReasonFromLocal());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReason();
  }, []);

  return (
    <PageTransition>
      <div className={`min-h-screen flex flex-col items-center justify-center ${DESIGN_TOKENS.SPACING.CARD_PADDING}`}>
        <div className={commonPatterns.PAGE_LAYOUT}>
          <motion.div 
            className="flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Big NO heading */}
            <motion.h1 
              className={`${DESIGN_TOKENS.TYPOGRAPHY.HERO_TITLE} mb-8 text-red-500 drop-shadow-lg`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              NO
            </motion.h1>
            
            {/* Reason card */}
            <motion.div
              className={`${commonPatterns.RESPONSIVE_CARD} max-w-3xl w-full ${DESIGN_TOKENS.ANIMATION.HOVER_TRANSITION} ${
                theme === 'light' 
                  ? DESIGN_TOKENS.SHADOW.DEFAULT_LIGHT
                  : DESIGN_TOKENS.SHADOW.DEFAULT_DARK
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className={DESIGN_TOKENS.STATES.LOADING_PULSE}>
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  </div>
                </div>
              )}
              
              {error && (
                <div className="py-12">
                  <p className={`text-red-500 ${DESIGN_TOKENS.TYPOGRAPHY.BODY_DEFAULT}`}>
                    {error}
                  </p>
                </div>
              )}
              
              {!loading && !error && reason && (
                <div className="space-y-6">
                  <p className={`${DESIGN_TOKENS.TYPOGRAPHY.BODY_LARGE} font-medium leading-relaxed`}>
                    {reason.reason}
                  </p>
                  
                  <div className={`flex items-center justify-between pt-6 border-t ${
                    theme === 'light' ? 'border-gray-300' : 'border-white/10'
                  }`}>
                    <span className={`${DESIGN_TOKENS.TYPOGRAPHY.BODY_SMALL} ${DESIGN_TOKENS.OPACITY.DEFAULT}`}>
                      Reason #{reason.index} of {reason.total}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Refresh button */}
            <motion.button
              onClick={fetchReason}
              disabled={loading}
              className={`mt-8 ${DESIGN_TOKENS.SPACING.COMPACT} ${DESIGN_TOKENS.BORDER_RADIUS.BUTTON_PILL} ${DESIGN_TOKENS.ANIMATION.HOVER_TRANSITION} ${
                theme === 'light' 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-white text-black hover:bg-gray-200'
              } font-medium ${DESIGN_TOKENS.SHADOW.SCALE_TRANSFORM} ${
                loading ? DESIGN_TOKENS.STATES.LOADING_OPACITY : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Get Another Reason
              </span>
            </motion.button>
            
            {/* Subtitle */}
            <motion.p
              className={`mt-6 ${DESIGN_TOKENS.TYPOGRAPHY.BODY_SMALL} ${DESIGN_TOKENS.OPACITY.DEFAULT}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {reason?.total && `${reason.total} creative ways to say no`}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default No;
