import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Plus } from "lucide-react";
import { InsertReportItem,  } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Report() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertReportItem>({
    defaultValues: {
      MediaTitle: "",
      Issue: "",
      CorrectVersion: "",
    }
  });

  const createReportMutation = useMutation({
    mutationFn: async (data: InsertReportItem) => {
      const response = await apiRequest("POST", "api/media/report", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted!",
        description: "Thank you for helping us improve NextUp.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/media/report"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });
  function onSubmit(data: InsertReportItem) {
    createReportMutation.mutate(data);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/" 
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-back-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold" data-testid="text-add-media-title">
              Report an Issue
            </h2>
            <p className="text-muted-foreground">
              Made a mistake? Let me know so I can fix it!
            </p>
          </div>
          <Card>
            <CardContent>
              <h2 className="text-2xl font-bold mb-6 text-center"></h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="MediaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter the title..." 
                            {...field} 
                            data-testid="input-media-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Issue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Describe the issue..." 
                            {...field} 
                            data-testid="input-media-issue"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="CorrectVersion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correct Version</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="If applicable, provide the correct version..." 
                            {...field} 
                            data-testid="input-media-correct-version"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={createReportMutation.isPending}
                    data-testid="button-submit-media"
                  >
                    {createReportMutation.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Submit Issue
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
