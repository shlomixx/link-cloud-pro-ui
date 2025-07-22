import { useMemo } from 'react';
import useLinks from '@/hooks/useLinks';
import useFilter from '@/hooks/useFilter';
import LazyLinkModal from '@/components/LazyLinkModal';
import LazyKeyboardShortcuts from '@/components/LazyKeyboardShortcuts';
import LazyCategorySection from '@/components/LazyCategorySection'; // <-- תיקון: ייבוא הקומפוננטה החדשה

function Index() {
  const { data: links, isLoading } = useLinks();
  const { filter, setFilter } = useFilter();

  const filteredLinks = useMemo(() => {
    // ... לוגיקת הסינון נשארת זהה
    if (!links) return [];
    if (!filter) return links;
    return links.filter(link =>
      link.title.toLowerCase().includes(filter.toLowerCase())
    );
  }, [links, filter]);

  const categories = useMemo(() => {
    // ... לוגיקת יצירת הקטגוריות נשארת זהה
    const-cats = {};
    filteredLinks.forEach(link => {
      if (!cats[link.category]) {
        cats[link.category] = [];
      }
      cats[link.category].push(link);
    });
    return Object.entries(cats).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredLinks]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* ===============================================================
        תיקון מס' 4: Lazy Loading של קטגוריות
        במקום לעבור על כל הקטגוריות ולרנדר אותן ישירות,
        אנחנו משתמשים בקומפוננטה 'LazyCategorySection'.
        היא תדאג לרנדר את 'CategorySection' האמיתית רק כשהמשתמש
        גולל לאזור שלה. זה מפחית דרמטית את כמות האלמנטים ב-DOM
        בטעינה הראשונית ומשפר את הביצועים.
        ===============================================================
      */}
      {categories.map(([category, links]) => (
        <LazyCategorySection
          key={category}
          category={category}
          links={links}
        />
      ))}

      <LazyLinkModal />
      <LazyKeyboardShortcuts />
    </div>
  );
}

export default Index;