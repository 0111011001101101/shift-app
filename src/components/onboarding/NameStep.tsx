import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const NameStep = ({ form }: { form: any }) => {
  return (
    <motion.div variants={itemVariants} className="w-full max-w-sm mx-auto space-y-8">
      <div className="flex justify-center">
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary-400 via-primary-500 to-accent 
                      shadow-xl shadow-primary-500/20 animate-float">
          <User className="w-10 h-10 text-white" />
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="firstName"
        rules={{ required: "Please enter your name" }}
        render={({ field }) => (
          <FormItem className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white shadow-lg">
            <FormLabel className="text-xl font-medium">What's your name?</FormLabel>
            <FormControl>
              <Input 
                placeholder="Your name" 
                {...field}
                className="h-12 mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/70
                         focus:ring-white/30 focus-visible:ring-white/30"
              />
            </FormControl>
            <FormMessage className="text-white/90" />
          </FormItem>
        )}
      />
    </motion.div>
  );
};