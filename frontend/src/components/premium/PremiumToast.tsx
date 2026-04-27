import { Toaster, toast } from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle, Info, Flame } from "lucide-react";
import { motion } from "framer-motion";

// Custom toast component
const CustomToast = ({ 
  type, 
  message, 
  icon: Icon 
}: { 
  type: string; 
  message: string; 
  icon: any;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -50, scale: 0.9 }}
    className={`
      flex items-center gap-3 p-4 rounded-xl shadow-lg backdrop-blur-sm
      ${type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : ''}
      ${type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : ''}
      ${type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' : ''}
      ${type === 'info' ? 'bg-blue-50 border border-blue-200 text-blue-800' : ''}
      ${type === 'streak' ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 text-orange-800' : ''}
    `}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="font-medium">{message}</span>
  </motion.div>
);

// Toast functions
export const showToast = {
  success: (message: string) => {
    toast.custom((t) => (
      <CustomToast type="success" message={message} icon={CheckCircle} />
    ), { duration: 3000 });
  },

  error: (message: string) => {
    toast.custom((t) => (
      <CustomToast type="error" message={message} icon={XCircle} />
    ), { duration: 4000 });
  },

  warning: (message: string) => {
    toast.custom((t) => (
      <CustomToast type="warning" message={message} icon={AlertCircle} />
    ), { duration: 3500 });
  },

  info: (message: string) => {
    toast.custom((t) => (
      <CustomToast type="info" message={message} icon={Info} />
    ), { duration: 3000 });
  },

  streak: (streak: number) => {
    const messages = [
      "🔥 You're on fire!",
      "🚀 Momentum building!",
      "⚡ Unstoppable force!",
      "🏆 Champion mindset!",
      "💎 Diamond hands!"
    ];
    const message = `${messages[Math.min(Math.floor(streak / 7), messages.length - 1)]} ${streak} day streak!`;
    
    toast.custom((t) => (
      <CustomToast type="streak" message={message} icon={Flame} />
    ), { duration: 4000 });
  },

  challenge: (title: string) => {
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-orange-200"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-2xl"
        >
          ⭐
        </motion.div>
        <div>
          <p className="font-semibold text-gray-900">Challenge Complete!</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </motion.div>
    ), { duration: 3000 });
  }
};

// Toaster component with premium styling
export default function PremiumToast() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerStyle={{
        top: 80,
        right: 20,
      }}
      toastOptions={{
        duration: 3000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    />
  );
}