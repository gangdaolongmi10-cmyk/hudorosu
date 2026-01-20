import { useState, useEffect, useMemo } from 'react';

// Types
export type ShoppingItem = {
    id: string;
    name: string;
    store: string;
    checked: boolean;
    createdAt: number;
};

// Constants
const STORAGE_KEY = 'hudorosu_shopping_list';
const STORAGE_KEY_STORES = 'hudorosu_shopping_stores';
export const DEFAULT_STORES = ['スーパー', 'ドラッグストア', 'コンビニ', 'その他'];

export function useShoppingList() {
    // State
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [stores, setStores] = useState<string[]>(DEFAULT_STORES);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        // Load items
        const savedItems = localStorage.getItem(STORAGE_KEY);
        if (savedItems) {
            try {
                setItems(JSON.parse(savedItems));
            } catch (e) {
                console.error('Failed to parse shopping list', e);
            }
        }

        // Load stores
        const savedStores = localStorage.getItem(STORAGE_KEY_STORES);
        if (savedStores) {
            try {
                const parsedStores = JSON.parse(savedStores);
                if (Array.isArray(parsedStores) && parsedStores.length > 0) {
                    setStores(parsedStores);
                }
            } catch (e) {
                console.error('Failed to parse (stores)', e);
            }
        }

        setIsLoaded(true);
    }, []);

    // Save to LocalStorage whenever items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

    // Save stores to LocalStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY_STORES, JSON.stringify(stores));
        }
    }, [stores, isLoaded]);

    // Actions
    const addItem = (name: string, store: string) => {
        if (!name.trim()) return;

        const newItem: ShoppingItem = {
            id: crypto.randomUUID(),
            name: name.trim(),
            store: store,
            checked: false,
            createdAt: Date.now(),
        };

        setItems((prev) => [...prev, newItem]);
    };

    const toggleItem = (id: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const deleteItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCompleted = () => {
        setItems((prev) => prev.filter((item) => !item.checked));
    };

    const addStore = (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;

        if (!stores.includes(trimmed)) {
            setStores(prev => [...prev, trimmed]);
        }
    };

    // Split items into active and completed
    const { activeItems, completedItems } = useMemo(() => {
        const active: ShoppingItem[] = [];
        const completed: ShoppingItem[] = [];

        const sortedItems = [...items].sort((a, b) => a.createdAt - b.createdAt);

        sortedItems.forEach(item => {
            if (item.checked) {
                completed.push(item);
            } else {
                active.push(item);
            }
        });

        return { activeItems: active, completedItems: completed };
    }, [items]);

    // Group active items by store
    const groupedActiveItems = useMemo(() => {
        const groups: Record<string, ShoppingItem[]> = {};

        activeItems.forEach((item) => {
            if (!groups[item.store]) {
                groups[item.store] = [];
            }
            groups[item.store].push(item);
        });

        return groups;
    }, [activeItems]);

    return {
        items,
        stores,
        isLoaded,
        activeItems,
        completedItems,
        groupedActiveItems,
        addItem,
        toggleItem,
        deleteItem,
        clearCompleted,
        addStore
    };
}
