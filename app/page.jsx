"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
     
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-10 left-20 text-6xl z-50 font-bold text-gray-700"
      >
        <motion.span className="block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Simulate Analyze</motion.span>
        <motion.span className="block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>Innovate</motion.span>
        <motion.span className="block text-3xl mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          Predict Market Reactions Before You Launch!
        </motion.span>
      </motion.div>

     
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-40 right-20 text-6xl z-50 font-bold text-gray-700 text-right"
      >
        <motion.span className="block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>With AI-Powered</motion.span>
        <motion.span className="block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>Social Insights</motion.span>
        <motion.span className="block text-3xl mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          Understand Your Audience Like Never Before!
        </motion.span>
      </motion.div>

     
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 1 }}
        onClick={() => router.push("/simulation")}
        className="absolute top-[55vh] px-8 py-3 text-lg z-999 font-semibold text-gray-700 bg-[#FFFCF6] border border-gray-400 rounded-full shadow-md hover:bg-gray-100 hover:shadow-lg transition-all  cursor-pointer"
      >
        Start Simulation
      </motion.button>


      <div className="absolute top-10 left-0 w-full h-screen">
        <svg width="100%" height="100%" viewBox="0 0 1377 534" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_1285_4746" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="1377" height="534">
            <rect x="0.437744" y="0.342529" width="1375.91" height="533.275" fill="#D9D9D9"></rect>
          </mask>
          <g mask="url(#mask0_1285_4746)">
            <path fillRule="evenodd" clipRule="evenodd" d="M714.881 16.0235C698.784 5.32584 677.842 5.32584 661.745 16.0235L21.745 441.358C8.35822 450.255 0.312988 465.261 0.312988 481.335V1970.37C0.312988 1996.88 21.8033 2018.37 48.313 2018.37H688.313L1328.31 2018.37C1354.82 2018.37 1376.31 1996.88 1376.31 1970.37V481.335C1376.31 465.261 1368.27 450.255 1354.88 441.358L714.881 16.0235Z" fill="#FFFCF6"></path>
          </g>
        </svg>
      </div>

     
      <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-[#FFFCF6]"></div>
    </div>
  );
}
