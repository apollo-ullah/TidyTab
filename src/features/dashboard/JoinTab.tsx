import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { joinTab } from '../services/tabService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const JoinTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabId, setTabId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinTab = async (id: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const tab = await joinTab(id, user);
      toast.success(`Joined ${tab.name} successfully!`);
      navigate(`/tabs/${tab.id}`);
    } catch (error) {
      console.error('Error joining tab:', error);
      toast.error('Failed to join tab. Please check the Tab ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleJoinTab(tabId);
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Join a Tab</h2>
        <p className="mt-1 text-sm text-gray-600">
          Enter a Tab ID to join an existing tab.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tabId" className="block text-sm font-medium text-gray-700">
            Tab ID
          </label>
          <input
            type="text"
            id="tabId"
            value={tabId}
            onChange={(e) => setTabId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Enter Tab ID"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {isLoading ? 'Joining...' : 'Join Tab'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Ask your friend to share the Tab ID with you.
        </p>
      </div>
    </div>
  );
}; 
