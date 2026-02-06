type Item = {
    id: string;
    name: string;
    parent_id?: string;
};

type TreeNode = {
    value: string;
    title: string;
    children?: TreeNode[];
};

export function buildTreeData(
    level1: Item[],
    level2: Item[],
    level3: Item[]
): TreeNode[] {
    // Групуємо level3 за parent_id
    const level3Map = level3.reduce((acc, item) => {
        if (!acc[item.parent_id!]) acc[item.parent_id!] = [];
        acc[item.parent_id!].push({
            value: item.id,
            title: item.name,
        });
        return acc;
    }, {} as Record<string, TreeNode[]>);

    // Групуємо level2 з включенням дочірніх з level3
    const level2Map = level2.reduce((acc, item) => {
        const children = level3Map[item.id];
        const node: TreeNode = {
            value: item.id,
            title: item.name,
            ...(children ? {children} : {}),
        };
        if (!acc[item.parent_id!]) acc[item.parent_id!] = [];
        acc[item.parent_id!].push(node);
        return acc;
    }, {} as Record<string, TreeNode[]>);

    // Формуємо фінальну структуру
    const treeData: TreeNode[] = level1.map(item => {
        const children = level2Map[item.id];
        return {
            value: item.id,
            title: item.name,
            ...(children ? {children} : {}),
        };
    });

    return treeData;
}
