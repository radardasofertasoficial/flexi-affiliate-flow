import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CategoryBarProps {
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryBar = ({ selected, onSelect }: CategoryBarProps) => {
  const [categories, setCategories] = useState<string[]>(['Todos']);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('name').order('name');
      setCategories(['Todos', ...(data?.map(c => c.name) || [])]);
    };
    fetchCategories();
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selected === cat
                  ? 'bg-cta text-cta-foreground shadow-cta'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
