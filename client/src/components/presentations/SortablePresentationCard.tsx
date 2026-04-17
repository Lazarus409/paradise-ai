import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, GripVertical } from "lucide-react";

interface Props {
  presentation: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SortablePresentationCard({
  presentation,
  onEdit,
  onDelete,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: presentation.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border-border/70 bg-card/90 transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <CardContent className="flex items-center justify-between gap-4 py-5">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-full bg-muted p-2 text-muted-foreground">
            <GripVertical className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold">{presentation.title}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(
                presentation.createdAt || presentation.created_at
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(presentation.id)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(presentation.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
