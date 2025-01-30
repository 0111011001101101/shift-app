import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const BasicInfoStep = ({ form }: { form: any }) => {
  return (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent 
                     bg-gradient-to-r from-primary-600 via-primary-500 to-accent">
          Tell us about yourself
        </h2>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="aiPreferences.age"
          render={({ field }) => (
            <FormItem className="rounded-2xl bg-[#0EA5E9] p-6 text-white shadow-lg">
              <FormLabel className="text-lg font-medium">Age Range</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select your age range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="18-24">18-24 years</SelectItem>
                  <SelectItem value="25-34">25-34 years</SelectItem>
                  <SelectItem value="35-44">35-44 years</SelectItem>
                  <SelectItem value="45-54">45-54 years</SelectItem>
                  <SelectItem value="55+">55+ years</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aiPreferences.gender"
          render={({ field }) => (
            <FormItem className="rounded-2xl bg-[#F97316] p-6 text-white shadow-lg">
              <FormLabel className="text-lg font-medium">Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aiPreferences.country"
          render={({ field }) => (
            <FormItem className="rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white shadow-lg">
              <FormLabel className="text-lg font-medium">Where are you based?</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your country" 
                  {...field}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
};