export interface FoodItem {
    id: number;
    name: string;
    category: string;
    daysLeft: number;
    totalDays: number;
    quantity: string;
    status: 'expired' | 'critical' | 'warning' | 'safe';
    location: 'refrigerator' | 'freezer' | 'pantry';
    icon: string;
}

export const getProgress = (item: FoodItem): number => {
    if (item.daysLeft <= 0) return 100;
    return Math.max(0, 100 - (item.daysLeft / item.totalDays) * 100);
};

export const getStatusColor = (status: FoodItem['status']): string => {
    switch (status) {
        case 'expired':
            return '#ef4444';
        case 'critical':
            return '#f97316';
        case 'warning':
            return '#f59e0b';
        default:
            return '#6B8E6B';
    }
};

export const getStatusText = (item: FoodItem): string => {
    if (item.daysLeft === 0) return 'Limit Today';
    if (item.daysLeft > 30) return 'Stable';
    return `In ${item.daysLeft} Days`;
};
