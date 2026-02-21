
import AuthCard from "../components/AuthCard";

export default function Auth() {
  // Added "bg-red-500" to test if Tailwind is working
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <AuthCard />
    </div>
  );
}