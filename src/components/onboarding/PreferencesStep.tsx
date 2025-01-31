import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const PreferencesStep = ({ form }: { form: any }) => {
  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <div className="flex justify-center">
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary-400 via-primary-500 to-accent 
                      shadow-xl shadow-primary-500/20 animate-float">
          <Settings className="w-10 h-10 text-white" />
        </div>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="aiPreferences.workStyle"
          render={({ field }) => (
            <FormItem className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white shadow-lg">
              <FormLabel className="text-xl font-medium">How do you prefer to work?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 mt-2 bg-white/10 border-white/20 text-white">
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
            <FormItem className="rounded-2xl bg-gradient-to-br from-accent-500 to-accent p-6 text-white shadow-lg">
              <FormLabel className="text-xl font-medium">Communication style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 mt-2 bg-white/10 border-white/20 text-white">
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