
import { useState } from "react";
import { Company } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "./ui/dialog";

interface CompanyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (company: Company) => void;
  initialData?: Company;
}

const defaultCompany: Company = {
  name: "",
  sector: "",
  logo: "https://via.placeholder.com/150",
  headquarters: "",
  founded: new Date().getFullYear(),
  description: "",
};

export function CompanyForm({ open, onClose, onSubmit, initialData }: CompanyFormProps) {
  const [formData, setFormData] = useState<Company>(initialData || defaultCompany);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "founded" ? parseInt(value) : value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? "Edit Company" : "Add New Company"}</DialogTitle>
            <DialogDescription>
              {initialData 
                ? "Update the company information below." 
                : "Fill in the details for the new company."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sector">Industry/Sector</Label>
                <Input
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="founded">Founded Year</Label>
                <Input
                  id="founded"
                  name="founded"
                  type="number"
                  min={1900}
                  max={new Date().getFullYear()}
                  value={formData.founded}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="headquarters">Headquarters</Label>
              <Input
                id="headquarters"
                name="headquarters"
                value={formData.headquarters}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="revenue">Revenue (Optional)</Label>
                <Input
                  id="revenue"
                  name="revenue"
                  value={formData.revenue || ""}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="employees">Employees (Optional)</Label>
                <Input
                  id="employees"
                  name="employees"
                  type="number"
                  value={formData.employees || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="ceo">CEO (Optional)</Label>
                <Input
                  id="ceo"
                  name="ceo"
                  value={formData.ceo || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[80px]"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update" : "Add"} Company</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
