import { test, expect } from '@playwright/test';
import { useCanvasStore } from '../src/store/useCanvasStore';
import { ToolData } from '../src/components/ToolCard';

test.describe('useCanvasStore', () => {
  test.beforeEach(() => {
    // Reset store to initial state before each test
    const store = useCanvasStore.getState();
    store.setSearchQuery('');
    store.setSelectedType('all');
    store.clearCart();
  });

  test('should have correct initial state', () => {
    const state = useCanvasStore.getState();
    expect(state.searchQuery).toBe('');
    expect(state.selectedType).toBe('all');
    expect(state.cart).toEqual([]);
  });

  test('setSearchQuery should update searchQuery', () => {
    const store = useCanvasStore.getState();
    store.setSearchQuery('react');
    expect(useCanvasStore.getState().searchQuery).toBe('react');
  });

  test('setSelectedType should update selectedType', () => {
    const store = useCanvasStore.getState();
    store.setSelectedType('prompt');
    expect(useCanvasStore.getState().selectedType).toBe('prompt');
  });

  test('addToCart should add a tool to the cart', () => {
    const store = useCanvasStore.getState();
    const mockTool: ToolData = {
      id: 'tool-1',
      title: 'Tool 1',
      type: 'prompt',
      description: 'Test description',
      updatedAt: new Date().toISOString()
    };

    store.addToCart(mockTool);
    expect(useCanvasStore.getState().cart).toHaveLength(1);
    expect(useCanvasStore.getState().cart[0]).toEqual(mockTool);
  });

  test('addToCart should not add duplicate tools', () => {
    const store = useCanvasStore.getState();
    const mockTool: ToolData = {
      id: 'tool-1',
      title: 'Tool 1',
      type: 'prompt',
      description: 'Test description',
      updatedAt: new Date().toISOString()
    };

    store.addToCart(mockTool);
    store.addToCart(mockTool);

    expect(useCanvasStore.getState().cart).toHaveLength(1);
  });

  test('removeFromCart should remove tool from cart by id', () => {
    const store = useCanvasStore.getState();
    const mockTool1: ToolData = {
      id: 'tool-1',
      title: 'Tool 1',
      type: 'prompt',
      description: 'Test description',
      updatedAt: new Date().toISOString()
    };
    const mockTool2: ToolData = {
      id: 'tool-2',
      title: 'Tool 2',
      type: 'skill',
      description: 'Test description 2',
      updatedAt: new Date().toISOString()
    };

    store.addToCart(mockTool1);
    store.addToCart(mockTool2);

    store.removeFromCart('tool-1');

    expect(useCanvasStore.getState().cart).toHaveLength(1);
    expect(useCanvasStore.getState().cart[0].id).toBe('tool-2');
  });

  test('clearCart should remove all tools from cart', () => {
    const store = useCanvasStore.getState();
    const mockTool1: ToolData = {
      id: 'tool-1',
      title: 'Tool 1',
      type: 'prompt',
      description: 'Test description',
      updatedAt: new Date().toISOString()
    };

    store.addToCart(mockTool1);
    expect(useCanvasStore.getState().cart).toHaveLength(1);

    store.clearCart();

    expect(useCanvasStore.getState().cart).toHaveLength(0);
  });
});
