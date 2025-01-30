import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const NameStep = ({ form }: { form: any }) => {
  return (
    <motion.div variants={itemVariants} className="w-full max-w-sm mx-auto space-y-8">
      <div className="text-center space-y-3">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-accent 
                     flex items-center justify-center shadow-lg"
        >
          <User className="w-8 h-8 text-white" strokeWidth={2} />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Welcome!</h1>
          <h2 className="text-xl font-medium text-secondary-600">
            How can we call you?
          </h2>
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="firstName"
        rules={{ required: "Please enter your name" }}
        render={({ field }) => (
          <FormItem className="rounded-2xl bg-gradient-to-br from-primary-500 to-accent p-6 
                              text-white shadow-lg animate-fade-in">
            <FormLabel className="text-lg font-medium">Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Your name" 
                {...field}
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70
                          focus:ring-white/30 focus:border-white/30"
              />
            </FormControl>
            <FormMessage className="text-white/90" />
          </FormItem>
        )}
      />
    </motion.div>
  );
};