import { create } from "zustand";
import { ToolData } from "@/components/ToolCard";

interface CanvasState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: "all" | "prompt" | "skill" | "mcp";
  setSelectedType: (type: "all" | "prompt" | "skill" | "mcp") => void;
  cart: ToolData[];
  addToCart: (tool: ToolData) => void;
  removeFromCart: (toolId: string) => void;
  clearCart: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedType: "all",
  setSelectedType: (type) => set({ selectedType: type }),
  cart: [],
  addToCart: (tool) => set((state) => ({
    cart: state.cart.find(t => t.id === tool.id) ? state.cart : [...state.cart, tool]
  })),
  removeFromCart: (toolId) => set((state) => ({
    cart: state.cart.filter(t => t.id !== toolId)
  })),
  clearCart: () => set({ cart: [] })
}));
