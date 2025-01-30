import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const NameStep = ({ form }: { form: any }) => {
  return (
    <motion.div variants={itemVariants} className="w-full max-w-sm mx-auto space-y-8">
      <div className="flex justify-center">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-600/90 to-accent/90 
                    shadow-lg shadow-primary-500/20 animate-float backdrop-blur-xl">
          <User className="w-6 h-6 text-white" />
        </div>
      </div>
      <FormField
        control={form.control}
        name="firstName"
        rules={{ required: "Please enter your name" }}
        render={({ field }) => (
          <FormItem className="space-y-4">
            <div className="space-y-2">
              <FormLabel className="text-xl font-semibold bg-clip-text text-transparent 
                                bg-gradient-to-r from-primary-600 via-primary-500 to-accent">
                Hey there! What should we call you?
              </FormLabel>
              <FormDescription className="text-sm text-secondary-600/90">
                We'll use your name to personalize your experience and make our conversations more natural.
                Your name helps us understand how to address you and tailor our support to your preferences.
              </FormDescription>
            </div>
            <FormControl>
              <Input 
                placeholder="Your name" 
                {...field}
                className="h-11 text-base bg-white/80 backdrop-blur-sm rounded-xl 
                         border-secondary-200/30 focus:border-primary-400 focus:ring-primary-400/20 
                         shadow-sm placeholder:text-secondary-400/70 transition-all duration-300"
              />
            </FormControl>
            <FormMessage className="text-sm" />
          </FormItem>
        )}
      />
    </motion.div>
  );
};