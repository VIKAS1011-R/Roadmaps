import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { hashPassword, validateEmail, validatePassword, generateToken } from '@/lib/auth';
import { UserDocument, CreateUserData } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password }: CreateUserData = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, and numbers' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Initialize Java topic statuses (all pending) - default language
    const javaTopicStatuses: Record<number, 'pending'> = {};
    for (let i = 1; i <= 40; i++) {
      javaTopicStatuses[i] = 'pending';
    }

    // Create user document
    const newUser: UserDocument = {
      email,
      hashedPassword,
      role: 'user', // Default role
      profile: {
        name,
        joinDate: new Date().toISOString().split('T')[0]
      },
      progress: {
        java: { // Default Java language progress
          topicStatuses: javaTopicStatuses,
          completedTopics: 0,
          totalTopics: 40,
          lastUpdated: new Date()
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert user into database
    const result = await usersCollection.insertOne(newUser);
    newUser._id = result.insertedId;

    // Generate JWT token
    const token = generateToken(newUser);

    // Return user data (without password) and token
    const { hashedPassword: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      user: userWithoutPassword,
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}