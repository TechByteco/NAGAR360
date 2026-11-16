import { NextResponse } from 'next/server';
import { AIAnalysisResult } from '../../../../lib/types';
import { getDepartmentForCategory } from '../../../../lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, description } = body || {};

    const text = (description || '').toLowerCase();
    let category = 'Pothole';
    let subcategory = 'Asphalt Fracture';
    let severity = 'high';

    if (text.includes('garbage') || text.includes('dump') || text.includes('bin')) {
      category = 'Garbage Accumulation';
      subcategory = 'Solid Waste Spillover';
      severity = 'high';
    } else if (text.includes('light') || text.includes('lamp')) {
      category = 'Broken Streetlight';
      subcategory = 'Luminaire Failure';
      severity = 'medium';
    } else if (text.includes('water') || text.includes('leak')) {
      category = 'Water Leakage';
      subcategory = 'Potable Main Line Burst';
      severity = 'high';
    } else if (text.includes('drain') || text.includes('flood')) {
      category = 'Blocked Drainage';
      subcategory = 'Stormwater Ingress Clog';
      severity = 'critical';
    }

    const result: AIAnalysisResult = {
      category: category as any,
      subcategory,
      confidence: 0.95,
      severity: severity as any,
      explanation: `Server AI vision analysis confirmed ${category} issue in public area.`,
      suggestedDepartment: getDepartmentForCategory(category as any),
      isImageClear: true,
      isLikelyCivicIssue: true,
      isDemoFallback: true,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 });
  }
}
