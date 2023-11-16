import HermeticaForm from "@/components/HermeticaForm";

export const metadata = {
  title: "Settle",
  description: "Calling settle() on the Hermetica contract",
};

export default function Deposit() {
  return (
    <div className="min-h-screen text-white bg-gray-800">
      <h2 className="my-6 text-3xl text-center">Call the Hermetica contract</h2>
      <HermeticaForm />
    </div>
  );
}