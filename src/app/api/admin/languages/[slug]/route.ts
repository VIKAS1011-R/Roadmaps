import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../../../../../lib/mongodb";
import { verifyAdminAuth } from "../../../../../lib/middleware/adminAuth";
import {
  ProgrammingLanguageDocument,
  UpdateLanguageData,
} from "../../../../../lib/models/ProgrammingLanguage";

// Get specific programming language
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const authResult = await verifyAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error.message },
      { status: authResult.error.status }
    );
  }

  try {
    const db = await getDatabase();
    const languagesCollection = db.collection<ProgrammingLanguageDocument>(
      "programming_languages"
    );

    const language = await languagesCollection.findOne({ slug: params.slug });
    if (!language) {
      return NextResponse.json(
        { error: "Programming language not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ language });
  } catch (error) {
    console.error("Get language error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update programming language
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const authResult = await verifyAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error.message },
      { status: authResult.error.status }
    );
  }

  try {
    const updateData: UpdateLanguageData = await request.json();

    const db = await getDatabase();
    const languagesCollection = db.collection<ProgrammingLanguageDocument>(
      "programming_languages"
    );

    const existingLanguage = await languagesCollection.findOne({
      slug: params.slug,
    });
    if (!existingLanguage) {
      return NextResponse.json(
        { error: "Programming language not found" },
        { status: 404 }
      );
    }

    const updateFields: Partial<ProgrammingLanguageDocument> = {
      updatedAt: new Date(),
    };

    if (updateData.name) {
      updateFields.name = updateData.name;
      // Update slug if name changed
      updateFields.slug = updateData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    if (updateData.description) {
      updateFields.description = updateData.description;
    }

    if (updateData.phases) {
      // Recalculate total topics and assign IDs
      let totalTopics = 0;
      let topicId = 1;

      const processedPhases = updateData.phases.map((phase) => ({
        ...phase,
        topics: phase.topics.map((topic) => {
          totalTopics++;
          return {
            ...topic,
            id: topicId++,
          };
        }),
      }));

      updateFields.phases = processedPhases;
      updateFields.totalTopics = totalTopics;
    }

    const result = await languagesCollection.updateOne(
      { slug: params.slug },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Programming language not found" },
        { status: 404 }
      );
    }

    const updatedLanguage = await languagesCollection.findOne({
      slug: updateFields.slug || params.slug,
    });

    return NextResponse.json({
      language: updatedLanguage,
      message: "Programming language updated successfully",
    });
  } catch (error) {
    console.error("Update language error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete programming language
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const authResult = await verifyAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error.message },
      { status: authResult.error.status }
    );
  }

  try {
    const db = await getDatabase();
    const languagesCollection = db.collection<ProgrammingLanguageDocument>(
      "programming_languages"
    );

    const result = await languagesCollection.deleteOne({ slug: params.slug });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Programming language not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Programming language deleted successfully",
    });
  } catch (error) {
    console.error("Delete language error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
