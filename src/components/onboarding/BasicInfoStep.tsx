import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const BasicInfoStep = ({ form }: { form: any }) => {
  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <div className="flex justify-center">
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary-400 via-primary-500 to-accent 
                      shadow-xl shadow-primary-500/20 animate-float">
          <Brain className="w-10 h-10 text-white" />
        </div>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="aiPreferences.age"
          render={({ field }) => (
            <FormItem className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white shadow-lg">
              <FormLabel className="text-xl font-medium">Age Range</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 mt-2 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select your age range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="18-24">18-24 years</SelectItem>
                  <SelectItem value="25-34">25-34 years</SelectItem>
                  <SelectItem value="35-44">35-44 years</SelectItem>
                  <SelectItem value="45-54">45-54 years</SelectItem>
                  <SelectItem value="55-64">55-64 years</SelectItem>
                  <SelectItem value="65+">65+ years</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aiPreferences.gender"
          render={({ field }) => (
            <FormItem className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
              <FormLabel className="text-xl font-medium">Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 mt-2 bg-white/10 border-white/20 text-white">
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
            <FormItem className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
              <FormLabel className="text-xl font-medium">Where are you based?</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your country" 
                  {...field}
                  className="h-12 mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/70
                           focus:ring-white/30 focus-visible:ring-white/30"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <p className="text-sm text-center text-secondary-600">
          You can skip personalization and set these preferences later
        </p>
      </div>
    </motion.div>
  );
};