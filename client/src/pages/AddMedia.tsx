import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Plus } from "lucide-react";
import { insertMediaItemSchema, type InsertMediaItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function AddMedia() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertMediaItem>({
    resolver: zodResolver(insertMediaItemSchema),
    defaultValues: {
      title: "",
      type: undefined,
      creator: "",
      genre: "",
      year: undefined,
    },
  });

  const createMediaMutation = useMutation({
    mutationFn: async (data: InsertMediaItem) => {
      const response = await apiRequest("POST", "/api/media", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Added Successfully!",
        description: "Your recommendation has been added to the community library.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add media item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMediaItem) => {
    createMediaMutation.mutate(data);
  };

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
              Share Your Favorites
            </h2>
            <p className="text-muted-foreground">
              Help the community discover amazing content by sharing your recommendations
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-add-media">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Media Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-media-type">
                                <SelectValue placeholder="Select type..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="TV">TV Show</SelectItem>
                              <SelectItem value="Movie">Movie</SelectItem>
                              <SelectItem value="Book">Book</SelectItem>
                              <SelectItem value="Music">Music</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1900"
                              max={ new Date().getFullYear().toString()}
                              placeholder="2023"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              value={field.value || ""}
                              data-testid="input-media-year"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
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
                    name="creator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Creator</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Author, Director, or Artist..." 
                            {...field} 
                            value={field.value || ""}
                            data-testid="input-media-creator"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Drama, Comedy, Action..." 
                            {...field} 
                            value={field.value || ""}
                            data-testid="input-media-genre"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={createMediaMutation.isPending}
                    data-testid="button-submit-media"
                  >
                    {createMediaMutation.isPending ? (
                      "Adding..."
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Community
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
