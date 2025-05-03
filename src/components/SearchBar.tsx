
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { ChangeEvent } from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        type="text"
        placeholder="Search companies or industries..."
        value={searchTerm}
        onChange={handleChange}
        className="pl-10 w-full max-w-sm bg-white border-gray-200 focus:border-brand-navy"
      />
    </div>
  );
}
