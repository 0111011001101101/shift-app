import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const PreferencesStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-8 rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-xl border border-primary-100/30">
      <div className="flex justify-center">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500">
          <Target className="w-8 h-8" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-secondary-800">Your Work Style</h2>
        <p className="text-secondary-600">Help us match our approach to your preferences</p>
      </div>
      <FormField
        control={form.control}
        name="aiPreferences.workStyle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-secondary-800">How do you prefer to work?</FormLabel>
            <FormDescription>We'll adapt our suggestions to match your style</FormDescription>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 bg-white rounded-xl">
                  <SelectValue placeholder="Select your work style" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white/95 backdrop-blur-xl border-secondary-200">
                <SelectItem value="structured">I like structure and planning</SelectItem>
                <SelectItem value="flexible">I prefer flexibility and adaptability</SelectItem>
                <SelectItem value="balanced">I aim for a balance of both</SelectItem>
                <SelectItem value="deadline">I work best under deadlines</SelectItem>
                <SelectItem value="creative">I need creative freedom</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="aiPreferences.communicationStyle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-secondary-800">Communication preference</FormLabel>
            <FormDescription>How would you like SHIFT to interact with you?</FormDescription>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 bg-white rounded-xl">
                  <SelectValue placeholder="Select communication style" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white/95 backdrop-blur-xl border-secondary-200">
                <SelectItem value="direct">Direct and concise</SelectItem>
                <SelectItem value="detailed">Detailed and thorough</SelectItem>
                <SelectItem value="casual">Casual and friendly</SelectItem>
                <SelectItem value="motivational">Motivational and encouraging</SelectItem>
                <SelectItem value="analytical">Analytical and logical</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};