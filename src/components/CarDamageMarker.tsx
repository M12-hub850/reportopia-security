import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle } from "fabric";

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
      height: 300,
      backgroundColor: "#ffffff",
    });

    // Load the car diagram image
    fabricCanvas.setBackgroundImage(
      "/car-diagram.svg",
      () => {
        fabricCanvas.renderAll();
      },
      {
        scaleX: 0.8,
        scaleY: 0.8,
        originX: 'center',
        originY: 'center',
        left: fabricCanvas.width! / 2,
        top: fabricCanvas.height! / 2,
      }
    );

    // Load existing markings if any
    if (value) {
      try {
        const markings = JSON.parse(value);
        markings.forEach((marking: any) => {
          const circle = new Circle({
            left: marking.left,
            top: marking.top,
            radius: 10,
            fill: 'red',
            opacity: 0.5,
          });
          fabricCanvas.add(circle);
        });
      } catch (e) {
        console.error('Error loading markings:', e);
      }
    }

    // Add click handler to mark damages
    fabricCanvas.on('mouse:down', (options) => {
      const pointer = fabricCanvas.getPointer(options.e);
      const circle = new Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 10,
        fill: 'red',
        opacity: 0.5,
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