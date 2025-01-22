interface VehicleReportProps {
  carModel: string;
  plateNumber: string;
  mileage: number;
  project: string;
  condition: string;
  carImages?: string[];
  mileageImage?: string;
  receiverIdImage?: string | null;
  drivingLicenseImage?: string | null;
  description: string;
}

export function VehicleReportDisplay({
  carModel,
  plateNumber,
  mileage,
  project,
  condition,
  carImages,
  mileageImage,
  receiverIdImage,
  drivingLicenseImage,
  description
}: VehicleReportProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Car Model</p>
          <p className="text-sm text-muted-foreground">{carModel}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Plate Number</p>
          <p className="text-sm text-muted-foreground">{plateNumber}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Mileage</p>
          <p className="text-sm text-muted-foreground">{mileage}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Project</p>
          <p className="text-sm text-muted-foreground">{project}</p>
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium">Condition</p>
        <p className="text-sm text-muted-foreground">{condition}</p>
      </div>

      {description && (
        <div>
          <p className="text-sm font-medium">Description</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}
      
      {carImages && carImages.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Car Images</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {carImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Car image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
      
      {mileageImage && (
        <div>
          <p className="text-sm font-medium mb-2">Mileage Image</p>
          <img
            src={mileageImage}
            alt="Mileage"
            className="w-full max-w-md h-48 object-cover rounded-lg"
          />
        </div>
      )}
      
      {receiverIdImage && (
        <div>
          <p className="text-sm font-medium mb-2">Receiver ID</p>
          <img
            src={receiverIdImage}
            alt="Receiver ID"
            className="w-full max-w-md h-48 object-cover rounded-lg"
          />
        </div>
      )}
      
      {drivingLicenseImage && (
        <div>
          <p className="text-sm font-medium mb-2">Driving License</p>
          <img
            src={drivingLicenseImage}
            alt="Driving License"
            className="w-full max-w-md h-48 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
}