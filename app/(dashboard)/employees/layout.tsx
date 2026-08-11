import { LedgerFonts } from "@/components/employees/formPrimitives";

export default function EmployeesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl font-['Inter']">
      <LedgerFonts />
      {children}
    </div>
  );
}