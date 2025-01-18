import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch user's recent data for context
    const { data: standUps } = await supabaseClient
      .from('stand_ups')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: goals } = await supabaseClient
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: hurdles } = await supabaseClient
      .from('hurdles')
      .select('*, solutions(*)')
      .eq('user_id', userId)
      .eq('completed', false)
      .order('created_at', { ascending: false })
      .limit(5);

    // Construct context for the AI
    const context = {
      recentMood: standUps?.[0]?.mental_health || null,
      recentWins: standUps?.[0]?.wins || null,
      currentFocus: standUps?.[0]?.focus || null,
      activeGoals: goals?.map(g => g.title) || [],
      activeHurdles: hurdles?.map(h => ({
        title: h.title,
        solutions: h.solutions?.map(s => s.title) || []
      })) || []
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
            content: `You are an AI coach and mental health supporter for ambitious professionals. 
            Your goal is to provide empathetic, practical advice while maintaining a growth mindset.
            
            Recent context about the user:
            - Current mood: ${context.recentMood}/10
            - Recent wins: ${context.recentWins}
            - Current focus: ${context.currentFocus}
            - Active goals: ${context.activeGoals.join(', ')}
            - Current hurdles: ${context.activeHurdles.map(h => h.title).join(', ')}
            
            Keep responses concise, practical, and encouraging. If the user seems to be struggling 
            (mood < 5), show extra empathy and offer specific coping strategies.`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    console.log('AI Response:', data);

    return new Response(
      JSON.stringify({ 
        reply: data.choices[0].message.content,
        context: context 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});