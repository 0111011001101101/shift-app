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
    console.log('Received request to ai-coach-suggest');
    const { userId, lastSuggestionTime } = await req.json();
    
    if (!userId) {
      console.error('No user ID provided');
      throw new Error('User ID is required');
    }

    // Initialize Supabase client with better error handling
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Server configuration error');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Fetch user's profile for personalization
    console.log('Fetching user profile...');
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    // Fetch recent stand-ups for context
    console.log('Fetching recent stand-ups...');
    const { data: recentStandUps, error: standUpsError } = await supabaseClient
      .from('stand_ups')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (standUpsError) {
      console.error('Error fetching stand-ups:', standUpsError);
      throw standUpsError;
    }

    // Fetch active hurdles for additional context
    console.log('Fetching active hurdles...');
    const { data: activeHurdles, error: hurdlesError } = await supabaseClient
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

    // Construct rich context for AI
    const context = {
      userProfile: {
        firstName: profile?.first_name,
        preferences: profile?.ai_preferences || {},
      },
      recentMood: recentStandUps?.[0]?.mental_health,
      recentWins: recentStandUps?.[0]?.wins,
      currentFocus: recentStandUps?.[0]?.focus,
      activeHurdles: activeHurdles?.map(h => ({
        title: h.title,
        solutions: h.solutions
      }))
    };

    console.log('Constructed AI context:', JSON.stringify(context, null, 2));

    // Call OpenAI API with enhanced configuration
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an AI coach specializing in helping ambitious professionals achieve their goals while maintaining mental well-being. 
            
            Current context about the user:
            - Name: ${context.userProfile.firstName || 'User'}
            - Recent mood: ${context.recentMood}/10
            - Recent wins: ${context.recentWins}
            - Current focus: ${context.currentFocus}
            
            Active hurdles they're facing:
            ${context.activeHurdles?.map(h => `- ${h.title}`).join('\n') || 'No active hurdles'}
            
            Your task is to:
            1. Analyze their current state
            2. Provide actionable suggestions
            3. Keep responses concise and encouraging
            4. Consider their current mental state
            
            Keep responses concise, practical, and encouraging. If their recent mood is below 6,
            show extra empathy and suggest manageable steps. Reference their specific situation
            and recent wins to provide personalized advice.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.3,
        frequency_penalty: 0.5,
      }),
    });

    if (!openAiResponse.ok) {
      const errorData = await openAiResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await openAiResponse.json();
    console.log('Successfully received OpenAI response');
    
    return new Response(
      JSON.stringify({
        suggestion: data.choices[0].message.content,
        context
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
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
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});