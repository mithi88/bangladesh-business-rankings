
import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CompanyCard } from "../components/CompanyCard";
import { CompanyForm } from "../components/CompanyForm";
import { DeleteConfirmation } from "../components/DeleteConfirmation";
import { Company } from "../types";
import { getCompanies, createCompany, updateCompany, deleteCompany } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function HomePage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  
  const { isLoggedIn } = useAuth();
  
  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
        setFilteredCompanies(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load companies",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanies();
  }, []);
  
  // Filter companies when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = companies.filter(
        company =>
          company.name.toLowerCase().includes(term) ||
          company.sector.toLowerCase().includes(term)
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);
  
  const handleAddNew = () => {
    setEditingCompany(null);
    setShowCompanyForm(true);
  };
  
  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setShowCompanyForm(true);
  };
  
  const handleDelete = (id: string) => {
    const company = companies.find(c => c.id === id);
    if (company) {
      setCompanyToDelete(company);
      setDeleteDialogOpen(true);
    }
  };
  
  const confirmDelete = async () => {
    if (companyToDelete?.id) {
      try {
        await deleteCompany(companyToDelete.id);
        setCompanies(companies.filter(c => c.id !== companyToDelete.id));
        toast({
          title: "Success",
          description: `${companyToDelete.name} has been deleted.`,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete company",
          variant: "destructive",
        });
      } finally {
        setDeleteDialogOpen(false);
        setCompanyToDelete(null);
      }
    }
  };
  
  const handleCompanySubmit = async (company: Company) => {
    try {
      if (editingCompany && editingCompany.id) {
        // Update existing company
        const updated = await updateCompany(editingCompany.id, company);
        setCompanies(
          companies.map(c => (c.id === editingCompany.id ? updated : c))
        );
        toast({
          title: "Success",
          description: `${company.name} has been updated.`,
        });
      } else {
        // Add new company
        const created = await createCompany(company);
        setCompanies([...companies, created]);
        toast({
          title: "Success",
          description: `${company.name} has been added.`,
        });
      }
      setShowCompanyForm(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save company",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-brand-navy">Top Bangladeshi Companies</h2>
              <p className="text-gray-600 mt-1">
                Explore the leading companies of Bangladesh across various sectors
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              
              {isLoggedIn && (
                <Button onClick={handleAddNew} className="bg-brand-navy hover:bg-brand-darkBlue">
                  <Plus className="mr-2 h-4 w-4" /> Add Company
                </Button>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-500">Loading companies...</div>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl text-gray-600">No companies found</h3>
              {searchTerm && (
                <p className="text-gray-500 mt-2">
                  Try adjusting your search term to find what you're looking for.
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onEdit={() => handleEdit(company)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-brand-navy text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Bangladesh Business Rankings</p>
          <p className="text-sm text-gray-300 mt-1">
            A showcase of top Bangladeshi businesses
          </p>
        </div>
      </footer>
      
      {/* Company Form Dialog */}
      {showCompanyForm && (
        <CompanyForm
          open={showCompanyForm}
          onClose={() => setShowCompanyForm(false)}
          onSubmit={handleCompanySubmit}
          initialData={editingCompany || undefined}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && companyToDelete && (
        <DeleteConfirmation
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          companyName={companyToDelete.name}
        />
      )}
    </div>
  );
}
