import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Platform {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  active: boolean;
  created_at: string;
}

export function usePlatforms() {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data as unknown as Platform[]) || [];
    },
  });
}

export function useActivePlatforms() {
  return useQuery({
    queryKey: ['platforms', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .eq('active', true)
        .order('name');
      if (error) throw error;
      return (data as unknown as Platform[]) || [];
    },
  });
}

export function useUpsertPlatform() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (platform: Partial<Platform> & { name: string; slug: string }) => {
      if (platform.id) {
        const { error } = await supabase
          .from('platforms')
          .update({ name: platform.name, slug: platform.slug, logo_url: platform.logo_url, active: platform.active } as any)
          .eq('id', platform.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('platforms')
          .insert({ name: platform.name, slug: platform.slug, logo_url: platform.logo_url ?? null, active: platform.active ?? true } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platforms'] }),
  });
}

export function useDeletePlatform() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('platforms').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platforms'] }),
  });
}
