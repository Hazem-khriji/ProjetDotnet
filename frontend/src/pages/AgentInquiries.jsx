import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inquiryService } from '@/lib/api';
import { useAuthStore } from '../stores/authStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AgentInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');
  const pageSize = 10;
  
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is an agent
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    if (user && !user.roles?.includes('Agent')) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    fetchInquiries();
  }, [currentPage, selectedStatus]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        pageNumber: currentPage,
        pageSize: pageSize,
      };
      
      if (selectedStatus !== '') {
        params.status = parseInt(selectedStatus);
      }
      
      const response = await inquiryService.getMyPropertyInquiries(params);
      
      setInquiries(response.items || []);
      setTotalCount(response.totalCount || 0);
      setTotalPages(Math.ceil((response.totalCount || 0) / pageSize));
    } catch (err) {
      setError(err.message || 'Failed to fetch inquiries');
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      0: { text: 'New', class: 'bg-blue-100 text-blue-800' },
      1: { text: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
      2: { text: 'Approved', class: 'bg-green-100 text-green-800' },
      3: { text: 'Rejected', class: 'bg-red-100 text-red-800' },
    };
    
    const statusInfo = statusMap[status] || { text: 'Unknown', class: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 px-6 md:px-20 lg:px-32 bg-gray-50">
        <div className="max-w-7xl mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Inquiries</h1>
            <p className="text-gray-600">Manage inquiries received for your properties</p>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="0">New</option>
                  <option value="1">Pending</option>
                  <option value="2">Approved</option>
                  <option value="3">Rejected</option>
                </select>
              </div>
              
              <div className="flex-grow"></div>
              
              <div className="text-sm text-gray-600">
                Total: <span className="font-semibold">{totalCount}</span> inquiries
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading inquiries...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No inquiries found</h3>
              <p className="mt-1 text-gray-500">
                {selectedStatus ? 'Try changing the filter' : 'You haven\'t received any inquiries yet'}
              </p>
            </div>
          ) : (
            <>
              {/* Inquiries List */}
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {inquiry.propertyTitle}
                            </h3>
                            <p className="text-sm text-gray-500">Property ID: {inquiry.propertyId}</p>
                          </div>
                          {getStatusBadge(inquiry.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">From:</p>
                            <p className="text-sm text-gray-900">{inquiry.userName}</p>
                            <p className="text-sm text-gray-600">{inquiry.userEmail}</p>
                            <p className="text-sm text-gray-600">{inquiry.phoneNumber}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-700">Request Date:</p>
                            <p className="text-sm text-gray-900">{formatDate(inquiry.requestDate)}</p>
                            
                            {inquiry.preferredVisitDate && (
                              <>
                                <p className="text-sm font-medium text-gray-700 mt-2">Preferred Visit:</p>
                                <p className="text-sm text-gray-900">{formatDate(inquiry.preferredVisitDate)}</p>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700">Message:</p>
                          <p className="text-sm text-gray-900 mt-1">{inquiry.message}</p>
                        </div>
                        
                        {inquiry.adminNotes && (
                          <div className="mt-4 bg-gray-50 p-3 rounded">
                            <p className="text-sm font-medium text-gray-700">Admin Notes:</p>
                            <p className="text-sm text-gray-900 mt-1">{inquiry.adminNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      // Show first, last, current, and pages around current
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 border rounded-md text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum} className="px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AgentInquiries;

