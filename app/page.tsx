import QnA from "@/components/ui/deep-research/QnA";
import UserInput from "@/components/ui/deep-research/UserInput";
import Image from "next/image";
import bg from "../public/background.png";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start gap-8 py-16 ">
      <div className="fixed top-0 left-0 w-full h-full object-cover  -z-10 bg-black/30">
        <Image
          src={bg}
          alt="Deep Research AI Agent"
          className="w-full h-full object-center opacity-50"
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-6xl font-bold font-dancing-script italic bg-linear-to-r from-primary/80 to-primary/50 bg-clip-text text-transparent ">
          Deep Research
        </h1>
        <p className="text-gray-600 text-center">
          Enter a topic and answer few questions to generate a comprehensive
          research report
        </p>
      </div>
      <UserInput />
      <QnA />
    </main>
  );
}
