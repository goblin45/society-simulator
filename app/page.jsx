"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import HomeComponent from "../components/HomeComponent";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center relative top-[-20] md:text-left md:absolute md:top-3 md:left-12 lg:left-20 xl:left-28 z-50"
      >
        <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-950">
          Simulate Analyze
        </motion.h1>
        <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-950 mt-2">
          Innovate
        </motion.h1>
        <motion.p className="text-lg md:text-xl lg:text-2xl mt-3 text-green-950">
          Predict Market Reactions Before You Launch!
        </motion.p>
      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center md:text-right md:absolute md:top-15 md:right-12 lg:right-20 xl:right-28 z-50"
      >
        <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-950">
          With AI-Powered
        </motion.h1>
        <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-950 mt-2">
          Social Insights
        </motion.h1>
        <motion.p className="text-lg md:text-xl lg:text-2xl mt-3 text-gray-600">
          Understand Your Audience Like Never Before!
        </motion.p>
        <button
          onClick={() => router.push("/simulation")}
          className="mt-8 flex justify-items-start px-6 md:px-8 py-3 text-lg z-999 md:text-xl font-semibold hover:text-green-950 hover:bg-[#FFFCF6] border border-gray-400 rounded-[20px] shadow-md bg-green-950 text-white hover:shadow-lg transition-all cursor-pointer"
        >
          Start Simulation
        </button>
      </motion.div>





      <div className="absolute top-10 left-0 w-full h-full">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1377 534"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hidden md:block"
        >
          <mask id="mask0" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="1377" height="534">
            <rect x="0.437744" y="0.342529" width="1375.91" height="533.275" fill="#D9D9D9"></rect>
          </mask>
          <g mask="url(#mask0)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M714.881 16.0235C698.784 5.32584 677.842 5.32584 661.745 16.0235L21.745 441.358C8.35822 450.255 0.312988 465.261 0.312988 481.335V1970.37C0.312988 1996.88 21.8033 2018.37 48.313 2018.37H688.313L1328.31 2018.37C1354.82 2018.37 1376.31 1996.88 1376.31 1970.37V481.335C1376.31 465.261 1368.27 450.255 1354.88 441.358L714.881 16.0235Z"
              fill="#FFFCF6"
            ></path>
          </g>
        </svg>
      </div>


      <div className="absolute bottom-0 left-0  w-full h-[30vh] md:h-[40vh] lg:h-[50vh] bg-[#FFFCF6]">

        <div className="md:mt-0 mt-30  flex flex-col items-center px-10">
          <h2 className="text-3xl font-bold text-gray-800 underline decoration-green-950 mb-6">
            What We Do
          </h2>
          <HomeComponent />
        </div>
      </div>





    </div>
  );
}
