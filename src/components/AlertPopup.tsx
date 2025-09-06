import { motion, AnimatePresence } from "framer-motion";
import { use_theme } from "../context/ThemeContext";

interface AlertPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}

const AlertPopup = ({ isOpen, onClose, onAccept }: AlertPopupProps) => {
    const { theme } = use_theme();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="w-full max-w-2xl p-4"
                    >
                        <div className={`rounded-2xl p-8 transform-gpu transition-all duration-200 ${theme === 'light'
                            ? 'bg-white border border-gray-400'
                            : 'bg-black border border-gray-400'
                            }`} style={{
                                boxShadow: theme === 'light'
                                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                                    : '0 25px 50px -12px rgba(255, 255, 255, 0.1)'
                            }}>
                            <div className="text-center">
                                {/* Animated exclamation mark with red color - exact same as 404 */}
                                <h1 className="text-8xl font-bold mb-8 text-red-500 drop-shadow-lg animate-pulse">
                                    !
                                </h1>

                                {/* Alert text */}
                                <div className="mb-8">
                                    <p className="text-lg leading-relaxed text-gray-400">
                                        julianschwab.dev is best viewed upside down at a screen resolution of 1024x1.
                                        Please enable your ad blockers, disable high-heat drying, and remove your device
                                        from Airplane Mode and set it to Boat Mode. For security reasons, please leave
                                        caps lock on while browsing.
                                    </p>
                                </div>

                                {/* Accept button - styled differently for light/dark mode */}
                                <button
                                    onClick={onAccept}
                                    className={`px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:bg-black hover:text-white ${theme === 'light'
                                            ? 'bg-black text-white border border-gray-700'
                                            : 'bg-white text-black border border-gray-300'
                                        }`}
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AlertPopup;