export interface VehicleReportTable {
  Row: {
    id: string;
    user_id: string;
    car_model: string;
    plate_number: string;
    mileage: number;
    project: string;
    condition: string;
    car_images: string[];
    mileage_image: string;
    created_at: string;
    receiver_id_image: string | null;
    driving_license_image: string | null;
  }
  Insert: {
    id?: string;
    user_id: string;
    car_model: string;
    plate_number: string;
    mileage: number;
    project: string;
    condition: string;
    car_images: string[];
    mileage_image: string;
    created_at?: string;
    receiver_id_image?: string | null;
    driving_license_image?: string | null;
  }
  Update: {
    id?: string;
    user_id?: string;
    car_model?: string;
    plate_number?: string;
    mileage?: number;
    project?: string;
    condition?: string;
    car_images?: string[];
    mileage_image?: string;
    created_at?: string;
    receiver_id_image?: string | null;
    driving_license_image?: string | null;
  }
}