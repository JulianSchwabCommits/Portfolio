import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { use_theme } from "../context/ThemeContext";

export default function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { theme } = use_theme();

  useEffect(() => {
    // Check if already authenticated
    const adminAuth = sessionStorage.getItem('admin_auth');
    if (adminAuth) {
      navigate('/admin');
    }
  }, [navigate]);

  // Function to convert string to SHA-256 hash
  const sha256 = async (message: string): Promise<string> => {
    // Encode the message as UTF-8
    const msgBuffer = new TextEncoder().encode(message);
    
    // Hash the message with SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    
    // Convert the hash to hex string
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Get the admin record
      const { data, error: queryError } = await supabase
        .from('admin_users')
        .select('*')
        .limit(1)
        .single();
      
      if (queryError) throw queryError;
      
      if (!data) {
        setError('Admin user not found');
        return;
      }
      
      // Hash the input password with SHA-256
      const hashedPassword = await sha256(password);
      
      // Compare with stored hash
      if (hashedPassword === data.password_hash) {
        sessionStorage.setItem('admin_auth', 'true');
        navigate('/admin');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Authentication failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-background"
      style={{
        backgroundColor: 'var(--bg-color)',
        backgroundImage: theme === 'light' 
          ? 'radial-gradient(circle at 25% 25%, rgba(0, 0, 0, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.05) 0%, transparent 50%)'
          : 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)'
      }}
    >
      {/* Floating transparent elements */}
      <motion.div 
        className="absolute pointer-events-none"
        animate={{
          top: ['20%', '15%', '20%'],
          left: ['20%', '22%', '20%'],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: '25rem',
          height: '25rem',
          borderRadius: '50%',
          background: theme === 'light' 
            ? 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.01) 70%, transparent 100%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 70%, transparent 100%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />

      <motion.div 
        className="absolute pointer-events-none"
        animate={{
          bottom: ['10%', '15%', '10%'],
          right: ['15%', '12%', '15%'],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: '20rem',
          height: '20rem',
          borderRadius: '50%',
          background: theme === 'light' 
            ? 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.01) 70%, transparent 100%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 70%, transparent 100%)',
          filter: 'blur(35px)',
          zIndex: 0
        }}
      />

      <div className="w-full max-w-md px-4 sm:px-8 py-6 sm:py-10 relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            className="w-16 sm:w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 dark:from-white/70 dark:to-white mx-auto mb-4 sm:mb-6 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: theme === 'light' ? '4rem' : '6rem' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold text-gradient mb-2 sm:mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Admin Portal
          </motion.h1>
          <motion.p 
            className="text-sm sm:text-base text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Secure access to your dashboard
          </motion.p>
        </div>
        
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <Card 
            className="glass-morphism overflow-hidden w-full"
          >
            <CardHeader 
              className="pb-4 pt-4 sm:pb-6 sm:pt-6 border-b border-border"
            >
              <CardTitle className="text-center text-lg sm:text-xl">Sign In</CardTitle>
            </CardHeader>
            <CardContent 
              className="pt-4 pb-4 px-4 sm:pb-6 sm:px-6"
            >
              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="password" className="text-xs sm:text-sm font-medium block text-foreground">Password</label>
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 bg-card/40 border border-border rounded-lg focus:ring-2 focus:ring-ring/30 focus:border-transparent transition-all duration-300 neo-blur text-sm sm:text-base"
                        autoFocus
                      />
                    </motion.div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <motion.div
                        animate={{
                          opacity: [0.5, 0.7, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>
                {error && (
                  <motion.div 
                    className="bg-destructive/10 backdrop-blur-sm text-destructive text-xs sm:text-sm p-2 sm:p-3 rounded-lg border border-destructive/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="hover-scale"
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-white text-black border border-black dark:text-white dark:border-white dark:bg-transparent hover:bg-card/40 hover:text-foreground dark:hover:bg-card/40 py-1.5 sm:py-2 rounded-lg transition-all duration-300 mt-4 sm:mt-6 text-sm sm:text-base"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Signing in...</span>
                      </div>
                    ) : "Sign In"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          className="text-center mt-4 sm:mt-6 text-muted-foreground text-[10px] sm:text-xs neo-blur py-1.5 sm:py-2 px-3 sm:px-4 rounded-full inline-block mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            transform: 'translateX(-50%)',
            left: '50%',
            position: 'relative'
          }}
        >
          © {new Date().getFullYear()} Julian's Portfolio Admin
        </motion.div>
      </div>
    </div>
  );
} 