import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';
import { ProgrammingLanguageDocument } from '../../../lib/models/ProgrammingLanguage';

// Get all programming languages (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const languagesCollection = db.collection<ProgrammingLanguageDocument>('programming_languages');

    const languages = await languagesCollection
      .find({})
      .sort({ createdAt: -1 })
      .project({ 
        name: 1, 
        slug: 1, 
        description: 1, 
        totalTopics: 1, 
        createdAt: 1 
      })
      .toArray();

    return NextResponse.json({ languages });

  } catch (error) {
    console.error('Get languages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}