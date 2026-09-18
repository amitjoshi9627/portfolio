import { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import parallaxBg from "../../assets/parallax.png";

interface ParallaxLayersProps {
  reduced: boolean;
  lowPower: boolean;
}

export const ParallaxLayers = memo(function ParallaxLayers({
  reduced,
  lowPower,
}: ParallaxLayersProps) {
  const { scrollYProgress } = useScroll();

  // Gentle, cinematic parallax for the beautiful landscape image
  const bgY = useTransform(scrollYProgress, [0, 1], reduced || lowPower ? ["0%", "0%"] : ["-10%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-ink-mid">

      {/* 
        The main parallax landscape image.
        We scale it up slightly so we have room to move it up and down.
      */}
      <motion.div
        className="absolute inset-[-10%] h-[120%] w-[120%]"
        style={{
          y: bgY,
          scale: bgScale,
          backgroundImage: `url(${parallaxBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 80%",
        }}
      />

      {/* Overlay gradient to softly blend the bottom into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-mid to-transparent" />
    </div>
  );
});
