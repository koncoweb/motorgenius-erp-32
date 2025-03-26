
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Download, Trash2, FilePlus, Edit } from "lucide-react";
import { toast } from "sonner";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Customer, CustomerDocument, getCustomerDocuments, getDocumentUrl, uploadContractDocument, deleteDocument } from "@/services/customerService";
import { CustomerForm } from "./CustomerForm";

interface CustomerDetailViewProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, customer: Partial<Customer>) => void;
}

export const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({
  customer,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("contract");
  
  useEffect(() => {
    if (customer && activeTab === "documents") {
      loadDocuments();
    }
  }, [customer, activeTab]);
  
  const loadDocuments = async () => {
    if (!customer) return;
    
    try {
      const docs = await getCustomerDocuments(customer.id);
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents", error);
      toast.error("Failed to load documents");
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!customer || !selectedFile) return;
    
    setIsUploading(true);
    try {
      await uploadContractDocument(customer.id, selectedFile, documentType);
      toast.success("Document uploaded successfully");
      loadDocuments();
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Failed to upload document", error);
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDownload = async (document: CustomerDocument) => {
    try {
      const url = await getDocumentUrl(document.file_path);
      if (!url) {
        toast.error("Failed to get document URL");
        return;
      }
      
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to download document", error);
      toast.error("Failed to download document");
    }
  };
  
  const handleDelete = async (documentId: string) => {
    try {
      const success = await deleteDocument(documentId);
      if (success) {
        toast.success("Document deleted successfully");
        loadDocuments();
      } else {
        toast.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Failed to delete document", error);
      toast.error("Failed to delete document");
    }
  };
  
  const handleEditSave = (updatedCustomer: Partial<Customer>) => {
    if (customer) {
      onEdit(customer.id, updatedCustomer);
      setIsEditMode(false);
    }
  };
  
  if (!customer) return null;
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Customer Details</span>
              <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Company</span>
                      <span className="font-medium">{customer.company}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">PIC Name</span>
                      <span className="font-medium">{customer.pic_name || "N/A"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Address</span>
                      <span className="font-medium">{customer.address || "N/A"}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Email</span>
                      <span className="font-medium">{customer.email}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <span className="font-medium">{customer.phone}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Contract Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Contract Value</span>
                      <span className="font-medium">{formatRupiah(customer.contract_value || 0)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Contract Period</span>
                      <span className="font-medium">
                        {customer.contract_start_date && customer.contract_end_date
                          ? `${formatDate(customer.contract_start_date)} - ${formatDate(customer.contract_end_date)}`
                          : "N/A"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Sales Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Total Orders</span>
                      <span className="font-medium">{customer.totalOrders}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Total Spent</span>
                      <span className="font-medium">{formatRupiah(customer.totalSpent)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Last Order</span>
                      <span className="font-medium">{formatDate(customer.lastOrder)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Documents</CardTitle>
                  <CardDescription>Upload and manage contract documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {selectedFile ? selectedFile.name : "Choose file"}
                      </label>
                      <Button 
                        disabled={!selectedFile || isUploading} 
                        onClick={handleUpload}
                      >
                        <FilePlus className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                    
                    {documents.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Uploaded</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {documents.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>{doc.file_name}</TableCell>
                              <TableCell>
                                {doc.document_type.charAt(0).toUpperCase() + doc.document_type.slice(1)}
                              </TableCell>
                              <TableCell>{formatDate(doc.uploaded_at)}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownload(doc)}
                                >
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(doc.id)}
                                  className="text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center p-4 text-muted-foreground">
                        No documents uploaded yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <CustomerForm 
        isOpen={isEditMode}
        onClose={() => setIsEditMode(false)}
        onSave={handleEditSave}
        customer={customer}
        title="Edit Customer"
      />
    </>
  );
};
