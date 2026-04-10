import { useState } from "react";
import { useRoute } from "wouter";

export default function Editor() {
  const [, params] = useRoute("/editor/:id");

  const [slides, setSlides] = useState([
    { title: "Slide 1", content: "Edit your slide..." },
  ]);

  const updateSlide = (index: number, value: string) => {
    const updated = [...slides];
    updated[index].content = value;
    setSlides(updated);
  };

  return (
    <div className="grid grid-cols-3 min-h-screen">
      {/* Slide list */}
      <aside className="border-r p-4">
        {slides.map((s, i) => (
          <div key={i} className="p-3 mb-2 bg-muted rounded cursor-pointer">
            {s.title}
          </div>
        ))}
      </aside>

      {/* Slide editor */}
      <main className="col-span-2 p-8">
        <textarea
          className="w-full h-100 border rounded-lg p-4"
          value={slides[0].content}
          onChange={e => updateSlide(0, e.target.value)}
        />
      </main>
    </div>
  );
}
