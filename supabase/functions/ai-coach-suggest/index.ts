import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch user's recent data
    const { data: recentStandUps } = await supabaseClient
      .from('stand_ups')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: goals } = await supabaseClient
      .from('goals')
      .select('*, sub_goals(*)')
      .eq('user_id', userId)
      .eq('completed', false);

    const { data: hurdles } = await supabaseClient
      .from('hurdles')
      .select('*, solutions(*)')
      .eq('user_id', userId)
      .eq('completed', false);

    // Analyze patterns and triggers
    const triggers = [];

    // Check for mood patterns
    const recentMoods = recentStandUps?.map(s => s.mental_health) || [];
    const avgMood = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
    if (avgMood < 5) {
      triggers.push('low_mood');
    }

    // Check for stalled goals
    const stalledGoals = goals?.filter(g => 
      g.sub_goals?.every(sg => !sg.completed) && 
      new Date(g.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ) || [];
    if (stalledGoals.length > 0) {
      triggers.push('stalled_goals');
    }

    // Check for unaddressed hurdles
    const unaddressedHurdles = hurdles?.filter(h => 
      !h.solutions || h.solutions.length === 0
    ) || [];
    if (unaddressedHurdles.length > 0) {
      triggers.push('unaddressed_hurdles');
    }

    // If we have triggers, generate an AI suggestion
    if (triggers.length > 0) {
      const context = {
        recentMood: avgMood,
        stalledGoals: stalledGoals.map(g => g.title),
        unaddressedHurdles: unaddressedHurdles.map(h => h.title),
        recentWins: recentStandUps?.[0]?.wins || null,
        currentFocus: recentStandUps?.[0]?.focus || null,
      };

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a proactive AI coach and mental health supporter. 
              Based on the user's data, generate a supportive message that addresses their current challenges.
              Keep responses concise, practical, and encouraging.
              
              Current triggers: ${triggers.join(', ')}
              User context:
              - Average recent mood: ${context.recentMood}/10
              - Stalled goals: ${context.stalledGoals.join(', ')}
              - Unaddressed hurdles: ${context.unaddressedHurdles.join(', ')}
              - Recent wins: ${context.recentWins}
              - Current focus: ${context.currentFocus}
              
              If mood is low, show extra empathy and offer specific coping strategies.
              If goals are stalled, provide actionable steps to make progress.
              If hurdles are unaddressed, suggest practical solutions.`
            }
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      const data = await response.json();
      console.log('AI Suggestion:', data);

      return new Response(
        JSON.stringify({ 
          suggestion: data.choices[0].message.content,
          triggers,
          context 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ suggestion: null, triggers: [], context: null }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-coach-suggest function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});