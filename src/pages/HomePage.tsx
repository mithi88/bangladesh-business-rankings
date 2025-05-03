
import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CompanyCard } from "../components/CompanyCard";
import { CompanyForm } from "../components/CompanyForm";
import { DeleteConfirmation } from "../components/DeleteConfirmation";
import { PaginationComponent } from "../components/Pagination";
import { Company } from "../types";
import { getCompanies, createCompany, updateCompany, deleteCompany, setupFallbackMockData } from "../services/api";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const companiesPerPage = 8;
  
  const { isLoggedIn } = useAuth();
  
  // Initialize API with fallback mechanism
  useEffect(() => {
    setupFallbackMockData()
      .catch(error => {
        console.error("Failed to set up API fallback:", error);
      });
  }, []);
  
  // Fetch companies on mount and when page changes
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        // Use the correct API function depending on whether we're using mock data
        const fetchFn = window.useMockApi ? (window as any).getCompanies : getCompanies;
        const data = await fetchFn(currentPage, companiesPerPage);
        
        if (window.useMockApi) {
          setCompanies(data.companies);
          setFilteredCompanies(data.companies);
          setTotalCompanies(data.totalCount);
          setTotalPages(Math.ceil(data.totalCount / companiesPerPage));
        } else {
          setCompanies(data.companies);
          setFilteredCompanies(data.companies);
          setTotalCompanies(data.totalCount);
          setTotalPages(Math.ceil(data.totalCount / companiesPerPage));
        }
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
  }, [currentPage]);
  
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
        // Use the correct API function depending on whether we're using mock data
        const deleteFn = window.useMockApi ? (window as any).deleteCompany : deleteCompany;
        await deleteFn(companyToDelete.id);
        
        // Refresh the company list after deletion
        const fetchFn = window.useMockApi ? (window as any).getCompanies : getCompanies;
        const data = await fetchFn(currentPage, companiesPerPage);
        
        if (window.useMockApi) {
          setCompanies(data.companies);
          setFilteredCompanies(data.companies);
          setTotalCompanies(data.totalCount);
          setTotalPages(Math.ceil(data.totalCount / companiesPerPage));
        } else {
          setCompanies(data.companies);
          setFilteredCompanies(data.companies);
          setTotalCompanies(data.totalCount);
          setTotalPages(Math.ceil(data.totalCount / companiesPerPage));
        }
        
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
        // Use the correct API function depending on whether we're using mock data
        const updateFn = window.useMockApi ? (window as any).updateCompany : updateCompany;
        const updated = await updateFn(editingCompany.id, company);
        
        // Refresh data to ensure we have the latest information
        const fetchFn = window.useMockApi ? (window as any).getCompanies : getCompanies;
        const data = await fetchFn(currentPage, companiesPerPage);
        setCompanies(data.companies);
        setFilteredCompanies(data.companies);
        
        toast({
          title: "Success",
          description: `${company.name} has been updated.`,
        });
      } else {
        // Add new company
        // Use the correct API function depending on whether we're using mock data
        const createFn = window.useMockApi ? (window as any).createCompany : createCompany;
        const created = await createFn(company);
        
        // Refresh data to ensure we have the latest information
        const fetchFn = window.useMockApi ? (window as any).getCompanies : getCompanies;
        const data = await fetchFn(currentPage, companiesPerPage);
        setCompanies(data.companies);
        setFilteredCompanies(data.companies);
        setTotalCompanies(prev => prev + 1);
        setTotalPages(Math.ceil((totalCompanies + 1) / companiesPerPage));
        
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset search when changing pages
    setSearchTerm("");
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
            <>
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
              
              {!searchTerm && totalPages > 1 && (
                <PaginationComponent 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              )}
            </>
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
