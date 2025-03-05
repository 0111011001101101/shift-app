
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TodoList } from "@/components/home/TodoList";
import { Card } from "@/components/ui/card";

export function TodoSection() {
  const [focusTab, setFocusTab] = useState<"daily" | "weekly">("daily");
  
  return (
    <motion.section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-800 px-1 flex items-center gap-2">
        Today's Focus
      </h2>
      
      <Card className="rounded-xl overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
        <Tabs 
          defaultValue="daily" 
          value={focusTab} 
          onValueChange={(value) => setFocusTab(value as "daily" | "weekly")}
          className="w-full"
        >
          <div className="px-4 pt-4 pb-2">
            <TabsList className="bg-gray-100 w-full grid grid-cols-2 h-10 p-1 rounded-lg">
              <TabsTrigger 
                value="daily" 
                className="text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md data-[state=active]:font-medium"
              >
                Today
              </TabsTrigger>
              <TabsTrigger 
                value="weekly"
                className="text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md data-[state=active]:font-medium"
              >
                This Week
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="daily" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <TodoList frequency="daily" />
          </TabsContent>
          <TabsContent value="weekly" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <TodoList frequency="weekly" />
          </TabsContent>
        </Tabs>
      </Card>
    </motion.section>
  );
}
