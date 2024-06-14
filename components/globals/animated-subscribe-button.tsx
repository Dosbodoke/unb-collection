"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

interface AnimatedSubscribeButtonProps {
  subscribeStatus?: boolean;
}

export const AnimatedSubscribeButton: React.FC<
  AnimatedSubscribeButtonProps
> = ({ subscribeStatus = false }) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(subscribeStatus);

  return (
    <AnimatePresence mode="wait">
      {isSubscribed ? (
        <Button asChild variant="outline">
          <motion.button
            className="relative flex items-center justify-center rounded-md bg-white p-[10px] outline outline-1 outline-black"
            onClick={() => setIsSubscribed(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              key="action"
              className="relative block h-full w-full font-semibold"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
            >
              <span className="group inline-flex items-center">
                <CheckIcon className="mr-2 h-4 w-4" />
                Inscrito{" "}
              </span>
            </motion.span>
          </motion.button>
        </Button>
      ) : (
        <Button asChild variant="outline">
          <motion.button
            className="relative flex cursor-pointer items-center justify-center rounded-md border-none"
            onClick={() => setIsSubscribed(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              key="reaction"
              className="relative block font-semibold"
              initial={{ x: 0 }}
              exit={{ x: 50, transition: { duration: 0.1 } }}
            >
              <span className="group inline-flex items-center">
                Inscrever-se{" "}
                <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </motion.span>
          </motion.button>
        </Button>
      )}
    </AnimatePresence>
  );
};
