import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { generateClient } from 'aws-amplify/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { z } from 'zod';
import { GifUploader } from "@/components/GifUploader";

const client = generateClient();

const feedbackSchema = z.object({
  content: z.string().min(1, "Feedback is required"),
  type: z.enum(["feature", "bug", "other"]),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

// GraphQL mutation
const createFeedback = /* GraphQL */ `
  mutation CreateFeedback(
    $input: CreateFeedbackInput!
  ) {
    createFeedback(input: $input) {
      id
      content
      type
      createdAt
    }
  }
`;

export default function Feedback() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, authStatus } = useAuthenticator();

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      content: "",
      type: "feature",
    },
  });

  // Redirect to authentication if not logged in
  if (authStatus !== 'authenticated') {
    setLocation('/');
    return null;
  }

  const onSubmit = async (data: FeedbackForm) => {
    try {
      await client.graphql({
        query: createFeedback,
        variables: {
          input: {
            userId: user.username,
            content: data.content,
            type: data.type,
          }
        }
      });

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
        <div className="max-w-2xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Test GIF Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <GifUploader />
            </CardContent>
          </Card>

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
                          <Textarea {...field} placeholder="Share your thoughts..." />
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