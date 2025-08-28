// src/app/api/tasks/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { title } = await request.json();

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  try {
    const userIdentifier = "user@example.com";

    const { data: newTask, error } = await supabase
      .from('tasks')
      .insert({ title, is_complete: false, user_identifier: userIdentifier })
      .select()
      .single();

    if (error) throw error;
    
    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      }).catch(err => {
        console.error("Error calling N8N webhook:", err);
      });
    }

    return NextResponse.json(newTask, { status: 201 });

  } catch (error: unknown) { // CHANGED from 'any' to 'unknown'
    return NextResponse.json({ error: (error as Error).message }, { status: 500 }); // Type-cast the error
  }
}