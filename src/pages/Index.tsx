import { useMemo } from 'react';
import useLinks from '@/hooks/useLinks';
import useFilter from '@/hooks/useFilter';
import SimpleLazyLinkModal from '@/components/LazyLinkModal';
import SimpleKeyboardShortcuts from '@/components/LazyKeyboardShortcuts';
import { CategorySection } from '@/components/CategorySection';
import { LinkData } from '@/types';

function Index() {
  const { data: links, isLoading } = useLinks();
  const { filter, setFilter } = useFilter();

  const filteredLinks = useMemo(() => {
    if (!links) return [];
    if (!filter) return links;
    return links.filter(link =>
      link.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [links, filter]);

  const categories = useMemo(() => {
    const cats: Record<string, LinkData[]> = {};
    filteredLinks.forEach(link => {
      if (!cats[link.category]) {
        cats[link.category] = [];
      }
      cats[link.category].push(link);
    });
    return Object.entries(cats).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredLinks]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search Filter */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search links..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Categories */}
        {categories.map(([category, categoryLinks]) => (
          <CategorySection
            key={category}
            category={category}
            links={categoryLinks}
            categoryLabels={{}}
            categoryColors={{}}
            draggedItem={null}
            hoveredLink={null}
            clickedLink={null}
            onDragOver={() => {}}
            onDrop={() => {}}
            onLinkClick={() => {}}
            onEditLink={() => {}}
            onCopyUrl={() => {}}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            onDragStart={() => {}}
            onAddLink={() => {}}
            onDropUrl={() => {}}
            onReorderLinks={() => {}}
            onDeleteLink={() => {}}
            onToggleFavorite={() => {}}
            linkSize={80}
          />
        ))}

        <SimpleLazyLinkModal />
        <SimpleKeyboardShortcuts />
      </div>
    </div>
  );
}

export default Index;