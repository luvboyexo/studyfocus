import { ThemeToggle } from "../components/ThemeToggle";
import { StudyForm } from "../components/StudyForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center p-8 gap-8">
      <header className="flex w-full max-w-5xl justify-between">
        <h1 className="text-3xl font-bold">StudyFocus</h1>
        <ThemeToggle />
      </header>

      <div className="max-w-3xl text-center space-y-10">
        <StudyForm />
      </div>
    </div>
  );
}
