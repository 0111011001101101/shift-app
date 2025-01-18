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
    const { message, userId } = await req.json();
    console.log('Received request for user:', userId);

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch user's recent data for context
    console.log('Fetching user context...');
    const { data: standUps, error: standUpsError } = await supabaseClient
      .from('stand_ups')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (standUpsError) {
      console.error('Error fetching stand-ups:', standUpsError);
      throw standUpsError;
    }

    const { data: goals, error: goalsError } = await supabaseClient
      .from('goals')
      .select(`
        *,
        sub_goals (*)
      `)
      .eq('user_id', userId)
      .eq('completed', false);

    if (goalsError) {
      console.error('Error fetching goals:', goalsError);
      throw goalsError;
    }

    const { data: hurdles, error: hurdlesError } = await supabaseClient
      .from('hurdles')
      .select(`
        *,
        solutions (*)
      `)
      .eq('user_id', userId)
      .eq('completed', false);

    if (hurdlesError) {
      console.error('Error fetching hurdles:', hurdlesError);
      throw hurdlesError;
    }

    // Construct context for the AI
    const context = {
      recentMood: standUps?.[0]?.mental_health || null,
      recentWins: standUps?.[0]?.wins || null,
      currentFocus: standUps?.[0]?.focus || null,
      goals: goals?.map(g => ({
        title: g.title,
        deadline: g.deadline,
        subGoals: g.sub_goals?.map(sg => ({
          title: sg.title,
          frequency: sg.frequency,
          completed: sg.completed
        }))
      })) || [],
      hurdles: hurdles?.map(h => ({
        title: h.title,
        solutions: h.solutions?.map(s => ({
          title: s.title,
          frequency: s.frequency,
          completed: s.completed
        })) || []
      })) || []
    };

    console.log('Calling OpenAI with context:', JSON.stringify(context, null, 2));

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are an AI coach and mental health supporter for ambitious professionals. 
            Your goal is to provide empathetic, practical advice while maintaining a growth mindset.
            
            Here's the current context about the user:
            - Current mood: ${context.recentMood}/10
            - Recent wins: ${context.recentWins}
            - Current focus: ${context.currentFocus}
            
            Active goals:
            ${context.goals.map(g => `
              - ${g.title} (Due: ${g.deadline || 'No deadline'})
                Sub-goals:
                ${g.subGoals?.map(sg => `
                  - ${sg.title} (${sg.frequency || 'No frequency'}) - ${sg.completed ? 'Completed' : 'In Progress'}`).join('\n') || 'No sub-goals'
            }`).join('\n')}
            
            Current hurdles:
            ${context.hurdles.map(h => `
              - ${h.title}
                Solutions:
                ${h.solutions?.map(s => `
                  - ${s.title} (${s.frequency || 'No frequency'}) - ${s.completed ? 'Completed' : 'In Progress'}`).join('\n') || 'No solutions'
            }`).join('\n')}
            
            Keep responses concise, practical, and encouraging. If the user seems to be struggling 
            (mood < 5), show extra empathy and offer specific coping strategies. Reference their specific
            goals, hurdles, and progress to provide personalized advice.`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await openAIResponse.json();
    console.log('OpenAI response received:', data);

    return new Response(
      JSON.stringify({ 
        reply: data.choices[0].message.content,
        context 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
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