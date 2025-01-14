import { Canvas as FabricCanvas, Image } from "fabric";

export const setupCarImage = (
  fabricCanvas: FabricCanvas,
  imagePath: string
): Promise<void> => {
  return new Promise((resolve) => {
    Image.fromURL(imagePath, {
      crossOrigin: 'anonymous',
      scaleX: 1,
      scaleY: 1,
    }).then((img) => {
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
      resolve();
    });
  });
};

export const addDamageMarker = (
  fabricCanvas: FabricCanvas,
  x: number,
  y: number
) => {
  return new Circle({
    left: x,
    top: y,
    radius: 10,
    fill: 'red',
    opacity: 0.5,
    selectable: false,
    evented: false
  });
};

interface DamageMarking {
  left: number;
  top: number;
}

export const loadExistingMarkings = (
  fabricCanvas: FabricCanvas,
  markingsJson: string
) => {
  try {
    const markings: DamageMarking[] = JSON.parse(markingsJson);
    markings.forEach((marking) => {
      const circle = addDamageMarker(fabricCanvas, marking.left, marking.top);
      fabricCanvas.add(circle);
    });
  } catch (e) {
    console.error('Error loading markings:', e);
  }
};