import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/auth';
import { UserDocument, UpdateProgressData } from '../../../../lib/models/User';
import { TopicStatus } from '../../../../lib/types';

// Get user progress
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>('users');

    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      progress: user.progress
    });

  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update topic status
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { languageSlug, topicId, status }: UpdateProgressData = await request.json();

    // Validation
    if (!languageSlug || !topicId || !status) {
      return NextResponse.json(
        { error: 'Language slug, topic ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses: TopicStatus[] = ['pending', 'learning', 'onhold', 'completed', 'ignore'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    if (topicId < 1 || topicId > 40) {
      return NextResponse.json(
        { error: 'Invalid topic ID' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>('users');

    // Get current user
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize language progress if it doesn't exist
    if (!user.progress[languageSlug]) {
      user.progress[languageSlug] = {
        topicStatuses: {},
        completedTopics: 0,
        totalTopics: 40, // Default, should be fetched from language document
        lastUpdated: new Date()
      };
    }

    // Update topic status
    const updatedTopicStatuses = { ...user.progress[languageSlug].topicStatuses };
    updatedTopicStatuses[topicId] = status;

    // Calculate completed topics count for this language
    const completedTopics = Object.values(updatedTopicStatuses).filter(s => s === 'completed').length;

    // Update user progress for this language
    const updateResult = await usersCollection.updateOne(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: {
          [`progress.${languageSlug}.topicStatuses`]: updatedTopicStatuses,
          [`progress.${languageSlug}.completedTopics`]: completedTopics,
          [`progress.${languageSlug}.lastUpdated`]: new Date(),
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      progress: {
        topicStatuses: updatedTopicStatuses,
        completedTopics,
        totalTopics: user.progress[languageSlug].totalTopics,
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}