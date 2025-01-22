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
    const { userId, lastSuggestionTime } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // If last suggestion was less than 30 minutes ago, don't suggest
    if (lastSuggestionTime) {
      const timeSinceLastSuggestion = Date.now() - new Date(lastSuggestionTime).getTime();
      if (timeSinceLastSuggestion < 30 * 60 * 1000) {
        return new Response(
          JSON.stringify({ suggestion: null }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch comprehensive user context
    const [
      { data: goals },
      { data: hurdles },
      { data: standUps },
      { data: profile }
    ] = await Promise.all([
      supabaseClient
        .from('goals')
        .select('*, sub_goals(*)')
        .eq('user_id', userId)
        .eq('completed', false)
        .order('created_at', { ascending: false })
        .limit(3),
      supabaseClient
        .from('hurdles')
        .select('*, solutions(*)')
        .eq('user_id', userId)
        .eq('completed', false)
        .order('created_at', { ascending: false })
        .limit(3),
      supabaseClient
        .from('stand_ups')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    ]);

    // Analyze patterns and determine most relevant suggestion
    const context = {
      stagnantGoals: goals?.filter(g => 
        g.sub_goals?.every(sg => !sg.completed) && 
        new Date(g.created_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ) || [],
      unaddressedHurdles: hurdles?.filter(h => !h.solutions?.length) || [],
      recentMoodTrend: standUps?.map(s => s.mental_health) || [],
      streak: profile?.streak || 0,
      lastStandUp: profile?.last_stand_up,
    };

    // Call OpenAI API with rich context
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
            content: `You are a proactive executive coach for ambitious professionals. 
            Your suggestions should be specific, actionable, and tied to the user's current context.
            Focus on one clear next step or insight rather than general advice.
            Be concise but impactful. Limit response to 2-3 sentences.
            
            Current context:
            - Stagnant goals: ${context.stagnantGoals.map(g => g.title).join(', ')}
            - Unaddressed hurdles: ${context.unaddressedHurdles.map(h => h.title).join(', ')}
            - Recent mood trend: ${context.recentMoodTrend.join(', ')}
            - Current streak: ${context.streak}
            - Last stand-up: ${context.lastStandUp}
            
            Only provide a suggestion if there's a clear opportunity for impact.`
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ 
        suggestion: data.choices[0].message.content,
        context 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-coach-suggest function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});