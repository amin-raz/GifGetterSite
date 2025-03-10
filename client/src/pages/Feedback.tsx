import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from 'zod';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useQuery } from "@tanstack/react-query";
import type { Feedback } from "@shared/schema";

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

  const { data: feedbackList, isLoading: isLoadingFeedback } = useQuery<Feedback[]>({
    queryKey: ['/api/feedback'],
    queryFn: async () => {
      const response = await fetch('/api/feedback');
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      return response.json();
    }
  });

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      content: "",
      type: "feature",
    },
  });

  const onSubmit = async (data: FeedbackForm) => {
    try {
      console.log('Submitting feedback:', data);
      const response = await apiRequest("POST", "/api/feedback", data);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Feedback submission result:', result);

      queryClient.invalidateQueries({ queryKey: ['/api/feedback'] });

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      form.reset();
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.',
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <Card className="group transition-colors duration-300 hover:bg-primary/5">
            <CardHeader>
              <CardTitle className="transition-colors duration-300 group-hover:text-primary">Submit Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feedback Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
                              className="min-h-[100px] resize-none transition-colors duration-300 focus:border-primary"
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
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="group flex items-center gap-2"
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <LoadingSpinner className="h-4 w-4" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Feedback'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingFeedback ? (
                <div className="flex justify-center p-4">
                  <LoadingSpinner className="h-6 w-6" />
                </div>
              ) : feedbackList && feedbackList.length > 0 ? (
                <div className="space-y-4">
                  {feedbackList.map((feedback) => (
                    <div key={feedback.id} className="p-4 rounded-lg border group transition-colors duration-300 hover:bg-primary/5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                            {feedback.type}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            by {feedback.username || 'Anonymous'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(feedback.createdAt!).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-primary/80">
                        {feedback.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No feedback submitted yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}