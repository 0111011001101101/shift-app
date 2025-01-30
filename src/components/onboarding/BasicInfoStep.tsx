import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const BasicInfoStep = ({ form }: { form: any }) => {
  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <div className="flex justify-center">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-600/90 to-accent/90 
                    shadow-lg shadow-primary-500/20 animate-float backdrop-blur-xl">
          <Brain className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent 
                     bg-gradient-to-r from-primary-600 via-primary-500 to-accent">
          Let's get to know you better
        </h2>
        <p className="text-sm text-secondary-600/90">
          Understanding more about you helps us provide more relevant support and personalized guidance
        </p>
      </div>

      <div className="space-y-6 rounded-xl bg-white/80 backdrop-blur-xl p-6 
                     shadow-sm border border-secondary-200/30">
        <FormField
          control={form.control}
          name="aiPreferences.age"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-secondary-700">Age Range</FormLabel>
              <FormDescription className="text-xs text-secondary-500">
                Your age range helps us understand your life stage and provide relevant advice
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-10 bg-white/90 rounded-lg text-sm">
                    <SelectValue placeholder="Select your age range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white/95 backdrop-blur-xl border-secondary-200/30">
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
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-medium text-secondary-800">Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/90 rounded-xl text-base">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white/95 backdrop-blur-sm border-secondary-200">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="aiPreferences.country"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-secondary-800">Where are you based?</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your country" 
                          {...field}
                          className="h-12 text-base bg-white/90 rounded-xl"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aiPreferences.ethnicity"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-secondary-800">Ethnicity</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your ethnicity" 
                          {...field}
                          className="h-12 text-base bg-white/90 rounded-xl"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="aiPreferences.religion"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-medium text-secondary-800">Religion/Spirituality</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your religion or spiritual practice" 
                        {...field}
                        className="h-12 text-base bg-white/90 rounded-xl"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
      </div>
    </motion.div>
  );
};
