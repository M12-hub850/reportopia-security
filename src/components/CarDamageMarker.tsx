import { Canvas } from "fabric";
import { useEffect, useRef } from "react";
import { loadBackgroundImage } from "@/utils/fabricUtils";

interface CarDamageMarkerProps {
  imageUrl: string;
}

export function CarDamageMarker({ imageUrl }: CarDamageMarkerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    fabricCanvasRef.current = new Canvas(canvasRef.current);
    loadBackgroundImage(fabricCanvasRef.current, imageUrl);

    return () => {
      fabricCanvasRef.current?.dispose();
    };
  }, [imageUrl]);

  return <canvas ref={canvasRef} />;
}