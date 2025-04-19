import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  console.log('📥 POST /api/upload - Request received');
  try {
    const session = await getServerSession(authOptions);
    console.log('🔐 Session state:', { 
      authenticated: !!session, 
      email: session?.user?.email,
      role: session?.user?.role 
    });

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'GUIDE')) {
      console.log('❌ Unauthorized upload attempt');
      return NextResponse.json(
        { error: 'Unauthorized - Admin or Guide access required' },
        { status: 403 }
      );
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      console.log('❌ No file provided in request');
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('📁 Processing file:', { 
      name: file.name, 
      type: file.type, 
      size: file.size 
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    console.log('📝 Generated unique filename:', filename);
    
    // Upload to Supabase Storage
    console.log('⬆️ Uploading to Supabase Storage');
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('tour-images')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Error uploading to Supabase:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      );
    }

    // Get the public URL
    console.log('🔗 Generating public URL');
    const { data: { publicUrl } } = supabase
      .storage
      .from('tour-images')
      .getPublicUrl(filename);

    console.log('✅ File uploaded successfully:', { publicUrl });
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('❌ Error in file upload:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 