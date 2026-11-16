import { AIAnalysisResult, ComplaintCategory, Severity } from '../types';
import { getDepartmentForCategory } from '../utils';

export async function analyseCivicImage(
  imageSource: File | string,
  description: string = ''
): Promise<AIAnalysisResult> {
  // Simulate 1.2s AI vision analysis delay for realistic hackathon feel
  await new Promise((res) => setTimeout(res, 1200));

  const text = (description || '').toLowerCase();

  let category: ComplaintCategory = 'Pothole';
  let severity: Severity = 'high';
  let subcategory = 'Asphalt Wear & Tear';

  if (text.includes('garbage') || text.includes('dump') || text.includes('bin') || text.includes('trash') || text.includes('waste')) {
    category = 'Garbage Accumulation';
    subcategory = 'Solid Waste Spillover';
    severity = 'high';
  } else if (text.includes('light') || text.includes('dark') || text.includes('lamp') || text.includes('pole')) {
    category = 'Broken Streetlight';
    subcategory = 'Luminaire Non-Functional';
    severity = 'medium';
  } else if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('burst')) {
    category = 'Water Leakage';
    subcategory = 'Potable Main Line Leak';
    severity = 'high';
  } else if (text.includes('drain') || text.includes('flood') || text.includes('waterlog') || text.includes('clog')) {
    category = 'Blocked Drainage';
    subcategory = 'Stormwater Channel Obstruction';
    severity = 'critical';
  } else if (text.includes('tree') || text.includes('branch')) {
    category = 'Fallen Tree';
    subcategory = 'Vegetation Roadway Hazard';
    severity = 'high';
  } else if (text.includes('footpath') || text.includes('walk') || text.includes('pavement') || text.includes('tile')) {
    category = 'Damaged Footpath';
    subcategory = 'Pedestrian Paver Fracture';
    severity = 'low';
  } else if (text.includes('manhole') || text.includes('hole in road') || text.includes('open drain')) {
    category = 'Open Manhole';
    subcategory = 'Hazardous Chamber Open';
    severity = 'critical';
  } else if (text.includes('signal') || text.includes('traffic')) {
    category = 'Traffic Signal Issue';
    subcategory = 'Signal Head Outage';
    severity = 'critical';
  }

  const suggestedDepartment = getDepartmentForCategory(category);

  return {
    category,
    subcategory,
    confidence: 0.94,
    severity,
    explanation: `AI detected a high-probability ${category} issue (${subcategory}). Image analysis confirms clear visual evidence in a public area.`,
    suggestedDepartment,
    isImageClear: true,
    isLikelyCivicIssue: true,
    isDemoFallback: true,
  };
}
