import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { X, Camera } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ConversationLogModalProps {
  onClose: () => void;
  onSuccess: () => void;
  teamMemberId: number;
  teamMemberName: string;
}

const conversationLogSchema = z.object({
  teamMemberId: z.number(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  message: z.string().optional(),
  photoUrl: z.string().optional(),
});

type ConversationFormData = z.infer<typeof conversationLogSchema>;

export default function ConversationLogModal({ onClose, onSuccess, teamMemberId, teamMemberName }: ConversationLogModalProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ConversationFormData>({
    resolver: zodResolver(conversationLogSchema),
    defaultValues: {
      teamMemberId: teamMemberId,
      name: "",
      email: "",
      phone: "",
      time: "",
      location: "",
      message: "",
      photoUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ConversationFormData) => {
      return apiRequest("POST", "/api/selfies", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Conversation has been logged successfully. Thank you!",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was an error logging your conversation. Please try again.",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we'd upload this to a server or service like S3
      // For now, create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        form.setValue("photoUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ConversationFormData) => {
    // Photo is now optional, so we remove the validation check
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
        <div className="bg-[#FFFE77] p-4 flex justify-between items-center">
          <h2 className="text-xl font-poppins font-bold text-[#292929]">Conversation or Teaching Session</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="flex justify-center mb-6">
              {photoPreview ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#FB4694]">
                  <img src={photoPreview} alt="Photo preview" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    onClick={() => {
                      setPhotoPreview(null);
                      form.setValue("photoUrl", "");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-300">
                  <label className="cursor-pointer p-2 flex flex-col items-center">
                    <Camera className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 text-center">Upload Picture (Optional)</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange} 
                    />
                  </label>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Input placeholder="Additional message (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="bg-[#FB4694] hover:bg-[#FB4694]/80"
              >
                {mutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}