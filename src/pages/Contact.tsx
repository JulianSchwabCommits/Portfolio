import { motion } from "framer-motion";
import { Mail, Phone, Github, Linkedin, MessageSquare } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Chatbot from "../components/Chatbot";

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email",
    value: "me@julianschwab.dev",
    href: "mailto:me@julianschwab.dev"
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: "Phone",
    value: "+41 77 460 46 59",
    href: "tel:+41774604659"
  },
  {
    icon: <Github className="w-5 h-5" />,
    label: "GitHub",
    value: "github.com/JulianSchwabCommits",
    href: "https://github.com/JulianSchwabCommits"
  },
  {
    icon: <Linkedin className="w-5 h-5" />,
    label: "LinkedIn",
    value: "linkedin.com/in/julian-schwab",
    href: "https://www.linkedin.com/in/julian-schwab-680349263"
  }
];

const Contact = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24 pt-24 pb-20">
        <motion.div 
          className="flex flex-col items-center justify-center text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-serif mb-4"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.7, ease: "easeOut" }
              }
            }}
          >
            Let's Chat
          </motion.h1>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-serif mb-8">Contact Information</h2>
            
            <ul className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="glass-morphism rounded-xl p-4 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a 
                    href={item.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-4"
                  >
                    <div className="p-2 rounded-full bg-white/10 transition-all duration-300 group-hover:bg-white/15">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{item.label}</p>
                      <p className="text-white">{item.value}</p>
                    </div>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-serif mb-8">Ask me anything</h2>
            <Chatbot />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
