import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const WorkInfoStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-8 rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-xl border border-primary-100/30">
      <div className="flex justify-center">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500">
          <Rocket className="w-8 h-8" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-secondary-800">Your Professional World</h2>
        <p className="text-secondary-600">Understanding your work helps us provide relevant strategies</p>
      </div>
      <FormField
        control={form.control}
        name="aiPreferences.occupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-secondary-800">What's your role?</FormLabel>
            <FormDescription>Each role comes with its unique challenges</FormDescription>
            <FormControl>
              <Input 
                placeholder="E.g., Entrepreneur, Manager, Developer..." 
                {...field}
                className="h-12 text-base bg-white rounded-xl"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="aiPreferences.fieldOfWork"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-secondary-800">Your Industry</FormLabel>
            <FormDescription>Different industries face different pressures</FormDescription>
            <FormControl>
              <Input 
                placeholder="E.g., Technology, Healthcare, Education..." 
                {...field}
                className="h-12 text-base bg-white rounded-xl"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};