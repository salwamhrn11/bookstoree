export default function InputKolom({ label = "Customer ID" }) {
  return (
    <div className="flex items-start gap-4">
      <h3 className="text-md">{label}</h3>
      <input className="w-[80px] bg-slate-200"></input>
    </div>
  );
}
