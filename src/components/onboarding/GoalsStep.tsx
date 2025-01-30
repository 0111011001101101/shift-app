import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export const GoalsStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-12">
      <div className="flex justify-center">
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary-400 via-primary-500 to-accent 
                      shadow-xl shadow-primary-500/20 animate-float">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
      </div>
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                     from-primary-600 via-primary-500 to-accent leading-tight tracking-tight">
          Almost there!
        </h2>
        <p className="text-xl text-secondary-600">Let's focus on what matters most to you</p>
      </div>
      <FormField
        control={form.control}
        name="aiPreferences.primaryGoal"
        render={({ field }) => (
          <FormItem className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl 
                             border border-primary-100/30 space-y-6">
            <FormLabel className="text-2xl font-bold text-secondary-800">
              What's your main focus?
            </FormLabel>
            <FormDescription className="text-lg text-secondary-600">
              This helps us prioritize what's important to you
            </FormDescription>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-14 bg-white/90 rounded-xl text-base border-secondary-200
                                        focus:border-primary-400 focus:ring-primary-400/20">
                  <SelectValue placeholder="Select your main goal" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white/95 backdrop-blur-xl border-secondary-200">
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
          <FormItem className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl 
                             border border-primary-100/30 space-y-6">
            <FormLabel className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                                from-primary-600 via-primary-500 to-accent leading-tight tracking-tight">
              Other things about you that you want to share?
            </FormLabel>
            <FormDescription className="text-lg text-secondary-600">
              Share any specific challenges or goals you'd like help with
            </FormDescription>
            <FormControl>
              <Textarea 
                placeholder="E.g., I want to grow my business while maintaining work-life balance..." 
                {...field}
                className="min-h-[140px] bg-white/90 rounded-xl resize-none border-secondary-200
                         focus:border-primary-400 focus:ring-primary-400/20 text-base"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};