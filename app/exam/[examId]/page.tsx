import { getExamPublicInfo } from "./_actions/exam-public-actions";
import { ExamIntroCard } from "./_components/exam-intro-card";
import { notFound } from "next/navigation";

export default async function ExamIntroPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;

  try {
    const examData = await getExamPublicInfo(examId);
    return <ExamIntroCard exam={examData} />;
  } catch (error) {
    notFound();
  }
}
