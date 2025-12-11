export interface Resource {
  id: string;
  title: string;
  url: string; // Placeholder for file URL
  date?: string;
  type: 'pdf' | 'video' | 'link';
  thumbnail?: string; // For videos
  duration?: string; // For videos
  group?: string; // Added for grouping resources (e.g., by teacher)
}

export interface Subject {
  id: string;
  title: string;
  code: string;
  credits: number;
  description: string;
  notes: Resource[];
  assignments: Resource[];
  pyq: Resource[];
  videos: Resource[];
  syllabus: Resource[];
  books: Resource[];
}

export interface Semester {
  id: string;
  title: string;
  subjects: Subject[];
}

export interface Year {
  id: string;
  title: string;
  semesters: Semester[];
}

export interface AppData {
  years: Year[];
}