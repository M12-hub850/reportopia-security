import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Image } from "fabric";

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

    // Load the car diagram image using the new Fabric.js v6 API
    Image.fromURL("/car-diagram.svg", (img) => {
      img.scaleToWidth(480); // 0.8 * 600
      img.scaleToHeight(240); // 0.8 * 300
      
      // Center the image
      const center = fabricCanvas.getCenter();
      img.set({
        left: center.left,
        top: center.top,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });
      
      fabricCanvas.backgroundImage = img;
      fabricCanvas.renderAll();
    });

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
            selectable: false,
            evented: false
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