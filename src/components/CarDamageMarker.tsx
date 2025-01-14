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
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Load the car diagram image
    Image.fromURL("/lovable-uploads/033cd0fe-0aca-4311-8368-645c8967884d.png", (img) => {
      // Scale image to fit canvas while maintaining aspect ratio
      const scale = Math.min(
        (fabricCanvas.width! * 0.9) / img.width!,
        (fabricCanvas.height! * 0.9) / img.height!
      );
      
      img.scale(scale);
      
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