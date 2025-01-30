import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const NameStep = ({ form }: { form: any }) => {
  return (
    <motion.div variants={itemVariants} className="w-full max-w-sm mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold bg-clip-text text-transparent 
                    bg-gradient-to-r from-primary-600 via-primary-500 to-accent">
          What's your name?
        </h2>
      </div>
      
      <FormField
        control={form.control}
        name="firstName"
        rules={{ required: "Please enter your name" }}
        render={({ field }) => (
          <FormItem className="rounded-2xl bg-[#0EA5E9] p-6 text-white shadow-lg">
            <FormLabel className="text-lg font-medium">Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Your name" 
                {...field}
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
            </FormControl>
            <FormMessage className="text-white/90" />
          </FormItem>
        )}
      />
    </motion.div>
  );
};