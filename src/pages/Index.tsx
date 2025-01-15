import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/DashboardStats";
import { ReportCard } from "@/components/ReportCard";
import { VisitsOverview } from "@/components/VisitsOverview";
import { Link } from "react-router-dom";
import { VehicleDetailsForm } from "@/components/VehicleDetailsForm";
import { VehicleImageCapture } from "@/components/VehicleImageCapture";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, FormSchema } from "@/types/carHandover";

const Index = () => {
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

  const captureImage = async (
    fieldName: keyof Pick<FormSchema, 'carImages' | 'mileageImage'>
  ) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      const fileSelected = new Promise<File | null>((resolve) => {
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0] || null;
          resolve(file);
        };
      });

      input.click();

      const file = await fileSelected;
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
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const onSubmit = (data: FormSchema) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Security Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your security operations reports</p>
        </div>

        <DashboardStats />
        
        <VisitsOverview />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ReportCard
            title="Supervisor Weekly Visits"
            subtitle="Track site inspections and observations"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                View and manage weekly site visit reports from supervisors.
              </p>
              <Button asChild className="w-full">
                <Link to="/supervisor-reports">View Reports</Link>
              </Button>
            </div>
          </ReportCard>

          <ReportCard
            title="Manager Monthly Visits"
            subtitle="Monitor project performance"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Access monthly project visit reports and analytics.
              </p>
              <Button asChild className="w-full">
                <Link to="/manager-reports">View Reports</Link>
              </Button>
            </div>
          </ReportCard>

          <ReportCard
            title="Visitors Log"
            subtitle="Track visitor activity"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review and analyze visitor records and patterns.
              </p>
              <Button asChild className="w-full">
                <Link to="/visitor-logs">View Logs</Link>
              </Button>
            </div>
          </ReportCard>
        </div>

        <ReportCard
          title="Car Handover Form"
          subtitle="Document vehicle transfers and conditions"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <VehicleDetailsForm form={form} />
              <VehicleImageCapture form={form} onCaptureImage={captureImage} />
              <Button type="submit" className="w-full">Submit Handover Form</Button>
            </form>
          </Form>
        </ReportCard>
      </div>
    </div>
  );
};

export default Index;