-- Drop existing constraint
ALTER TABLE "Purchase" DROP CONSTRAINT IF EXISTS "Purchase_productId_Product_id_fk";

-- Re-add with CASCADE
ALTER TABLE "Purchase" 
ADD CONSTRAINT "Purchase_productId_Product_id_fk" 
FOREIGN KEY ("productId") 
REFERENCES "Product"("id") 
ON DELETE CASCADE;
