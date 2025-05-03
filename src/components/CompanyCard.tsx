
import { Company } from "../types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface CompanyCardProps {
  company: Company;
  onEdit?: (company: Company) => void;
  onDelete?: (id: string) => void;
}

export function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  const { isLoggedIn } = useAuth();
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fadeIn">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="w-3/4">
            <CardTitle className="text-xl font-bold text-brand-navy">{company.name}</CardTitle>
            <CardDescription className="text-sm font-medium text-gray-600">{company.sector}</CardDescription>
          </div>
          <div className="w-16 h-16 flex items-center justify-center bg-white p-2 rounded-md">
            <img 
              src={company.logo} 
              alt={`${company.name} logo`} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <div className="text-gray-500">Founded</div>
          <div className="font-medium">{company.founded}</div>
          
          <div className="text-gray-500">Headquarters</div>
          <div className="font-medium">{company.headquarters}</div>
          
          {company.revenue && (
            <>
              <div className="text-gray-500">Revenue</div>
              <div className="font-medium">{company.revenue}</div>
            </>
          )}
          
          {company.employees && (
            <>
              <div className="text-gray-500">Employees</div>
              <div className="font-medium">{company.employees.toLocaleString()}</div>
            </>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">{company.description}</p>
      </CardContent>
      {isLoggedIn && (
        <CardFooter className="bg-gray-50 border-t border-gray-100 flex gap-2 p-3">
          <Button 
            variant="outline" 
            onClick={() => onEdit && onEdit(company)}
            className="w-full text-brand-navy hover:text-brand-lightBlue"
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete && company.id && onDelete(company.id)}
            className="w-full"
          >
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
