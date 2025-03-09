import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from 'zod';
import { apiRequest } from "@/lib/queryClient";

const MAX_FEEDBACK_LENGTH = 500;

const feedbackSchema = z.object({
  content: z.string()
    .min(1, "Feedback is required")
    .max(MAX_FEEDBACK_LENGTH, `Feedback must be less than ${MAX_FEEDBACK_LENGTH} characters`),
  type: z.enum(["feature", "bug", "other"]),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

export default function Feedback() {
  const { toast } = useToast();

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      content: "",
      type: "feature",
    },
  });

  const onSubmit = async (data: FeedbackForm) => {
    try {
      await apiRequest("POST", "/api/feedback", data);
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Submit Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="min-h-[80px] w-full">
                        <FormLabel>Feedback Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent 
                            position="popper" 
                            className="w-[200px]"
                          >
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="bug">Bug Report</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Feedback</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea 
                              {...field} 
                              placeholder="Share your thoughts..." 
                              className="min-h-[100px] resize-none"
                              maxLength={MAX_FEEDBACK_LENGTH}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                              {field.value.length}/{MAX_FEEDBACK_LENGTH}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Submitting..." : "Submit Feedback"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}