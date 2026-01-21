'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ShoppingCart, ArrowLeft, History } from 'lucide-react';
import Link from 'next/link';
import { useShoppingList, DEFAULT_STORES } from '../../hooks/useShoppingList';

export default function ShoppingListClient() {
    // Use Custom Hook
    const {
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
    } = useShoppingList();

    // Local UI State
    const [newItemName, setNewItemName] = useState('');
    const [selectedStore, setSelectedStore] = useState(DEFAULT_STORES[0]);

    // Custom store inputs
    const [isAddingStore, setIsAddingStore] = useState(false);
    const [newStoreName, setNewStoreName] = useState('');
    const newStoreInputRef = useRef<HTMLInputElement>(null);

    // Initialize selectedStore if needed when stores load or change
    useEffect(() => {
        if (isLoaded && stores.length > 0 && !stores.includes(selectedStore)) {
            setSelectedStore(stores[0]);
        }
    }, [stores, isLoaded, selectedStore]);

    // Focus input when adding store
    useEffect(() => {
        if (isAddingStore && newStoreInputRef.current) {
            newStoreInputRef.current.focus();
        }
    }, [isAddingStore]);

    // Handlers
    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        addItem(newItemName, selectedStore);
        setNewItemName('');
    };

    const handleAddCustomStore = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newStoreName.trim();
        if (!trimmed) return;

        addStore(trimmed);
        setSelectedStore(trimmed);

        setNewStoreName('');
        setIsAddingStore(false);
    };

    const handleClearCompleted = () => {
        if (window.confirm('履歴をすべて削除しますか？')) {
            clearCompleted();
        }
    };

    if (!isLoaded) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center text-gray-600 hover:text-[#4caf50] transition-colors" {...({} as any)}>
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        <span className="font-medium text-sm">TOPへ</span>
                    </Link>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-2 text-[#4caf50]" />
                        お買い物リスト
                    </h1>
                    <div className="w-16"></div> {/* Spacer */}
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6">
                {/* Add Item Form */}
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 border border-gray-100">
                    <form onSubmit={handleAddItem} className="flex flex-col gap-3">
                        {/* Store Selection */}
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar items-center">
                            {stores.map((store) => (
                                <button
                                    key={store}
                                    type="button"
                                    onClick={() => setSelectedStore(store)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedStore === store
                                        ? 'bg-[#4caf50] text-white shadow-md transform scale-105'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {store}
                                </button>
                            ))}

                            {/* Add Store Button / Input */}
                            {isAddingStore ? (
                                <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 h-[36px]">
                                    <input
                                        ref={newStoreInputRef}
                                        type="text"
                                        value={newStoreName}
                                        onChange={(e) => setNewStoreName(e.target.value)}
                                        onBlur={() => {
                                            if (!newStoreName.trim()) setIsAddingStore(false);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddCustomStore(e);
                                            }
                                            if (e.key === 'Escape') {
                                                setIsAddingStore(false);
                                            }
                                        }}
                                        placeholder="新しいお店..."
                                        className="bg-transparent border-none focus:ring-0 text-sm w-24 px-1 text-gray-800 placeholder-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCustomStore}
                                        className="bg-[#4caf50] text-white rounded-full p-1 hover:bg-[#43a047] transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsAddingStore(true)}
                                    className="flex items-center px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300 transition-all"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    追加
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder={`${selectedStore}で買うもの...`}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4caf50]/50 transition-all font-medium"
                            />
                            <button
                                type="submit"
                                disabled={!newItemName.trim()}
                                className="bg-[#4caf50] text-white p-3 rounded-xl hover:bg-[#43a047] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Active Items List */}
                {activeItems.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">買うものはありません</p>
                    </div>
                )}

                <div className="space-y-6">
                    {Object.entries(groupedActiveItems).map(([store, storeItems]) => (
                        <div key={store} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-bold text-gray-700 flex items-center">
                                    <span className="w-2 h-6 bg-[#4caf50] rounded-full mr-2"></span>
                                    {store}
                                </h2>
                                <span className="text-xs font-medium text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-100">
                                    {storeItems.length}
                                </span>
                            </div>
                            <div>
                                {storeItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                                    >
                                        <label className="flex items-center flex-1 cursor-pointer select-none">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={item.checked}
                                                    onChange={() => toggleItem(item.id)}
                                                    className="sr-only"
                                                />
                                                <div className="w-6 h-6 rounded-lg border-2 border-gray-300 group-hover:border-[#4caf50] transition-all flex items-center justify-center">
                                                    {/* Empty box for active items checking */}
                                                </div>
                                            </div>
                                            <span className="ml-3 text-base font-medium text-gray-800">
                                                {item.name}
                                            </span>
                                        </label>
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 ml-2"
                                            aria-label="削除"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Separator */}
                {completedItems.length > 0 && (
                    <>
                        <div className="my-10 border-t-2 border-dashed border-gray-200" />

                        {/* History / Completed Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-gray-500 font-bold flex items-center">
                                    <History className="w-5 h-5 mr-2" />
                                    最近買ったもの
                                </h3>
                                <button
                                    onClick={handleClearCompleted}
                                    className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-full transition-colors"
                                >
                                    履歴を削除
                                </button>
                            </div>

                            <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                                {completedItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-white transition-colors group"
                                    >
                                        <div className="flex-1 flex items-center min-w-0">
                                            <span className="text-gray-600 text-sm w-24 flex-shrink-0 truncate mr-2 opacity-70">
                                                {item.store}
                                            </span>
                                            <span className="text-gray-400 font-medium line-through decoration-gray-400/50 truncate">
                                                {item.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center pl-4">
                                            <button
                                                onClick={() => toggleItem(item.id)}
                                                className="w-10 h-10 rounded-full bg-white border border-gray-200 text-[#4caf50] shadow-sm hover:shadow-md hover:bg-[#4caf50] hover:text-white flex items-center justify-center transition-all active:scale-95"
                                                title="リストに戻す"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => deleteItem(item.id)}
                                                className="w-8 h-8 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors ml-2 opacity-0 group-hover:opacity-100"
                                                title="削除"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
