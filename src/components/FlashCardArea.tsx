import { useState } from "react";
import { motion } from "framer-motion";

type FlashCard = {
  id: number;
  question: string;
  answer: string;
};

type FlashCardAreaProps = {
  data: FlashCard[];
};

const FlashCardArea: React.FC<FlashCardAreaProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className="relative w-96 h-56 bg-pink-100 shadow-xl rounded-2xl flex items-center justify-center text-center cursor-pointer"
        onClick={() => setFlipped(!flipped)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute w-full h-full flex items-center justify-center p-4"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-lg font-semibold text-black">
            {data[currentIndex].question}
          </p>
        </div>
        <div
          className="absolute w-full h-full flex items-center justify-center p-4 bg-green-200 rounded-2xl"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-lg font-semibold text-black">
            {data[currentIndex].answer}
          </p>
        </div>
      </motion.div>
      <div className="mt-6 flex space-x-4">
        <button
          className="bg-slate-400 px-2 py-2 rounded-sm w-[150px] text-black font-semibold"
          onClick={handlePrev}
        >
          Previous
        </button>
        <button
          className="bg-green-500 px-2 py-2 rounded-sm w-[150px] font-semibold"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FlashCardArea;
