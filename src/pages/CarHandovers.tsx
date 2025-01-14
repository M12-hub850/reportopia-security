import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ReportCard } from "@/components/ReportCard";

const formSchema = z.object({
  carModel: z.string().min(2, "Car model is required"),
  plateNumber: z.string().min(1, "Plate number is required"),
  mileage: z.string().min(1, "Current mileage is required"),
  project: z.string().min(1, "Project location is required"),
  condition: z.string().min(10, "Please provide detailed condition notes"),
  carImages: z.array(z.string()).min(1, "At least one car condition image is required"),
  mileageImage: z.string().min(1, "Mileage meter image is required"),
});

type FormSchema = z.infer<typeof formSchema>;

const CarHandovers = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carModel: "",
      plateNumber: "",
      mileage: "",
      project: "",
      condition: "",
      carImages: [],
      mileageImage: "",
    },
  });

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof Pick<FormSchema, 'carImages' | 'mileageImage'>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fieldName === "carImages") {
          const currentImages = form.getValues("carImages");
          form.setValue("carImages", [...currentImages, reader.result as string]);
        } else {
          form.setValue(fieldName, reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormSchema) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Car Handover Form</h1>
          <p className="text-muted-foreground">Document vehicle transfers and conditions</p>
        </div>

        <ReportCard title="Vehicle Details" subtitle="Enter car information and current status">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="carModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Toyota Camry 2022" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="plateNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plate Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. ABC 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Mileage</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="project"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project name/location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Condition Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the current condition of the vehicle..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="carImages">Car Condition Images</Label>
                  <Input
                    id="carImages"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "carImages")}
                    className="mt-1"
                  />
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {form.watch("carImages").map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Car condition ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="mileageImage">Mileage Meter Image</Label>
                  <Input
                    id="mileageImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "mileageImage")}
                    className="mt-1"
                  />
                  {form.watch("mileageImage") && (
                    <img
                      src={form.watch("mileageImage")}
                      alt="Mileage meter"
                      className="mt-2 w-24 h-24 object-cover rounded-md"
                    />
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full">Submit Handover Form</Button>
            </form>
          </Form>
        </ReportCard>
      </div>
    </div>
  );
};

export default CarHandovers;