// src/app/api/tasks/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the Service Role Key on the server
);

export async function POST(request: Request) {
  const { title } = await request.json();

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  try {
    const userIdentifier = "user@example.com";

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, is_complete: false, user_identifier: userIdentifier })
      .select()
      .single();

    if (error) throw error;
    
    // --- N8N TRIGGER WILL GO HERE ---
    console.log("Task created via API, would trigger N8N now with data:", data);

    return NextResponse.json(data, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}