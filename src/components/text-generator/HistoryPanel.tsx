import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DraftHistory, TemplateType } from '@/types/textGenerator';
import { templateConfigs } from '@/data/templateConfigs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  Search, 
  Trash2, 
  Copy, 
  Edit2, 
  MoreVertical,
  FileText,
  Check,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface HistoryPanelProps {
  drafts: DraftHistory[];
  onLoadDraft: (draft: DraftHistory) => void;
  onDeleteDraft: (id: string) => void;
  onDuplicateDraft: (draft: DraftHistory) => void;
  onRenameDraft: (id: string, newTitle: string) => void;
}

export const HistoryPanel = ({
  drafts,
  onLoadDraft,
  onDeleteDraft,
  onDuplicateDraft,
  onRenameDraft,
}: HistoryPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredDrafts = drafts.filter((draft) =>
    draft.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTemplateName = (templateId: TemplateType): string => {
    const template = templateConfigs.find((t) => t.id === templateId);
    return template?.name || templateId;
  };

  const handleStartEdit = (draft: DraftHistory) => {
    setEditingId(draft.id);
    setEditTitle(draft.title);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      onRenameDraft(id, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Riwayat & Draft</h3>
        <span className="ml-auto text-xs text-muted-foreground">{drafts.length} item</span>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari draft..."
          className="h-8 pl-8 text-sm"
        />
      </div>

      <ScrollArea className="h-[300px]">
        {filteredDrafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-8 w-8 text-muted-foreground/30" />
            <p className="mt-2 text-xs text-muted-foreground">
              {searchQuery ? 'Tidak ada draft yang cocok' : 'Belum ada draft tersimpan'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                className={cn(
                  "group rounded-lg border border-border bg-secondary/20 p-3 transition-all",
                  "hover:border-primary/30 hover:bg-secondary/40"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {editingId === draft.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-6 text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(draft.id);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveEdit(draft.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onLoadDraft(draft)}
                        className="w-full text-left"
                      >
                        <h4 className="truncate text-sm font-medium text-foreground">
                          {draft.title}
                        </h4>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {getTemplateName(draft.templateId)}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground/60">
                          {format(new Date(draft.updatedAt), 'd MMM yyyy, HH:mm', { locale: id })}
                        </p>
                      </button>
                    )}
                  </div>
                  
                  {editingId !== draft.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onLoadDraft(draft)}>
                          <FileText className="mr-2 h-3.5 w-3.5" />
                          Buka
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStartEdit(draft)}>
                          <Edit2 className="mr-2 h-3.5 w-3.5" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicateDraft(draft)}>
                          <Copy className="mr-2 h-3.5 w-3.5" />
                          Duplikasi
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteDraft(draft.id)}
                          className="text-red-400 focus:text-red-400"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
