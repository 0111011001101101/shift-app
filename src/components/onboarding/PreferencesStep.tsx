import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const PreferencesStep = ({ form }: { form: any }) => {
  return (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold bg-clip-text text-transparent 
                    bg-gradient-to-r from-primary-600 via-primary-500 to-accent">
          Your Preferences
        </h2>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="aiPreferences.workStyle"
          render={({ field }) => (
            <FormItem className="rounded-2xl bg-[#0EA5E9] p-6 text-white shadow-lg">
              <FormLabel className="text-lg font-medium">How do you prefer to work?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select your work style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
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
            <FormItem className="rounded-2xl bg-[#F97316] p-6 text-white shadow-lg">
              <FormLabel className="text-lg font-medium">Communication style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select communication style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
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
    </motion.div>
  );
};