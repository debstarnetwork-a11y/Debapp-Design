import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const filters = ["All", "Events", "Partnerships", "Field Work"];

export function Gallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [heroImage, setHeroImage] = useState(""); // TODO: Fetch from Supabase
  
  // Create mock items that have categories to make filters work
  const allItems = [
    {
      id: "fw-1",
      category: "Field Work",
      url: "https://i.ibb.co/1JzzZHfG/identity-theft-013.jpg"
    },
    {
      id: "p-1",
      category: "Partnerships",
      url: "https://i.ibb.co/s9fS9fWP/image06.jpg"
    },
    {
      id: "p-2",
      category: "Partnerships",
      url: "https://i.ibb.co/G4spy09t/image-03.jpg"
    },
    {
      id: "p-3",
      category: "Partnerships",
      url: "https://i.ibb.co/rRctcWn8/image-08.jpg"
    },
    {
      id: "e-1",
      category: "Events",
      url: "https://i.ibb.co/237XL7kL/identity-theft-004.jpg"
    },
    {
      id: "e-2",
      category: "Events",
      url: "https://i.ibb.co/Hfz3qT8K/kristalina.jpg"
    },
    {
      id: "e-3",
      category: "Events",
      url: "https://i.ibb.co/60yZSp7y/identity-theft-14.jpg"
    },
    {
      id: "fw-2",
      category: "Field Work",
      url: "https://i.ibb.co/yBgqhc7C/identity-theft-12.jpg"
    },
    {
      id: "fw-3",
      category: "Field Work",
      url: "https://i.ibb.co/NdpKvn9S/identity-theft-11.jpg"
    },
    {
      id: "fw-4",
      category: "Field Work",
      url: "https://i.ibb.co/spGgFCr4/image-10.jpg"
    }
  ];

  const filteredItems = activeFilter === "All" 
    ? allItems 
    : allItems.filter(item => item.category === activeFilter);

  /* 
   * TODO: SUPABASE INTEGRATION
   * 
   * const [images, setImages] = useState([]);
   * 
   * useEffect(() => {
   *   async function fetchGallery() {
   *     // Fetch gallery images from Supabase Storage bucket 'imrc-gallery'
   *     const { data, error } = await supabase.storage.from('imrc-gallery').list();
   *     if (data) setImages(data);
   *   }
   *   fetchGallery();
   * }, []);
   */

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section 
        className={cn("h-[40vh] min-h-[350px] flex items-center justify-center relative overflow-hidden", !heroImage && "bg-imrc-primary")}
        style={heroImage ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {heroImage && <div className="absolute inset-0 bg-imrc-primary/60 mix-blend-multiply" />}
        {!heroImage && <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />}
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-white mb-4">Gallery</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-light">
            Moments from our global operations, events, and partnerships.
          </p>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="section-padding bg-white min-h-[50vh]">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                  activeFilter === filter
                    ? "bg-imrc-primary text-white shadow-md"
                    : "bg-imrc-bg-alt text-imrc-primary hover:bg-imrc-secondary hover:text-white"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={cn(
                  "group aspect-[4/3] rounded-[12px] flex flex-col items-center justify-center text-center border-2 overflow-hidden relative",
                  item.url ? "border-transparent shadow-sm" : "bg-imrc-bg-alt p-6 border-dashed border-imrc-secondary/20 hover:border-imrc-secondary/50 transition-colors"
                )}
              >
                {item.url ? (
                  <>
                    <img src={item.url} alt={item.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-xs bg-white text-imrc-primary px-3 py-1 rounded-full font-bold shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon className="w-8 h-8 text-imrc-secondary" />
                    </div>
                    <p className="text-imrc-muted text-sm font-medium mb-1">
                      Image managed via Admin Dashboard
                    </p>
                    <span className="text-xs bg-imrc-primary/10 text-imrc-primary px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
