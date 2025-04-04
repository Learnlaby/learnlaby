// Authentication & General
export const SIGNIN_PAGE = "http://localhost:3000/";
export const HOME_PAGE = "/home";

// User related
export const DEFAULT_PROFILE_IMAGE = "/default-profile.png";
export const AVATAR_IMAGE = "https://placekitten.com/100/100";
export const PLACEHOLDER_IMAGE = "/placeholder.svg";

// Classroom related
export const CLASSROOM_DEFAULT_REDIRECT = (id: string) => `${CLASSROOM_STREAM_PAGE.replace("[id]", id)}`;
export const CLASSROOM_API = "/api/classroom";
export const CLASSROOM_BY_ID_API = "/api/classroom/[id]";
export const CLASSROOM_CREATE_API = "/api/classroom/create";
export const CLASSROOM_JOIN_API = "/api/classroom/join";
export const CLASSROOM_DEFAULT_IMAGE = "https://placehold.co/10x10";
export const CLASSROOM_MEMBER_API = "/api/classroom/member";

// Classroom pages
export const CLASSROOM_STREAM_PAGE = "/classroom/[id]/stream";
export const CLASSROOM_CLASSWORK_PAGE = "/classroom/[id]/classwork";
export const CLASSROOM_MEMBER_PAGE = "/classroom/[id]/member";
export const CLASSROOM_GRADE_PAGE = "/classroom/[id]/grade";
export const CLASSROOM_ANALYTICS_PAGE = "/classroom/[id]/analytics";
export const CLASSWORK_CREATE_PAGE = "/classroom/[classroomId]/classwork/create";
export const CLASSWORK_DETAIL_PAGE = "/classroom/[classroomId]/classwork/detail/[postId]";
export const CLASSWORK_REVIEW_PAGE = "/classroom/[classroomId]/classwork/review/[postId]";

// Posts & Content
export const POST_API = "/api/classroom/posts";
export const POST_DETAIL_API = "/api/classroom/posts/detail";
export const ANNOUNCEMENT_API = "/api/classroom/posts/announcements";
export const CLASSWORK_API = "/api/classroom/posts/classworks";
export const SECTION_API = "/api/classroom/posts/section";
export const SECTION_CREATE_API = "/api/classroom/posts/section/create";
export const ASSIGNMENT_CREATE_API = "/api/classroom/posts/assignment/create";
export const MATERIAL_CREATE_API = "/api/classroom/posts/material/create";

// Comments
export const COMMENT_API = "/api/classroom/comment";
export const COMMENT_ON_POST_API = "/api/classroom/comment";

// Submissions & Grading
export const SUBMISSION_API = "/api/classroom/submission";
export const SUBMISSION_ASSIGNMENT_API = "/api/classroom/posts/assignment/submission";
export const SUBMISSION_GET_API = "/api/classroom/submission/get";
export const SUBMISSION_CREATE_API = "/api/classroom/submission/create";
export const SUBMISSION_REVIEW_API = "/api/classroom/submission/review";
export const GRADE_API = "/api/classroom/submission/grade";
export const CLASSWORK_STUDENT_REVIEW_PAGE = `${CLASSWORK_REVIEW_PAGE}/[studentId]`;
export const getStudentReviewUrl = (
    classroomId: string,
    postId: string,
    studentId: string,
    studentName: string,
    status: string,
    docId: string
  ) => {
    const basePath = CLASSWORK_STUDENT_REVIEW_PAGE
      .replace("[classroomId]", classroomId)
      .replace("[postId]", postId)
      .replace("[studentId]", studentId);
    
    return `${basePath}?name=${encodeURIComponent(studentName)}&status=${status}&docId=${docId}`;
  };

// Todo
export const TODO_API = "/api/classroom/todo";

// Default images
export const DEFAULT_IMAGE = "https://placehold.co/800x400";
export const DEFAULT_CLASSWORK_IMAGE = "https://placehold.co/216x160";

