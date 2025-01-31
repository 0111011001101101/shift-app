import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const GoalsStep = ({ form }: { form: any }) => {
  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <div className="flex justify-center">
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary-400 via-primary-500 to-accent 
                      shadow-xl shadow-primary-500/20 animate-float">
          <Target className="w-10 h-10 text-white" />
        </div>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="aiPreferences.primaryGoal"
          render={({ field }) => (
            <FormItem className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white shadow-lg">
              <FormLabel className="text-xl font-medium">What's your main focus?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 mt-2 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select your main goal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="productivity">Boost productivity & focus</SelectItem>
                  <SelectItem value="balance">Better work-life harmony</SelectItem>
                  <SelectItem value="growth">Accelerate personal growth</SelectItem>
                  <SelectItem value="stress">Master stress & energy</SelectItem>
                  <SelectItem value="leadership">Level up leadership</SelectItem>
                  <SelectItem value="purpose">Find deeper purpose</SelectItem>
                  <SelectItem value="relationships">Strengthen relationships</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aiPreferences.description"
          render={({ field }) => (
            <FormItem className="rounded-2xl bg-gradient-to-br from-accent-500 to-accent p-6 text-white shadow-lg">
              <FormLabel className="text-xl font-medium">Anything else you'd like to share?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="E.g., I want to grow my business while maintaining work-life balance..." 
                  {...field}
                  className="min-h-[120px] mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/70
                           focus:ring-white/30 focus-visible:ring-white/30 resize-none"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
};