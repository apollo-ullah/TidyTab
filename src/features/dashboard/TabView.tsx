import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTab, subscribeToTab } from '../services/tabService';
import { Tab } from '../types/tab';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-hot-toast';

export const TabView = () => {
  const { tabId } = useParams<{ tabId: string }>();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab | null>(null);
  const [loading, setLoading] = useState(true);

  // Get the current URL for sharing
  const shareUrl = `${window.location.origin}/join/${tabId}`;

  useEffect(() => {
    if (!tabId) return;

    const loadTab = async () => {
      try {
        const tabData = await getTab(tabId);
        setTab(tabData);
      } catch (error) {
        console.error('Error loading tab:', error);
      } finally {
        setLoading(false);
      }
    };

    // Subscribe to real-time updates
    const unsubscribe = subscribeToTab(
      tabId,
      (updatedTab) => setTab(updatedTab),
      (error) => console.error('Error subscribing to tab:', error)
    );

    loadTab();
    return () => unsubscribe();
  }, [tabId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!tab) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Tab not found</h2>
        <p className="mt-2 text-gray-600">The tab you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{tab.name}</h1>
          {tab.description && (
            <p className="mt-1 text-gray-600">{tab.description}</p>
          )}
        </div>

        {/* Members List */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Members</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tab.members.map((member) => (
              <div
                key={member.uid}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                {member.photoURL ? (
                  <img
                    src={member.photoURL}
                    alt={member.displayName || member.email}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-medium">
                      {(member.displayName || member.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {member.displayName || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Section */}
        <div className="px-6 py-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Share Tab</h2>
          <div className="mt-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <QRCodeSVG
                value={shareUrl}
                size={160}
                level="H"
                includeMargin
              />
              <p className="mt-2 text-sm text-gray-500 text-center">Scan with phone camera</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Or share this link:</p>
              <div className="flex items-center space-x-2">
                <code className="block flex-1 text-sm font-mono bg-gray-100 px-3 py-2 rounded">
                  {shareUrl}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
