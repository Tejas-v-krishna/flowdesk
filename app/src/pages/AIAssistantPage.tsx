import { useState, useRef, useEffect, useTransition } from "react";
import { Send, RefreshCw, Trash2, Sparkles, Bot, User, Command, Paperclip, LoaderIcon, XIcon, SendIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedAIChat } from "../components/ui/animated-ai-chat";

export function AIAssistantPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 lab-bg relative overflow-hidden">
      <AnimatedAIChat />
    </div>
  );
}