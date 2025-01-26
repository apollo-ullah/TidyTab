import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createTab } from '../services/tabService';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

export const CreateTab = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [createdTab, setCreatedTab] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const tab = await createTab({ name, description }, user);
      setCreatedTab({ id: tab.id, name: tab.name });
      toast.success('Tab created successfully!');
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating tab:', error);
      toast.error('Failed to create tab');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tab Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Tab'}
        </button>
      </form>

      {createdTab && (
        <div className="mt-8 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">Tab Created!</h3>
          <p className="text-sm text-gray-600">Share this QR code or Tab ID with others:</p>
          
          <div className="mt-4 flex flex-col items-center space-y-4">
            <QRCodeSVG
              value={createdTab.id}
              size={200}
              level="H"
              includeMargin
            />
            
            <div className="text-center">
              <p className="text-sm text-gray-500">Tab ID:</p>
              <code className="block mt-1 text-lg font-mono bg-gray-100 px-3 py-1 rounded">
                {createdTab.id}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 