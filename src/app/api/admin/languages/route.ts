import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdminAuth } from '@/lib/middleware/adminAuth';
import { ProgrammingLanguageDocument, CreateLanguageData } from '@/lib/models/ProgrammingLanguage';

// Get all programming languages (admin view with full details)
export async function GET(request: NextRequest) {
  const authResult = await verifyAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error.message },
      { status: authResult.error.status }
    );
  }

  try {
    const db = await getDatabase();
    const languagesCollection = db.collection<ProgrammingLanguageDocument>('programming_languages');

    const languages = await languagesCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ languages });

  } catch (error) {
    console.error('Get admin languages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new programming language
export async function POST(request: NextRequest) {
  const authResult = await verifyAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error.message },
      { status: authResult.error.status }
    );
  }

  try {
    const { name, description, phases }: CreateLanguageData = await request.json();

    // Validation
    if (!name || !description || !phases || !Array.isArray(phases)) {
      return NextResponse.json(
        { error: 'Name, description, and phases are required' },
        { status: 400 }
      );
    }

    if (phases.length === 0) {
      return NextResponse.json(
        { error: 'At least one phase is required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Calculate total topics
    let totalTopics = 0;
    let topicId = 1;

    // Assign sequential IDs to topics
    const processedPhases = phases.map(phase => ({
      ...phase,
      topics: phase.topics.map(topic => {
        totalTopics++;
        return {
          ...topic,
          id: topicId++
        };
      })
    }));

    const db = await getDatabase();
    const languagesCollection = db.collection<ProgrammingLanguageDocument>('programming_languages');

    // Check if slug already exists
    const existingLanguage = await languagesCollection.findOne({ slug });
    if (existingLanguage) {
      return NextResponse.json(
        { error: 'A language with this name already exists' },
        { status: 409 }
      );
    }

    // Create language document
    const newLanguage: ProgrammingLanguageDocument = {
      name,
      slug,
      description,
      phases: processedPhases,
      totalTopics,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: authResult.user._id!
    };

    const result = await languagesCollection.insertOne(newLanguage);
    newLanguage._id = result.insertedId;

    return NextResponse.json({
      language: newLanguage,
      message: 'Programming language created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create language error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}