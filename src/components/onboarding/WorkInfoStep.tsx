import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const WorkInfoStep = ({ form }: { form: any }) => {
  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <div className="flex justify-center">
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary-400 via-primary-500 to-accent 
                      shadow-xl shadow-primary-500/20 animate-float">
          <Briefcase className="w-10 h-10 text-white" />
        </div>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="aiPreferences.occupation"
          render={({ field }) => (
            <FormItem className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white shadow-lg">
              <FormLabel className="text-xl font-medium">What's your role?</FormLabel>
              <FormControl>
                <Input 
                  placeholder="E.g., Entrepreneur, Manager, Developer..." 
                  {...field}
                  className="h-12 mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/70
                           focus:ring-white/30 focus-visible:ring-white/30"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aiPreferences.fieldOfWork"
          render={({ field }) => (
            <FormItem className="rounded-2xl bg-gradient-to-br from-accent-500 to-accent p-6 text-white shadow-lg">
              <FormLabel className="text-xl font-medium">Your Industry</FormLabel>
              <FormControl>
                <Input 
                  placeholder="E.g., Technology, Healthcare, Education..." 
                  {...field}
                  className="h-12 mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/70
                           focus:ring-white/30 focus-visible:ring-white/30"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
};