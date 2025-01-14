import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle } from "fabric";
import { setupCarImage, loadExistingMarkings } from "@/utils/fabricUtils";

interface CarDamageMarkerProps {
  onChange: (markings: string) => void;
  value?: string;
}

export const CarDamageMarker = ({ onChange, value }: CarDamageMarkerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Initialize canvas with car image
    setupCarImage(fabricCanvas, "/car-diagram.svg").then(() => {
      // Load existing markings if any
      if (value) {
        loadExistingMarkings(fabricCanvas, value);
      }
    });

    // Handle click events for adding damage markers
    fabricCanvas.on('mouse:down', (options) => {
      const pointer = fabricCanvas.getPointer(options.e);
      const circle = new Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 10,
        fill: 'red',
        opacity: 0.5,
        selectable: false,
        evented: false
      });
      
      fabricCanvas.add(circle);
      
      // Save all markings
      const markings = fabricCanvas.getObjects().map(obj => ({
        left: obj.left,
        top: obj.top,
      }));
      onChange(JSON.stringify(markings));
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <canvas ref={canvasRef} />
      <p className="text-sm text-muted-foreground p-2">
        Click on the diagram to mark areas of damage
      </p>
    </div>
  );
};