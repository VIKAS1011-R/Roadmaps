import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ProgrammingLanguageDocument } from '@/lib/models/ProgrammingLanguage';

// Get specific programming language by slug (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const db = await getDatabase();
    const languagesCollection = db.collection<ProgrammingLanguageDocument>('programming_languages');

    const language = await languagesCollection.findOne({ slug: params.slug });
    
    if (!language) {
      return NextResponse.json(
        { error: 'Programming language not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ language });

  } catch (error) {
    console.error('Get language error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}