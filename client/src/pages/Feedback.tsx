import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { z } from 'zod';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useQuery } from "@tanstack/react-query";
import type { Feedback } from "@shared/schema";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const MAX_FEEDBACK_LENGTH = 500;

const feedbackSchema = z.object({
  content: z.string()
    .min(1, "Feedback is required")
    .max(MAX_FEEDBACK_LENGTH, `Feedback must be less than ${MAX_FEEDBACK_LENGTH} characters`),
  type: z.enum(["feature", "bug", "other"]),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

function formatDateTime(date: Date | null): string {
  if (!date) return 'Unknown';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export default function Feedback() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const ITEMS_PER_PAGE = 5;

  const { data: feedbackData, isLoading: isLoadingFeedback } = useQuery<{ items: Feedback[], total: number }>({
    queryKey: ['/api/feedback', page],
    queryFn: async () => {
      const response = await fetch(`/api/feedback?page=${page}&limit=${ITEMS_PER_PAGE}`);
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
      const response = await apiRequest("POST", "/api/feedback", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit feedback');
      }
      await response.json();

      queryClient.invalidateQueries({ queryKey: ['/api/feedback'] });

      toast({
        title: "Thanks for your feedback! 🎉",
        description: "Your feedback has been submitted successfully and will help us improve GifGetter.",
        duration: 5000,
        className: "bg-primary text-primary-foreground",
      });

      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.',
        variant: "destructive",
      });
      setIsDialogOpen(false);
    }
  };

  const totalPages = feedbackData ? Math.ceil(feedbackData.total / ITEMS_PER_PAGE) : 0;

  const handleSubmitClick = async () => {
    const isValid = await form.trigger();
    if (isValid && !Object.keys(form.formState.errors).length) {
      setIsDialogOpen(true);
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
                <form className="space-y-6">
                  <div className="min-h-[80px]">
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
                  </div>

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
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          onClick={handleSubmitClick}
                          disabled={form.formState.isSubmitting}
                          className="group"
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
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Submit Feedback</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to submit this feedback? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
                            Submit
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
              ) : feedbackData?.items && feedbackData.items.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {feedbackData.items.map((feedback) => (
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
                            {formatDateTime(feedback.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-primary/80">
                          {feedback.content}
                        </p>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
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