SELECT p.name as product_name, c.name as category_name 
FROM "Product" p 
JOIN "Category" c ON p."categoryId" = c.id 
WHERE c.name = 'lasmen';
