import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, UserPlus, UserMinus, RefreshCcw, CheckCircle2, Download, Users } from "lucide-react";
import { TeamMember, ApplicantFormData, getTeamMemberImageUrl } from "@/lib/teamMembers";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Footer from "@/components/Footer";

// Function to get the appropriate image URL for a team member
function getTeamMemberImage(member: TeamMember): string {
  // Simply use the centralized helper function to ensure consistent image URLs across the app
  return getTeamMemberImageUrl(member);
}

interface Applicant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  whyJoin: string;
  createdAt: string;
  photoUrl: string | null;
}

interface Selfie {
  id: number;
  location: string;
  caption: string;
  teamMemberId: number;
  createdAt: string;
  photoUrl: string | null;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("team");

  // Fetch team members
  const { data: teamMembers, isLoading: isTeamLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  // Fetch applicants
  const { data: applicants, isLoading: isApplicantsLoading } = useQuery<Applicant[]>({
    queryKey: ["/api/applicants"],
  });

  // Fetch selfies
  const { data: selfies = [], isLoading: isSelfiesLoading } = useQuery<Selfie[]>({
    queryKey: ["/api/selfies"],
    retry: false,
    refetchOnWindowFocus: false
  });
  
  // Mutation to approve an applicant to become a team member
  const approveMutation = useMutation({
    mutationFn: async (applicantId: number) => {
      return await apiRequest(
        "POST",
        `/api/applicants/${applicantId}/approve`, 
        { id: applicantId }
      );
    },
    onSuccess: () => {
      // Invalidate cache to refresh the team members list
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applicants"] });
    }
  });
  
  // Mutation to reject an applicant
  const rejectMutation = useMutation({
    mutationFn: async (applicantId: number) => {
      return await apiRequest(
        "POST",
        `/api/applicants/${applicantId}/reject`, 
        { id: applicantId }
      );
    },
    onSuccess: () => {
      // Invalidate cache to refresh the applicants list
      queryClient.invalidateQueries({ queryKey: ["/api/applicants"] });
    }
  });
  
  // Mutation to delete a team member
  const deleteMemberMutation = useMutation({
    mutationFn: async (memberId: number) => {
      return await apiRequest(
        "DELETE",
        `/api/team-members/${memberId}`
      );
    },
    onSuccess: () => {
      // Invalidate cache to refresh the team members list
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
    }
  });
  
  // State for editing team member
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  
  // State for viewing applicant details
  const [viewingApplicant, setViewingApplicant] = useState<Applicant | null>(null);
  
  // State for viewing selfie details
  const [viewingSelfie, setViewingSelfie] = useState<Selfie | null>(null);
  
  // State for team member deletion confirmation
  const [selectedMemberForDelete, setSelectedMemberForDelete] = useState<TeamMember | null>(null);
  
  // Mutation to update a team member
  const updateMemberMutation = useMutation({
    mutationFn: async (data: { id: number, updates: Partial<TeamMember> }) => {
      return await apiRequest(
        "PUT",
        `/api/team-members/${data.id}`,
        data.updates
      );
    },
    onSuccess: () => {
      // Reset editing state and invalidate cache
      setEditingMember(null);
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
    }
  });
  
  // Format date safely
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F4]">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4 md:mb-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Website
            </Button>
          </Link>
          <h1 className="text-3xl font-poppins font-bold">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="team" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
            <TabsTrigger value="team" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="applicants" className="flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Applicants
              {applicants && applicants.length > 0 && (
                <Badge className="ml-2 bg-[#FB4694]">{applicants.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="selfies" className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Selfies
              {selfies && selfies.length > 0 && (
                <Badge className="ml-2 bg-[#FB4694]">{selfies.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Team Members</span>
                  <Button variant="outline" className="bg-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isTeamLoading ? (
                  <div className="flex justify-center p-6">
                    <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers?.map((member) => (
                      <Card key={member.id} className="overflow-hidden shadow-md">
                        <div className="h-40 overflow-hidden">
                          <img
                            src={getTeamMemberImage(member)}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://placehold.co/400x400/f8f6f4/FB4694?text=L&font=poppins";
                            }}
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-poppins font-semibold text-xl mb-1">{member.name}</h3>
                          <p className="text-sm text-[#7D7B7B] mb-2">{member.role}</p>
                          <div className="flex items-center mb-4">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#7D7B7B] mr-2"></span>
                            <span className="text-sm">{member.location}</span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs bg-white"
                              onClick={() => setEditingMember(member)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => deleteMemberMutation.mutate(member.id)}
                              disabled={deleteMemberMutation.isPending}
                            >
                              {deleteMemberMutation.isPending ? (
                                <RefreshCcw className="h-3 w-3 mr-1 animate-spin" />
                              ) : "Remove"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applicants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Applicants</span>
                  <Button variant="outline" className="bg-white">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isApplicantsLoading ? (
                  <div className="flex justify-center p-6">
                    <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : applicants && applicants.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Name</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Email</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Location</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Applied On</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicants.map((applicant) => (
                          <tr key={applicant.id} className="border-t border-gray-200">
                            <td className="py-4 px-4 text-sm">
                              {applicant.firstName} {applicant.lastName}
                            </td>
                            <td className="py-4 px-4 text-sm">{applicant.email}</td>
                            <td className="py-4 px-4 text-sm">{applicant.location}</td>
                            <td className="py-4 px-4 text-sm">
                              {formatDate(applicant.createdAt)}
                            </td>
                            <td className="py-4 px-4 text-sm">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-xs bg-white"
                                  onClick={() => setViewingApplicant(applicant)}
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="text-xs"
                                  onClick={() => rejectMutation.mutate(applicant.id)}
                                  disabled={rejectMutation.isPending}
                                >
                                  {rejectMutation.isPending ? (
                                    <RefreshCcw className="h-3 w-3 mr-1 animate-spin" />
                                  ) : (
                                    <>
                                      <UserMinus className="h-3 w-3 mr-1" />
                                      Reject
                                    </>
                                  )}
                                </Button>
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  className="text-xs bg-[#FB4694]"
                                  onClick={() => approveMutation.mutate(applicant.id)}
                                  disabled={approveMutation.isPending}
                                >
                                  {approveMutation.isPending ? (
                                    <RefreshCcw className="h-3 w-3 mr-1 animate-spin" />
                                  ) : (
                                    <UserPlus className="h-3 w-3 mr-1" />
                                  )}
                                  Approve
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No applicants yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="selfies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>User Selfies</span>
                  <Button variant="outline" className="bg-white">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSelfiesLoading ? (
                  <div className="flex justify-center p-6">
                    <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : selfies && selfies.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selfies.map((selfie) => (
                      <Card key={selfie.id} className="overflow-hidden shadow-md">
                        <div className="h-64 overflow-hidden">
                          {selfie.photoUrl ? (
                            <img
                              src={selfie.photoUrl}
                              alt={`Selfie ${selfie.id}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <p className="text-gray-500">No image available</p>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-1">Selfie #{selfie.id}</h3>
                          <p className="text-sm text-[#7D7B7B] mb-2">{selfie.location}</p>
                          <p className="text-sm mb-3">{selfie.caption}</p>
                          <p className="text-xs text-gray-500">
                            Taken with Team Member #{selfie.teamMemberId}
                          </p>
                          <p className="text-xs text-gray-500 mb-4">
                            {formatDate(selfie.createdAt)}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs bg-white"
                              onClick={() => setViewingSelfie(selfie)}
                            >
                              View
                            </Button>
                            <Button variant="destructive" size="sm" className="text-xs">
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No selfies uploaded yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />

      {/* Edit Team Member Dialog */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Edit Team Member</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updates = {
                  name: formData.get('name') as string,
                  role: formData.get('role') as string,
                  location: formData.get('location') as string,
                  bio: formData.get('bio') as string,
                  focus: formData.get('focus') as string,
                };
                
                updateMemberMutation.mutate({
                  id: editingMember.id,
                  updates
                });
              }}>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <input 
                      id="name" 
                      name="name" 
                      className="p-2 border rounded-md" 
                      defaultValue={editingMember.name}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="role" className="text-sm font-medium">Role</label>
                    <input 
                      id="role" 
                      name="role" 
                      className="p-2 border rounded-md" 
                      defaultValue={editingMember.role}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="location" className="text-sm font-medium">Location</label>
                    <input 
                      id="location" 
                      name="location" 
                      className="p-2 border rounded-md" 
                      defaultValue={editingMember.location}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="focus" className="text-sm font-medium">Focus Areas</label>
                    <input 
                      id="focus" 
                      name="focus" 
                      className="p-2 border rounded-md" 
                      defaultValue={editingMember.focus}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="bio" className="text-sm font-medium">Biography</label>
                    <textarea 
                      id="bio" 
                      name="bio" 
                      className="p-2 border rounded-md min-h-[100px]" 
                      defaultValue={editingMember.bio}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEditingMember(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={updateMemberMutation.isPending}
                    >
                      {updateMemberMutation.isPending ? (
                        <><RefreshCcw className="h-4 w-4 mr-2 animate-spin" /> Updating...</>
                      ) : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selfie Details Modal */}
      {viewingSelfie && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Selfie Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="w-full">
                  {viewingSelfie.photoUrl ? (
                    <img 
                      src={viewingSelfie.photoUrl} 
                      alt={`Selfie ${viewingSelfie.id}`}
                      className="rounded-md w-full max-h-[400px] object-contain mx-auto"
                    />
                  ) : (
                    <div className="rounded-md w-full h-64 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No image available</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-xl">
                      Selfie #{viewingSelfie.id}
                    </h3>
                    <p className="text-gray-500">{viewingSelfie.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Caption</p>
                    <p className="text-sm mt-1">{viewingSelfie.caption}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Team Member</p>
                    <p className="text-sm mt-1">ID: {viewingSelfie.teamMemberId}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Uploaded On</p>
                    <p className="text-sm mt-1">{formatDate(viewingSelfie.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setViewingSelfie(null)}
                >
                  Close
                </Button>
                <Button variant="destructive">
                  Delete Selfie
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Applicant Details Modal */}
      {viewingApplicant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Applicant Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  {viewingApplicant.photoUrl ? (
                    <img 
                      src={viewingApplicant.photoUrl} 
                      alt={`${viewingApplicant.firstName} ${viewingApplicant.lastName}`}
                      className="rounded-md w-full aspect-square object-cover"
                    />
                  ) : (
                    <div className="rounded-md w-full aspect-square bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No photo available</p>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-xl">
                        {viewingApplicant.firstName} {viewingApplicant.lastName}
                      </h3>
                      <p className="text-gray-500">{viewingApplicant.location}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Contact Information</p>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm">Email: {viewingApplicant.email}</p>
                        <p className="text-sm">Phone: {viewingApplicant.phone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Why They Want to Join</p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">{viewingApplicant.whyJoin}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Applied On</p>
                      <p className="text-sm mt-1">{formatDate(viewingApplicant.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setViewingApplicant(null)}
                >
                  Close
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    rejectMutation.mutate(viewingApplicant.id);
                    setViewingApplicant(null);
                  }}
                  disabled={rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? (
                    <><RefreshCcw className="h-4 w-4 mr-2 animate-spin" /> Rejecting...</>
                  ) : 'Reject Applicant'}
                </Button>
                <Button 
                  className="bg-[#FB4694]"
                  onClick={() => {
                    approveMutation.mutate(viewingApplicant.id);
                    setViewingApplicant(null);
                  }}
                  disabled={approveMutation.isPending}
                >
                  {approveMutation.isPending ? (
                    <><RefreshCcw className="h-4 w-4 mr-2 animate-spin" /> Approving...</>
                  ) : 'Approve Applicant'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}